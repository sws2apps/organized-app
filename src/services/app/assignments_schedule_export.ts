// services/app/assignments_schedule_export.ts
import { AssignmentCode } from '@definition/assignment';

import { FieldServiceGroupType } from '@definition/field_service_groups';
import { PersonType } from '@definition/person';
import {
  AssignmentCongregation,
  AssignmentHistoryType,
  SchedWeekType,
} from '@definition/schedules';
import { SettingsType } from '@definition/settings';
import { ApplyMinistryType, SourceWeekType } from '@definition/sources';
import { ASSIGNMENT_DEFAULTS, ASSIGNMENT_PATH } from '@constants/index';
import { store } from '@states/index';
import { personsByViewState } from '@states/persons';
import { sourcesState } from '@states/sources';
import {
  AssignmentStatisticsComplete,
  getDataViewsWithMeetings,
  getPersonsAssignmentMetrics,
  getPersonsWeightingMetrics,
} from './assignments_with_stats';
import { FixedAssignmentsByCode } from './autofill';
import {
  buildFixedAssignmentsByCode,
  processAssignmentSettings,
} from './autofill';
import { getAssignmentsWithStats } from './assignments_with_stats';
import { ASSIGNMENT_CONFLICTS } from '@constants/assignmentConflicts';
import { languageGroupsState } from '@states/field_service_groups';
import {
  isPublicTalkCoordinatorState,
  assignmentsHistoryState,
  schedulesState,
} from '@states/schedules';
import { settingsState } from '@states/settings';

import { JWLangLocaleState } from '@states/settings';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

export function getPropertyByPath<T>(
  obj: unknown,
  path: string
): T | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return path.split('.').reduce((acc: any, part) => acc && acc[part], obj) as T;
}

const getPersonName = (uid: string, persons: PersonType[]): string => {
  if (!uid) return '';
  const person = persons.find((p) => p.person_uid === uid);
  if (!person) return 'Unbekannt';
  return `${person.person_data.person_firstname.value} ${person.person_data.person_lastname.value}`;
};

/**
 * Returns the source title for a given assignment key.
 * Assistant keys inherit the title of their corresponding AYF part (same part index).
 */
const getSourceTitle = (
  key: string,
  source: SourceWeekType,
  langKey = 'X'
): string => {
  if (!source) return '';
  const mm = source.midweek_meeting;

  if (key.includes('TGWTalk')) return mm.tgw_talk?.src?.[langKey] ?? '';
  if (key.includes('TGWGems')) return mm.tgw_gems?.title?.[langKey] ?? '';
  if (key.includes('TGWBibleReading'))
    return mm.tgw_bible_reading?.title?.[langKey] ?? '';

  if (key.includes('LCPart1'))
    return (
      mm.lc_part1?.title?.default?.[langKey] ??
      mm.lc_part1?.title?.[langKey] ??
      ''
    );
  if (key.includes('LCPart2'))
    return (
      mm.lc_part2?.title?.default?.[langKey] ??
      mm.lc_part2?.title?.[langKey] ??
      ''
    );
  if (key.includes('LCPart3')) return mm.lc_part3?.title?.[0]?.value ?? '';
  if (key.includes('CBS'))
    return mm.lc_cbs?.title?.[0]?.value ?? 'Versammlungsbibelstudium';

  // AYF parts – covers _Student_, _Assistant_ and plain AYFPartN keys
  const ayfMatch = key.match(/AYFPart(\d+)/);
  if (ayfMatch) {
    const idx = ayfMatch[1];
    const partKey = `ayf_part${idx}` as keyof typeof mm;
    const part = mm[partKey] as ApplyMinistryType | undefined;
    return part?.src?.[langKey] ?? part?.title?.[langKey] ?? '';
  }
  return '';
};

/**
 * Resolves the AssignmentCode for a given key.
 * AYF parts are checked FIRST (dynamic source lookup),
 * then static defaults (Chairman, Prayer, etc.).
 */
const resolveCode = (
  key: string,
  source: SourceWeekType | undefined
): number => {
  // 1. AYF parts – immer dynamisch aus der Source auflösen
  //    Trifft auf _Student_, _Assistant_ und plain AYFPartN zu
  const ayfMatch = key.match(/AYFPart(\d+)/);
  if (ayfMatch) {
    if (key.includes('_Assistant_')) {
      // Assistent-Code ist immer MM_AssistantOnly, unabhängig vom Part-Typ
      return AssignmentCode.MM_AssistantOnly;
    }

    if (!source) return 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const part = (source.midweek_meeting as any)[`ayf_part${ayfMatch[1]}`];
    if (part?.type) {
      const typeVal = part.type['X'] ?? Object.values(part.type)[0];
      if (typeVal !== undefined) return Number(typeVal);
    }
    return 0;
  }

  // 2. Statische Defaults (Chairman, Prayer, BibleReading, CBS, …)
  if (ASSIGNMENT_DEFAULTS[key]) return ASSIGNMENT_DEFAULTS[key].code;

  return 0;
};

const getClassroom = (key: string, path: string): string => {
  if (key.includes('_B') || path.includes('aux_class_1')) return '2';
  if (path.includes('aux_class_2')) return '3';
  return '1';
};

// ─────────────────────────────────────────────
// Shared DOM helper (DRY)
// ─────────────────────────────────────────────

const triggerCsvDownload = (
  content: string,
  filename: string,
  mimeType: string
) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ─────────────────────────────────────────────
// exportScheduleToCSV  (Debug-Export)
// ─────────────────────────────────────────────

export const exportScheduleToCSV = (
  weeksList: SchedWeekType[],
  sources: SourceWeekType[],
  persons: PersonType[]
): string => {
  const headers = [
    'Dataview',
    'Date',
    'Code',
    'Key',
    'Description',
    'Room',
    'Name',
  ];
  const rows: string[] = [headers.join(';')];

  const assignmentKeys = Object.keys(ASSIGNMENT_PATH);

  weeksList.forEach((schedule) => {
    const source = sources.find((s) => s.weekOf === schedule.weekOf);

    assignmentKeys.forEach((key) => {
      const path = ASSIGNMENT_PATH[key as keyof typeof ASSIGNMENT_PATH];
      const rawData = getPropertyByPath<
        AssignmentCongregation | AssignmentCongregation[]
      >(schedule, path);
      if (!rawData) return;

      const assignmentData = (
        Array.isArray(rawData) ? rawData : [rawData]
      ) as AssignmentCongregation[];

      const code = resolveCode(key, source);
      const sourceTitle = source ? getSourceTitle(key, source) : '';
      const classroom = getClassroom(key, path);

      assignmentData.forEach((entry: AssignmentCongregation) => {
        if (!entry.value) return;

        rows.push(
          [
            entry.type,
            schedule.weekOf,
            code,
            key,
            `"${sourceTitle}"`,
            classroom,
            `"${getPersonName(entry.value, persons)}"`,
          ].join(';')
        );
      });
    });
  });

  return rows.join('\n');
};

// Zentraler Formatter für alle Dezimalzahlen im CSV
const fmt = (value: number, decimals = 4): string =>
  value.toFixed(decimals).replace('.', ',');

const fmtPct = (value: number, decimals = 2): string =>
  (value * 100).toFixed(decimals).replace('.', ',') + '%';

// ─────────────────────────────────────────────
// generateDeepAnalysisCSV
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// generateDeepAnalysisCSV
// ─────────────────────────────────────────────

export const generateDeepAnalysisCSV = (
  persons: PersonType[],
  history: AssignmentHistoryType[],
  languageGroups: FieldServiceGroupType[],
  sources: SourceWeekType[],
  schedules: SchedWeekType[],
  settings: SettingsType,
  assignmentsMetrics: AssignmentStatisticsComplete,
  fixedAssignmentsByCode?: FixedAssignmentsByCode
): string => {
  const relevantViews = getDataViewsWithMeetings(settings, languageGroups);
  console.log('relevantViews', relevantViews);

  // Base metrics berechnen (damit wir die fertigen Scores direkt nutzen können)
  const personsMetrics = getPersonsAssignmentMetrics(
    persons,
    relevantViews,
    assignmentsMetrics,
    fixedAssignmentsByCode
  );

  console.log('personsMetrics', personsMetrics);

  const weightingMetrics = getPersonsWeightingMetrics(
    persons,
    personsMetrics,
    assignmentsMetrics
  );
  console.log('weightingMetrics', weightingMetrics);

  const rows: string[] = [];
  // Spalte "Global Freq/Week" als neue Spalte vor "Task Base Value" eingefügt
  rows.push(
    'Dataview;Name;Weighting Factor;MM Score;WM Score;View Score;Total Global Score;Task;Code;Global Freq/Week;Task Base Value;Percentage Of Total;Eligible Count'
  );

  relevantViews.forEach((viewKey) => {
    const viewMetrics = assignmentsMetrics.get(viewKey);
    if (!viewMetrics) return;

    const viewFixedAssignments = fixedAssignmentsByCode?.get(viewKey);
    const personsMetricsForView = personsMetrics.get(viewKey);

    persons.forEach((person) => {
      const name = `${person.person_data.person_firstname.value} ${person.person_data.person_lastname.value}`;

      const pWeightMetrics = weightingMetrics.get(person.person_uid);
      const pMetrics = personsMetricsForView?.get(person.person_uid);

      const weightingFactor = fmt(pWeightMetrics?.weightingFactor ?? 1);
      const mmScore = fmt(pMetrics?.mm_globalScore ?? 0);
      const wmScore = fmt(pMetrics?.wm_globalScore ?? 0);
      const viewScore = fmt(pMetrics?.view_globalScore ?? 0);
      const totalGlobalScore = fmt(pWeightMetrics?.total_globalScore ?? 0);

      viewMetrics.forEach((codeMetrics, code) => {
        const currentCodeNum = Number(code);

        // 1. HARTE SPERRE: Unerwünschte Codes komplett aus der CSV verbannen
        if (currentCodeNum === AssignmentCode.WM_SpeakerSymposium) return;
        if (currentCodeNum === AssignmentCode.MINISTRY_HOURS_CREDIT) return;

        // 2. GRUND-BERECHTIGUNG: Ist die Person überhaupt für diesen Code vorgesehen?
        if (!codeMetrics.eligibleUIDS.has(person.person_uid)) return;

        // 3. KONFLIKT-CHECK: Ist die Aufgabe durch eine eigene feste Zuweisung blockiert?
        let isPersonBlocked = false;
        if (viewFixedAssignments) {
          for (const [
            fixedCode,
            fixedPersonUIDs,
          ] of viewFixedAssignments.entries()) {
            if (fixedPersonUIDs.has(person.person_uid)) {
              const conflicts = ASSIGNMENT_CONFLICTS[Number(fixedCode)] || [];
              if (conflicts.includes(currentCodeNum)) {
                isPersonBlocked = true;
              }
            }
          }
        }

        if (isPersonBlocked) return;

        const codeName =
          AssignmentCode[currentCodeNum] ?? `Code_${currentCodeNum}`;
        const globalFreq = codeMetrics.frequency; // HIER IST DER WERT

        let numEligible: number;

        // 4. FESTE ZUWEISUNG EINES ANDEREN: Hat jemand diese Aufgabe exklusiv?
        const fixedPersonUIDsForCode =
          viewFixedAssignments?.get(currentCodeNum);

        if (
          fixedPersonUIDsForCode !== undefined &&
          fixedPersonUIDsForCode.size > 0
        ) {
          if (fixedPersonUIDsForCode.has(person.person_uid)) {
            numEligible = fixedPersonUIDsForCode.size;
          } else {
            numEligible = 0;
          }
        } else {
          // 5. REGULÄRE AUFGABE: Exakte Anzahl berechnen (abzgl. blockierter Personen)
          let exactEligibleCount = 0;
          codeMetrics.eligibleUIDS.forEach((uid) => {
            let blocked = false;
            if (viewFixedAssignments) {
              for (const [fCode, fUIDs] of viewFixedAssignments.entries()) {
                if (fUIDs.has(uid)) {
                  const confs = ASSIGNMENT_CONFLICTS[Number(fCode)] || [];
                  if (confs.includes(currentCodeNum)) {
                    blocked = true;
                  }
                }
              }
            }
            if (!blocked) exactEligibleCount++;
          });

          numEligible = exactEligibleCount;
        }

        // 6. METRIKEN ABFRAGEN (statt sie hier manuell zu berechnen)
        const taskMetrics = pMetrics?.assignmentsScores?.get(currentCodeNum);
        const taskBaseValue = taskMetrics?.score ?? 0;
        const taskPercentage = taskMetrics?.percentageOfTotal ?? 0;

        // Wir blenden die Aufgabe für diese Person aus, wenn der Value 0 ist (z.B. weil jemand anderes fest zugeteilt ist)
        if (taskBaseValue === 0) return;

        rows.push(
          `${viewKey};${name};` +
            `${weightingFactor};${mmScore};${wmScore};${viewScore};${totalGlobalScore};` +
            `${codeName};${currentCodeNum};` +
            `${fmt(globalFreq)};` + // NEUE SPALTE EINGEFÜGT
            `${fmt(taskBaseValue)};` +
            `${fmtPct(taskPercentage)};` +
            `${numEligible}`
        );
      });
    });
  });

  return rows.join('\n');
};

// ─────────────────────────────────────────────
// Public Download-Handler
// ─────────────────────────────────────────────

export const downloadAnalysisCSV = (
  persons: PersonType[],
  languageGroups: FieldServiceGroupType[],
  sources: SourceWeekType[],
  schedules: SchedWeekType[],
  settings: SettingsType,
  history: AssignmentHistoryType[],
  assignmentsMetrics: AssignmentStatisticsComplete,
  isPublicTalkCoordinator: boolean
) => {
  const clonedPersons = structuredClone(persons);
  const clonedHistory = structuredClone(history);
  const sourceLocale = store.get(JWLangLocaleState);

  const assignmentsSettingsResult = processAssignmentSettings(
    settings,
    isPublicTalkCoordinator
  );
  const fixedAssignmentsByCode = buildFixedAssignmentsByCode(
    assignmentsSettingsResult.fixedAssignments
  );

  // 1. Symposium Codes in Standard-Redner (120) umwandeln für korrekte Scores
  clonedPersons.forEach((person) => {
    person.person_data.assignments.forEach((entry) => {
      let numericValues = entry.values.map(Number);

      if (numericValues.includes(AssignmentCode.WM_SpeakerSymposium)) {
        numericValues = numericValues.map((code) =>
          code === AssignmentCode.WM_SpeakerSymposium
            ? AssignmentCode.WM_Speaker
            : code
        );
        entry.values = Array.from(new Set(numericValues)); // Duplikate entfernen
      }
    });
  });

  clonedHistory.forEach((entry) => {
    if (Number(entry.assignment.code) === AssignmentCode.WM_SpeakerSymposium) {
      entry.assignment.code = AssignmentCode.WM_Speaker;
    }
  });

  // 2. Metriken NEU berechnen, damit Symposium in den Base-Scores nicht mehr existiert!
  const recalculatedMetrics = getAssignmentsWithStats(
    clonedPersons,
    sources,
    schedules,
    settings,
    languageGroups,
    sourceLocale
  );

  // 3. CSV mit der robusten On-the-fly-Logik generieren
  const csvContent = generateDeepAnalysisCSV(
    clonedPersons,
    clonedHistory,
    languageGroups,
    sources,
    schedules,
    settings,
    recalculatedMetrics,
    fixedAssignmentsByCode
  );

  triggerCsvDownload(
    '\uFEFF' + csvContent,
    `analysis_export_${new Date().toISOString().slice(0, 10)}.csv`,
    'text/csv;charset=utf-8;'
  );
};

export const handleDownloadDebugCSV = () => {
  const weeks = store.get(schedulesState);
  const sources = store.get(sourcesState);
  const persons = store.get(personsByViewState);

  const csvContent = exportScheduleToCSV(weeks, sources, persons);
  triggerCsvDownload(
    csvContent,
    `autofill_debug_${new Date().toISOString().slice(0, 10)}.csv`,
    'text/csv;charset=utf-8;'
  );
};

export const handleDownloadAnalysisCSV = () => {
  // 1. Alle benötigten Daten aus dem Store holen
  const persons = store.get(personsByViewState);
  const languageGroups = store.get(languageGroupsState);
  const sources = store.get(sourcesState);
  const schedules = store.get(schedulesState);
  const settings = store.get(settingsState);
  const history = store.get(assignmentsHistoryState);
  const isPublicTalkCoordinator = store.get(isPublicTalkCoordinatorState);
  const sourceLocale = store.get(JWLangLocaleState);

  // 2. Base-Metriken berechnen (da diese für die CSV benötigt werden)
  const assignmentsMetrics = getAssignmentsWithStats(
    persons,
    sources,
    schedules,
    settings,
    languageGroups,
    sourceLocale
  );

  // 3. Den eigentlichen Download triggern
  downloadAnalysisCSV(
    persons,
    languageGroups,
    sources,
    schedules,
    settings,
    history,
    assignmentsMetrics,
    isPublicTalkCoordinator
  );
};
