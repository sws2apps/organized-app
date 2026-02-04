// services/app/assignments_schedule_export.ts
import { AssignmentCode } from '@definition/assignment';
import { FieldServiceGroupType } from '@definition/field_service_groups';
import { PersonType } from '@definition/person';
import { AssignmentHistoryType, SchedWeekType } from '@definition/schedules';
import { SettingsType } from '@definition/settings';
import { SourceWeekType } from '@definition/sources';
import { ASSIGNMENT_DEFAULTS, ASSIGNMENT_PATH } from '@constants/index';
import { store } from '@states/index';
import { personsByViewState } from '@states/persons';
import { schedulesState } from '@states/schedules';
import {} from '@states/settings';
import { sourcesState } from '@states/sources';
import {
  AssignmentStatisticsComplete,
  getPersonsAssignmentMetrics,
} from './assignments_with_stats';
import { ApplyMinistryType } from '@definition/sources';
import { AssignmentCongregation } from '@definition/schedules';
import {
  MM_ASSIGNMENT_CODES,
  WM_ASSIGNMENT_CODES,
} from '@definition/assignment';

export function getPropertyByPath<T = unknown>(
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

const getSourceTitle = (key: string, source: SourceWeekType): string => {
  if (!source) return '';
  const mm = source.midweek_meeting;

  if (key.includes('TGWTalk')) return mm.tgw_talk.src['X'];
  if (key.includes('TGWGems')) return mm.tgw_gems.title['X'];
  if (key.includes('TGWBibleReading')) return mm.tgw_bible_reading.title['X'];

  if (key.includes('LCPart1')) return mm.lc_part1.title['X'];
  if (key.includes('LCPart2')) return mm.lc_part2.title['X'];
  if (key.includes('LCPart3')) return mm.lc_part3.title[0]?.value;
  if (key.includes('CBS'))
    return mm.lc_cbs.title[0]?.value || 'Versammlungsbibelstudium';

  const ayfMatch = key.match(/AYFPart(\d+)/);
  if (ayfMatch) {
    const idx = ayfMatch[1];
    const partKey = `ayf_part${idx}` as keyof typeof mm;
    const part = mm[partKey] as ApplyMinistryType;
    return part?.src['X'] || part?.title['X'] || '';
  }
  return '';
};

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
    'Name(s)',
  ];
  const rows: string[] = [headers.join(';')];

  const assignmentKeys = Object.keys(ASSIGNMENT_PATH).filter(
    (key) => !key.includes('_Assistant_')
  );

  weeksList.forEach((schedule) => {
    const source = sources.find((s) => s.weekOf === schedule.weekOf);

    assignmentKeys.forEach((key) => {
      const path = ASSIGNMENT_PATH[key as keyof typeof ASSIGNMENT_PATH];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rawData = getPropertyByPath<any>(schedule, path);

      if (!rawData) return;

      const assignmentData = (
        Array.isArray(rawData) ? rawData : [rawData]
      ) as AssignmentCongregation[];

      let code = 0;

      if (ASSIGNMENT_DEFAULTS[key]) {
        code = ASSIGNMENT_DEFAULTS[key].code;
      }

      if (key.includes('AYFPart') && source) {
        const match = key.match(/AYFPart(\d+)/);
        if (match) {
          const idx = match[1];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const part = (source.midweek_meeting as any)[`ayf_part${idx}`];

          if (part && part.type) {
            const typeVal = part.type['X'] || Object.values(part.type)[0];
            if (typeVal) code = Number(typeVal);
          }
        }
      }
      const sourceTitle = source ? getSourceTitle(key, source) : '';

      let classroom = '1';
      if (key.includes('_B') || path.includes('aux_class_1')) classroom = '2';
      if (path.includes('aux_class_2')) classroom = '3';

      const isStudentKey = key.includes('_Student_');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let assistantData: any[] = [];

      if (isStudentKey) {
        const assistantPath = path.replace('.student', '.assistant');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawAssistantData = getPropertyByPath<any>(
          schedule,
          assistantPath
        );
        if (rawAssistantData) {
          assistantData = Array.isArray(rawAssistantData)
            ? rawAssistantData
            : [rawAssistantData];
        }
      }

      assignmentData.forEach((entry: AssignmentCongregation) => {
        if (!entry.value) return;

        let nameString = getPersonName(entry.value, persons);

        if (isStudentKey) {
          const partnerEntry = assistantData.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (a: any) => a.type === entry.type
          );

          if (partnerEntry && partnerEntry.value) {
            const partnerName = getPersonName(partnerEntry.value, persons);
            nameString = `${nameString} / ${partnerName}`;
          }
        }

        const row = [
          entry.type,
          schedule.weekOf,
          code,
          key,
          `"${sourceTitle}"`,
          classroom,
          `"${nameString}"`,
        ];
        rows.push(row.join(';'));
      });
    });
  });

  return rows.join('\n');
};

export const downloadAnalysisCSV = (
  persons: PersonType[],
  languageGroups: FieldServiceGroupType[],
  sources: SourceWeekType[],
  schedules: SchedWeekType[],
  settings: SettingsType,
  history: AssignmentHistoryType[],
  assignmentsMetrics: AssignmentStatisticsComplete
) => {
  const csvContent = generateDeepAnalysisCSV(
    persons,
    history,
    languageGroups,
    sources,
    schedules,
    settings,
    assignmentsMetrics
  );

  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `analysis_export_${new Date().toISOString().slice(0, 10)}.csv`
  );
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const handleDownloadDebugCSV = () => {
  const weeks = store.get(schedulesState);
  const sources = store.get(sourcesState);
  const persons = store.get(personsByViewState);

  const csvContent = exportScheduleToCSV(weeks, sources, persons);

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `autofill_debug_${new Date().toISOString().slice(0, 10)}.csv`
  );
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// services/app/assignments_schedule_export.ts

// ... (deine bisherigen Imports)

// ... (getPersonName, getSourceTitle, exportScheduleToCSV bleiben unverändert) ...

export const generateDeepAnalysisCSV = (
  persons: PersonType[],
  history: AssignmentHistoryType[],
  languageGroups: FieldServiceGroupType[],
  sources: SourceWeekType[],
  schedules: SchedWeekType[],
  settings: SettingsType,
  assignmentsMetrics: AssignmentStatisticsComplete
): string => {
  const relevantViews = new Set<string>();
  relevantViews.add('main');

  if (settings.cong_settings.language_groups.enabled) {
    languageGroups.forEach((g) => {
      if (g.group_data._deleted) return;

      const hasMeetings =
        g.group_data.midweek_meeting || g.group_data.weekend_meeting;

      if (hasMeetings) {
        relevantViews.add(g.group_id);
      }
    });
  }

  // --- NEU: Personen-Metriken berechnen (Weighting Factor & Scores) ---
  // Wir nutzen die 'assignmentsMetrics', die exakt aus dem Autofill kommen.
  const personsMetrics = getPersonsAssignmentMetrics(
    persons,
    assignmentsMetrics
  );
  // --------------------------------------------------------------------

  let totalWeeks = 1;
  if (history.length > 0) {
    const dates = history.map((h) => new Date(h.weekOf).getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    totalWeeks = Math.max(
      1,
      Math.round((maxDate - minDate) / (1000 * 60 * 60 * 24 * 7)) + 1
    );
  }

  const allCodes = getAllAssignmentCodes();

  const rows: string[] = [];
  // --- HEADER ANGEPASST ---
  rows.push(
    'Dataview;Name;Weighting Factor;Total Score;Task;Code;Global Avg/Week;Target Avg/Week (Global/Eligible);Actual Avg/Week;Min Interval;Max Interval;Eligible Count;DEBUG_INFO'
  );

  // --- ENTFERNT: Die Neuberechnung von 'globalCodeFreq' ---
  // Wir nutzen stattdessen direkt das übergebene 'assignmentsMetrics'

  relevantViews.forEach((viewKey) => {
    persons.forEach((person) => {
      const name = `${person.person_data.person_lastname.value}, ${person.person_data.person_firstname.value}`;

      // --- NEU: Metriken für diese Person holen ---
      const pMetrics = personsMetrics.get(person.person_uid);
      const weightingFactor = pMetrics?.weightingFactor?.toFixed(2) ?? '1.00';
      const totalScore = pMetrics?.total_globalScore?.toFixed(4) ?? '0.0000';
      // -------------------------------------------

      const personHistoryItems = history.filter((h) => {
        if (h.assignment.person !== person.person_uid) return false;
        const entryView = h.assignment.dataView || 'main';
        return entryView === viewKey;
      });

      let MMsumTheoretical = 0;
      let MMsumActual = 0;
      let MMsumGlobal = 0;
      let WMsumTheoretical = 0;
      let WMsumActual = 0;
      let WMsumGlobal = 0;
      const allDatesOfPerson: string[] = [];

      allCodes.forEach((code) => {
        if (!isPersonEligible(person, code, viewKey)) return;

        const codeName = AssignmentCode[code];

        // A) Global Average (JETZT KONSISTENT aus assignmentsMetrics)
        const metrics = assignmentsMetrics.get(viewKey)?.get(code);
        const globalAvg = metrics?.frequency || 0;
        const numEligible = metrics?.eligibleUIDS.size || 0;

        // C) Target Average
        const theoreticalAvg = numEligible > 0 ? globalAvg / numEligible : 0;

        // D) Actual Average
        const personEntries = personHistoryItems.filter(
          (h) => Number(h.assignment.code) === Number(code)
        );

        const actualCount = personEntries.length;
        const safeTotalWeeks = totalWeeks < 1 ? 1 : totalWeeks;
        const actualAvg = actualCount / safeTotalWeeks;

        // E) Distances
        const dates = personEntries.map((e) => e.weekOf);
        const { min, max } = calculateIntervalMetrics(dates);
        const minStr = min === Infinity ? '-' : min.toString();
        const maxStr = max === -Infinity ? '-' : max.toString();

        MMsumGlobal += MM_ASSIGNMENT_CODES.includes(code) ? globalAvg : 0;
        MMsumTheoretical += MM_ASSIGNMENT_CODES.includes(code)
          ? theoreticalAvg
          : 0;
        MMsumActual += MM_ASSIGNMENT_CODES.includes(code) ? actualAvg : 0;

        WMsumGlobal += WM_ASSIGNMENT_CODES.includes(code) ? globalAvg : 0;
        WMsumTheoretical += WM_ASSIGNMENT_CODES.includes(code)
          ? theoreticalAvg
          : 0;
        WMsumActual += WM_ASSIGNMENT_CODES.includes(code) ? actualAvg : 0;

        allDatesOfPerson.push(...dates);

        const debugHistoryCount = personHistoryItems.length;
        const rawStringMatchCount = personHistoryItems.filter(
          (h) => String(h.assignment.code) === String(code)
        ).length;

        rows.push(
          `${viewKey};` +
            `${name};` +
            `${weightingFactor};` + // NEU
            `${totalScore};` + // NEU
            `${codeName};` +
            `${code};` +
            `${globalAvg.toFixed(4).replace('.', ',')};` +
            `${theoreticalAvg.toFixed(4).replace('.', ',')};` +
            `${actualAvg.toFixed(4).replace('.', ',')};` +
            `${minStr};${maxStr};` +
            `${numEligible};` +
            `DebugCount:${actualCount}|RawMatch:${rawStringMatchCount}|TotalHistory:${debugHistoryCount}|SafeWeeks:${safeTotalWeeks}`
        );
      });

      // TOTAL row for person
      const { min: gMin, max: gMax } =
        calculateIntervalMetrics(allDatesOfPerson);
      const gMinStr = gMin === Infinity ? '-' : gMin.toString();
      const gMaxStr = gMax === -Infinity ? '-' : gMax.toString();

      rows.push(
        `${viewKey};` +
          `${name};${weightingFactor};${totalScore};MM_Total;` +
          `999;` +
          `${MMsumGlobal.toFixed(4).replace('.', ',')};` +
          `${MMsumTheoretical.toFixed(4).replace('.', ',')};` +
          `${MMsumActual.toFixed(4).replace('.', ',')};` +
          `${gMinStr};${gMaxStr};` +
          `-;` + // <--- HIER: Platzhalter für Eligible Count
          `Debug`
      );

      rows.push(
        `${viewKey};` +
          `${name};${weightingFactor};${totalScore};WM_Total;` +
          `999;` +
          `${WMsumGlobal.toFixed(4).replace('.', ',')};` +
          `${WMsumTheoretical.toFixed(4).replace('.', ',')};` +
          `${WMsumActual.toFixed(4).replace('.', ',')};` +
          `${gMinStr};${gMaxStr};` +
          `-;` + // <--- HIER: Platzhalter für Eligible Count
          `Debug` // (kein Text nötig, da letzte Spalte, aber sauberer Abschluss)
      );
    });
  });

  return rows.join('\n');
};

// Helper function: Calculates Min/Max distances in weeks from a list of date strings
const calculateIntervalMetrics = (dateStrings: string[]) => {
  if (dateStrings.length < 2) {
    return { min: Infinity, max: -Infinity };
  }

  // 1. Sort
  const timestamps = dateStrings
    .map((d) => new Date(d).getTime())
    .sort((a, b) => a - b);

  let minDiff = Infinity;
  let maxDiff = -Infinity;

  // 2. Measure distances
  for (let i = 1; i < timestamps.length; i++) {
    const diffMs = timestamps[i] - timestamps[i - 1];
    const diffWeeks = Math.round(diffMs / (1000 * 60 * 60 * 24 * 7));

    if (diffWeeks < minDiff) minDiff = diffWeeks;
    if (diffWeeks > maxDiff) maxDiff = diffWeeks;
  }

  return { min: minDiff, max: maxDiff };
};
// 1. Get all numeric codes from Enum
const getAllAssignmentCodes = (): number[] => {
  return Object.values(AssignmentCode).filter(
    (v) => typeof v === 'number'
  ) as number[];
};

const isPersonEligible = (
  person: PersonType,
  code: number,
  dataView: string
): boolean => {
  return (
    person.person_data.assignments
      .find((e) => e.type === dataView)
      ?.values.includes(code) ?? false
  );
};
