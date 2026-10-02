// Weekly check: imports the source materials of every source language with the
// app's own AYF type detection and compares each part with the English workbook.
// Run through scripts/run-source-materials-check.mjs: npm run sources:check [-- --report report.md] [-- --update-baseline]
import fs from 'node:fs';
import path from 'node:path';
import { LANGUAGE_LIST } from '@constants/index';
import { AssignmentAYFOnlyType, AssignmentCode } from '@definition/assignment';
import {
  AYFLookup,
  buildAYFLookup,
  getAssType,
  withAYFLabelAliases,
} from '@services/app/ayf_type';

const API =
  process.env.SOURCE_MATERIALS_API ||
  'https://source-materials.organized-app.com';
const BASELINE_PATH = path.join(
  process.cwd(),
  'scripts',
  'source-materials-baseline.json'
);

// Same AYF assignment names as dbAssignmentUpdate in src/services/dexie/assignment.ts
const AYF_KEYS: Record<string, number> = {
  tr_initialCall: AssignmentCode.MM_InitialCall,
  tr_returnVisit: AssignmentCode.MM_ReturnVisit,
  tr_bibleStudy: AssignmentCode.MM_BibleStudy,
  tr_talk: AssignmentCode.MM_Talk,
  tr_initialCallVideo: AssignmentCode.MM_InitialCallVideo,
  tr_returnVisitVideo: AssignmentCode.MM_ReturnVisitVideo,
  tr_otherPart: AssignmentCode.MM_Other,
  tr_memorialInvite: AssignmentCode.MM_Memorial,
  tr_memorialInviteVideo: AssignmentCode.MM_MemorialVideo,
  tr_assistantOnly: AssignmentCode.MM_AssistantOnly,
  tr_startingConversation: AssignmentCode.MM_StartingConversation,
  tr_followingUp: AssignmentCode.MM_FollowingUp,
  tr_makingDisciples: AssignmentCode.MM_MakingDisciples,
  tr_explainingBeliefs: AssignmentCode.MM_ExplainingBeliefs,
  tr_discussion: AssignmentCode.MM_Discussion,
};

// accepted: reviewed mismatches caused by typos in the workbook itself,
// added only with --accept-mismatches
type Baseline = {
  labels: Record<string, string[]>;
  noData: string[];
  accepted: string[];
};

type IncomingWeek = Record<string, string | number | undefined>;

const args = process.argv.slice(2);
const reportPath = args.includes('--report')
  ? args[args.indexOf('--report') + 1]
  : undefined;
const updateBaseline = args.includes('--update-baseline');
const acceptMismatches = args.includes('--accept-mismatches');

const loadLocale = (folder: string) => {
  const dir = path.join(process.cwd(), 'src', 'locales', folder);
  const result: Record<string, string> = {};

  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    Object.assign(
      result,
      JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
    );
  }

  return result;
};

const english = loadLocale('en');

// Mirrors getAYFAssignmentTypes, including the initial call and return visit variations
const getAssignmentTypes = (code: string, localeFolder: string) => {
  const locale = loadLocale(localeFolder);
  const translate = (key: string) => locale[key] ?? english[key] ?? '';

  const list: AssignmentAYFOnlyType[] = Object.entries(AYF_KEYS).map(
    ([key, value]) => ({ label: translate(key), value })
  );

  const variations = [
    { key: 'tr_initialCallVariations', start: 140, end: 170 },
    { key: 'tr_returnVisitVariations', start: 170, end: 200 },
  ];

  for (const { key, start, end } of variations) {
    const value = translate(key);
    if (!value || value === '0') continue;

    value
      .split('|')
      .slice(0, end - start)
      .forEach((label, index) => list.push({ label, value: start + index }));
  }

  return withAYFLabelAliases(
    list.filter((record) => record.label.length > 0),
    code
  );
};

// Variation codes stand for the part they are linked to
const resolveVariation = (week: string, type: number) => {
  if (type >= 140 && type < 170) {
    return week < '2024/01/01' ? 101 : 123;
  }

  if (type >= 170 && type < 200) {
    return week < '2024/01/01' ? 102 : 124;
  }

  return type;
};

const isKnownLabel = (lookup: AYFLookup, label: string) => {
  const exact = label.replaceAll('​', '').trim().toLowerCase();
  if (lookup.exactMap.has(exact)) return true;

  const normalized = label
    .replaceAll('​', '')
    .replace(/\([^)]{0,1000}\)/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();

  return lookup.prefixList.some((type) =>
    normalized.startsWith(type.normalized)
  );
};

// Same fallback as sourcesFormatAndSaveData
const getWeekOf = (week: IncomingWeek) =>
  String(week.mwb_week_date || week.week_date || '');

const fetchWeeks = async (code: string) => {
  const res = await fetch(`${API}/api/${code}`);

  if (res.status === 404) return [];
  if (!res.ok)
    throw new Error(`Materials API returned ${res.status} for ${code}`);

  const data = (await res.json()) as IncomingWeek[];
  if (!Array.isArray(data)) {
    throw new Error(`Materials API returned no list for ${code}`);
  }

  return data.filter((record) => getWeekOf(record) && record.mwb_ayf_count);
};

const getLabels = (week: IncomingWeek) => {
  const count = Number(week.mwb_ayf_count);

  return Array.from({ length: count }, (_, index) =>
    String(week[`mwb_ayf_part${index + 1}_type`] ?? '')
  );
};

const typeName = (type: number) => AssignmentCode[type] ?? String(type);

const sortText = (items: Iterable<string>) =>
  [...items].sort((a, b) => a.localeCompare(b));

const readBaseline = (): Baseline => {
  try {
    return JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));
  } catch {
    return { labels: {}, noData: [], accepted: [] };
  }
};

const buildReference = (englishWeeks: IncomingWeek[], baseline: Baseline) => {
  const lookup = buildAYFLookup(getAssignmentTypes('E', 'en'));
  const types = new Map<string, number>();
  const partCounts = new Map<string, number>();
  const unknown = new Set<string>();

  for (const week of englishWeeks) {
    const weekOf = getWeekOf(week);
    const labels = getLabels(week);

    partCounts.set(weekOf, labels.length);

    labels.forEach((label, index) => {
      if (!isKnownLabel(lookup, label) && !baseline.labels.E?.includes(label)) {
        unknown.add(label);
      }

      const type = getAssType(lookup, label, weekOf);
      types.set(`${weekOf}#${index}`, resolveVariation(weekOf, type));
    });
  }

  return { types, partCounts, unknown };
};

type Reference = ReturnType<typeof buildReference>;

type Finding = { key: string; row: string[] };

const checkLanguage = (
  code: string,
  locale: string,
  weeks: IncomingWeek[],
  reference: Reference
) => {
  const lookup = buildAYFLookup(getAssignmentTypes(code, locale));
  const language = `${code} (${locale})`;
  const findings: Finding[] = [];
  const labels = new Set<string>();
  const weekDates = new Set(weeks.map(getWeekOf));

  for (const [weekOf, englishCount] of reference.partCounts) {
    if (weekDates.has(weekOf)) continue;

    findings.push({
      key: `${code}|${weekOf}|missing`,
      row: [
        language,
        weekOf,
        '-',
        'missing week',
        '-',
        `${englishCount} parts`,
      ],
    });
  }

  for (const week of weeks) {
    const weekOf = getWeekOf(week);
    const weekLabels = getLabels(week);
    const englishCount = reference.partCounts.get(weekOf);

    weekLabels.forEach((label) => labels.add(label));

    if (englishCount === undefined) {
      findings.push({
        key: `${code}|${weekOf}|extra`,
        row: [
          language,
          weekOf,
          '-',
          `${weekLabels.length} parts`,
          '-',
          'no English week',
        ],
      });
      continue;
    }

    if (englishCount !== weekLabels.length) {
      findings.push({
        key: `${code}|${weekOf}|parts|${weekLabels.length}|${englishCount}`,
        row: [
          language,
          weekOf,
          '-',
          `${weekLabels.length} parts`,
          '-',
          `${englishCount} parts`,
        ],
      });
    }

    weekLabels.forEach((label, index) => {
      const target = reference.types.get(`${weekOf}#${index}`);
      if (target === undefined) return;

      const actual = resolveVariation(
        weekOf,
        getAssType(lookup, label, weekOf)
      );
      if (actual === target) return;

      const part = String(index + 1);
      findings.push({
        key: `${code}|${weekOf}|${part}|${label}|${typeName(actual)}|${typeName(target)}`,
        row: [
          language,
          weekOf,
          part,
          label,
          typeName(actual),
          typeName(target),
        ],
      });
    });
  }

  return { findings, labels: sortText(labels) };
};

// Workbook text goes into an issue, so it must not break the table or mention anyone
const escapeMarkdown = (text: string) =>
  text
    .replaceAll('|', '\\|')
    .replaceAll('`', '\\`')
    .replaceAll('<', '&lt;')
    .replaceAll('@', '&#64;');

const table = (header: string[], rows: string[][]) => {
  const line = (cells: string[]) =>
    `| ${cells.map(escapeMarkdown).join(' | ')} |`;

  return [line(header), line(header.map(() => '---')), ...rows.map(line)].join(
    '\n'
  );
};

const bullets = (items: string[]) =>
  items.map((item) => `- ${escapeMarkdown(item)}`).join('\n');

const section = (title: string, body: string) => `### ${title}\n\n${body}`;

const main = async () => {
  const baseline = readBaseline();

  const languages = LANGUAGE_LIST.filter((record) => record.source).filter(
    (record, index, list) =>
      list.findIndex((item) => item.code === record.code) === index
  );

  const englishWeeks = await fetchWeeks('E');
  if (englishWeeks.length === 0) {
    throw new Error('No English weeks to compare against');
  }

  const reference = buildReference(englishWeeks, baseline);

  const allWeeks = await Promise.all(
    languages.map((language) => fetchWeeks(language.code.toUpperCase()))
  );

  const findings: Finding[] = [];
  const newLabels: string[][] = [];
  const noData: string[] = [];
  const recovered: string[] = [];
  const currentLabels: Record<string, string[]> = {};

  languages.forEach((language, index) => {
    const code = language.code.toUpperCase();
    const weeks = allWeeks[index];

    if (weeks.every((week) => !getLabels(week)[0])) {
      noData.push(code);
      return;
    }

    if (baseline.noData.includes(code)) recovered.push(code);

    const result = checkLanguage(code, language.locale, weeks, reference);
    findings.push(...result.findings);
    currentLabels[code] = result.labels;

    const known = new Set(baseline.labels[code] ?? []);
    result.labels
      .filter((label) => !known.has(label))
      .forEach((label) =>
        newLabels.push([`${code} (${language.locale})`, label])
      );
  });

  const openFindings = findings.filter(
    (finding) => !baseline.accepted.includes(finding.key)
  );
  const newNoData = noData.filter((code) => !baseline.noData.includes(code));

  const sections: string[] = [];

  if (openFindings.length > 0) {
    const header = [
      'Language',
      'Week',
      'Part',
      'Label',
      'Imported as',
      'Expected (English)',
    ];
    sections.push(
      section(
        'Parts imported with the wrong type or count',
        table(
          header,
          openFindings.map((finding) => finding.row)
        )
      )
    );
  }

  if (reference.unknown.size > 0) {
    sections.push(
      section(
        'New English labels the app does not recognize (imported as Discussion)',
        bullets([...reference.unknown])
      )
    );
  }

  if (newNoData.length > 0) {
    sections.push(
      section('Languages without source materials', bullets(newNoData))
    );
  }

  if (newLabels.length > 0) {
    sections.push(
      section(
        'New workbook labels (imported correctly, review and add to the baseline)',
        table(['Language', 'Label'], newLabels)
      )
    );
  }

  if (recovered.length > 0) {
    sections.push(
      section('Languages that have source materials again', bullets(recovered))
    );
  }

  const summary = `Checked ${languages.length} languages against ${englishWeeks.length} English weeks.`;
  const footer =
    'Once the findings are handled, record new labels with `npm run sources:check -- --update-baseline`. Add `--accept-mismatches` only for mismatches you reviewed as typos in the workbook.';

  const report =
    sections.length > 0
      ? `## Source materials check\n\n${summary}\n\n${sections.join('\n\n')}\n\n${footer}\n`
      : '';

  if (updateBaseline) {
    const accepted = acceptMismatches
      ? [...baseline.accepted, ...findings.map((finding) => finding.key)]
      : baseline.accepted;

    const merged: Baseline = {
      labels: { ...baseline.labels },
      noData: sortText(noData),
      accepted: sortText(new Set(accepted)),
    };

    for (const [code, labels] of Object.entries(currentLabels)) {
      merged.labels[code] = sortText(
        new Set([...(merged.labels[code] ?? []), ...labels])
      );
    }

    fs.writeFileSync(BASELINE_PATH, `${JSON.stringify(merged, null, 2)}\n`);
    console.log(`Baseline updated: ${BASELINE_PATH}`);
  }

  if (reportPath) fs.writeFileSync(reportPath, report);

  if (report) {
    console.log(report);
    process.exitCode = 1;
  } else {
    console.log(`All languages import correctly. ${summary}`);
  }
};

export default main;
