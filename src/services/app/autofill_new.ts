import { ASSIGNMENT_PATH, STUDENT_ASSIGNMENT } from '@constants/index';
import { ASSIGNMENT_DEFAULTS } from '@constants/index';
import { AssignmentCode, MM_ASSIGNMENT_CODES } from '@definition/assignment';
import { SchedWeekType } from '@definition/schedules';
import { SourceWeekType, ApplyMinistryType } from '@definition/sources';
import {
  schedulesAutofillSaveAssignment,
  schedulesBuildHistoryList,
} from './schedules';
import { AssignmentFieldType } from '@definition/assignment';
import { AssignmentHistoryType } from '@definition/schedules';
import { PersonType } from '@definition/person';
import { calculateOpportunityScore } from './assignments_with_stats';
import {
  getCorrespondingStudentOrAssistant,
  sortCandidatesMultiLevel,
} from './assignment_selection';
import { getEligiblePersonsPerDataViewAndCode } from './assignments_with_stats';
import { store } from '@states/index';
import { getAssignmentsWithStats } from './assignments_with_stats';
import { sourcesState } from '@states/sources';
import { personsByViewState } from '@states/persons';
import {
  assignmentsHistoryState,
  isPublicTalkCoordinatorState,
} from '@states/schedules';
import { settingsState, userDataViewState } from '@states/settings';
import { dbSchedBulkUpdate } from '@services/dexie/schedules';
import { exportScheduleToCSV } from './assignments_schedule_export';
import { schedulesState } from '@states/schedules';
import { SettingsType } from '@definition/settings';
import { Week } from '@definition/week_type';
import { hasAssignmentConflict } from './assignment_selection';
import {
  sourcesCheckAYFExplainBeliefsAssignment,
  sourcesCheckLCAssignments,
  sourcesCheckLCElderAssignment,
} from './sources';
import { JWLangState, JWLangLocaleState } from '@states/settings';
import { personIsElder } from './persons';
import { midweekMeetingClassCountState } from '@states/settings';
import { buildEligibilityCountMap } from './assignments_with_stats';
import { isValidAssistantForStudent } from './assignment_selection';
import { MeetingType } from '@definition/app';

// SAUBER: Kein 'any' mehr notwendig!
export type AssignmentTask = {
  schedule: SchedWeekType;
  targetDate: string;
  path: string;
  assignmentKey: string;
  code: AssignmentCode;
  elderOnly: boolean;
  sortIndex: number;
  dataView: string;
};

export const getWeekType = (
  schedule: SchedWeekType,
  dataView: string
): number => {
  return (
    schedule.midweek_meeting.week_type.find(
      (record) => record.type === dataView
    )?.value ?? Week.NORMAL
  );
};

// Einfache addDays Funktion
const addDaysHelper = (dateStr: string, days: number): Date => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date;
};

export const getActualMeetingDate = (
  weekOf: string,
  schedule: SchedWeekType,
  settings: SettingsType,
  dataView: string,
  meeting_type: MeetingType
): string => {
  const meetingDay =
    meeting_type === 'midweek'
      ? settings.cong_settings.midweek_meeting.find(
          (record) => record.type === dataView
        )?.weekday.value
      : settings.cong_settings.weekend_meeting.find(
          (record) => record.type === dataView
        )?.weekday.value;

  const dateObj = addDaysHelper(weekOf, meetingDay);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  return `${year}/${month}/${day}`;
};

export const isPersonAway = (
  person: PersonType,
  targetDate: string
): boolean => {
  const timeAways = person.person_data.timeAway;
  if (!timeAways || timeAways.length === 0) return false;

  return timeAways.some((record) => {
    if (record._deleted) return false;
    if (!record.start_date) return false;

    const startDateStr = new Date(record.start_date)
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '/');

    const endDateStr = record.end_date
      ? new Date(record.end_date).toISOString().slice(0, 10).replace(/-/g, '/')
      : startDateStr;

    return targetDate >= startDateStr && targetDate <= endDateStr;
  });
};

const assignPersonToTask = (
  task: AssignmentTask,
  dataView: string,
  history: AssignmentHistoryType[],
  candidates: PersonType[],
  freqMap: Map<number, number>,
  eligibilityCountMap: Map<number, number>
) => {
  const selectedPerson = findBestPersonForTask(
    task,
    candidates,
    history,
    freqMap,
    eligibilityCountMap
  );

  if (!selectedPerson) {
    // Optional: Warnung reduzieren, um Konsole sauber zu halten
    // console.warn(`No available person found for ${task.assignmentKey}`);
    return;
  }

  schedulesAutofillSaveAssignment({
    schedule: task.schedule,
    assignment: task.assignmentKey as AssignmentFieldType,
    value: selectedPerson,
    history: history,
    dataView: dataView,
  });
};

const getAyfCodeFromSource = (
  key: string,
  source: SourceWeekType
): AssignmentCode | null => {
  const partMatch = key.match(/AYFPart(\d+)/);
  if (!partMatch) return null;
  const partIndex = partMatch[1];

  // Safe Access mit 'as any' oder Key Check
  const ayfKey = `ayf_part${partIndex}` as keyof typeof source.midweek_meeting;
  const ayfData = source.midweek_meeting[ayfKey] as ApplyMinistryType;

  if (!ayfData || !ayfData.type) return null;

  // Sicherstellen, dass values existiert
  const availableCodes = Object.values(ayfData.type);
  return availableCodes.length > 0 ? availableCodes[0] : null;
};

// services/app/assignments_with_stats.ts

export const getPersonOpportunityScores = (
  persons: PersonType[],
  freqMap: Map<number, number>,
  eligibilityCountMap: Map<number, number>,
  dataView: string
): Record<string, number> => {
  const scoreDict: Record<string, number> = {};

  persons.forEach((person) => {
    const firstName = person.person_data.person_firstname.value;
    const lastName = person.person_data.person_lastname.value;
    const fullName = `${firstName} ${lastName}`;

    // Score berechnen
    const { mm_globalScore } = calculateOpportunityScore(
      person,
      freqMap,
      eligibilityCountMap,
      dataView
    );

    // Wir speichern für die Übersicht den globalen Wert
    scoreDict[fullName] = Number(mm_globalScore.toFixed(4));
  });

  return scoreDict;
};

/**
 * HELPER: Gibt die Scores sortiert in der Konsole aus (für Debugging)
 */
export const debugLogOpportunityScores = (
  persons: PersonType[],
  freqMap: Map<number, number>,
  eligibilityCountMap: Map<number, number>,
  dataView: string
) => {
  const dict = getPersonOpportunityScores(
    persons,
    freqMap,
    eligibilityCountMap,
    dataView
  );

  // Umwandeln in Array zum Sortieren
  const sortedEntries = Object.entries(dict).sort(([, scoreA], [, scoreB]) => {
    return scoreA - scoreB; // Aufsteigend sortieren (Niedrigster Score zuerst)
  });

  console.log(
    '--- OPPORTUNITY SCORES (Je niedriger, desto "spezialisierter") ---'
  );
  console.table(
    sortedEntries.reduce(
      (acc, [name, score]) => {
        acc[name] = { score };
        return acc;
      },
      {} as Record<string, { score: number }>
    )
  );
};

/**
 * HAUPTFUNKTION
 */
//MARK: HAUPTFUNKTION
export const handleDynamicAssignmentAutofill = (
  weeksList: SchedWeekType[],
  meeting_type?: MeetingType
) => {
  // Daten aus dem Store holen
  const sources = store.get(sourcesState);
  const fullHistory = store.get(assignmentsHistoryState);
  const dataView = store.get(userDataViewState);
  //const persons = store.get(personsState);
  const persons = store.get(personsByViewState);
  const settings = store.get(settingsState);
  const lang = store.get(JWLangState);
  const sourceLocale = store.get(JWLangLocaleState);
  const linkedAssignments: Record<string, Record<string, string>> = {};
  const fixedAssignments: Record<string, Record<string, string>> = {};
  const classCount = store.get(midweekMeetingClassCountState);
  const isPublicTalkCoordinator = store.get(isPublicTalkCoordinatorState);

  console.log('zzz settings:', settings);

  //only assignment keys relevant for the meeting type & deleting _B keys if class count is 1
  const assignmentKeys = Object.keys(ASSIGNMENT_PATH).filter(
    (key) =>
      (!meeting_type ||
        (meeting_type === 'midweek'
          ? key.startsWith('MM_')
          : key.startsWith('WM_'))) &&
      (!key.endsWith('_B') || classCount === 2)
  );

  console.log('MM-Codes', MM_ASSIGNMENT_CODES);

  const assignmentsToIgnoreInCO_Visit = new Set([
    'MM_LCCBSConductor',
    'MM_LCCBSReader',
    'WM_WTStudy_Reader',
    'WM_Speaker_Part2',
    ...assignmentKeys.filter((key) => key.endsWith('_B')),
  ]);

  // MARK: CLEAN HISTORY
  // 1. CLEANING: Wir identifizieren die Wochen, die wir neu planen und entfernen sie aus der Historie, damit sie "leer" sind für die Neuplanung
  const planningWeeks = new Set(weeksList.map((week) => week.weekOf));
  const cleanHistory = fullHistory.filter((entry) => {
    if (!planningWeeks.has(entry.weekOf)) {
      return true;
    }
    // B)  Einträge aus anderem Dataview Behalten! (Damit wir Konflikte mit anderen Gruppen erkennen)
    const entryDataView = entry.assignment.dataView || 'main';
    if (entryDataView !== dataView) {
      return true;
    }
    // C) Der Eintrag liegt in der Planungswoche UND gehört zur aktuellen Ansicht.
    // -> Wegwerfen (False), da wir diese Aufgaben jetzt neu verteilen wollen.
    return false;
  });

  // MARK: CHECKING SETTINGS
  // 1. Dictionary vorbereiten
  const ignoredKeysByDataView: Record<string, string[]> = {};
  // ---------------------------------------------------------
  // A. Midweek Meeting (Leben- und Dienstzusammenkunft)
  // ---------------------------------------------------------
  if (settings.cong_settings.midweek_meeting) {
    settings.cong_settings.midweek_meeting.forEach((meeting) => {
      const viewKey = meeting.type; // DataView Key
      const keysToIgnore: string[] = [];
      const linkedAssignmentsForView: Record<string, string> = {};
      const fixedAssignmentsForView: Record<string, string> = {};

      if (meeting.aux_class_counselor_default.person.value) {
        fixedAssignmentsForView['MM_AuxiliaryCounselor'] =
          meeting.aux_class_counselor_default.person.value;
        fixedAssignments[viewKey] = fixedAssignmentsForView;
      }

      // Opening Prayer
      if (meeting.opening_prayer_linked_assignment.value !== '') {
        keysToIgnore.push('MM_OpeningPrayer');
        linkedAssignmentsForView['MM_OpeningPrayer'] =
          meeting.opening_prayer_linked_assignment.value;
      }

      // Closing Prayer
      if (meeting.closing_prayer_linked_assignment.value !== '') {
        keysToIgnore.push('MM_ClosingPrayer');
        linkedAssignmentsForView['MM_ClosingPrayer'] =
          meeting.closing_prayer_linked_assignment.value;
      }

      if (keysToIgnore.length > 0) {
        ignoredKeysByDataView[viewKey] = keysToIgnore;
        linkedAssignments[viewKey] = linkedAssignmentsForView;
      }
    });
  }

  // ---------------------------------------------------------
  // B. Weekend Meeting (Zusammenkunft am Wochenende)
  // ---------------------------------------------------------
  if (settings.cong_settings.weekend_meeting) {
    settings.cong_settings.weekend_meeting.forEach((meeting) => {
      const viewKey = meeting.type;
      const keysToIgnore: string[] = [];
      const fixedAssignmentsForView = fixedAssignments[viewKey] || {};
      const linkedAssignmentsForView = linkedAssignments[viewKey] || {};

      keysToIgnore.push('WM_SubstituteSpeaker'); // for now always ignore substitute speaker
      keysToIgnore.push('WM_Speaker_Outgoing'); // for now always ignore outgoing speaker

      if (meeting.w_study_conductor_default.value) {
        fixedAssignmentsForView['WM_WTStudy_Conductor'] =
          meeting.w_study_conductor_default.value;
        fixedAssignments[viewKey] = fixedAssignmentsForView;
      }

      if (meeting.opening_prayer_auto_assigned.value) {
        keysToIgnore.push('WM_OpeningPrayer');
        linkedAssignmentsForView['WM_OpeningPrayer'] = 'WM_Chairman';
      }

      if (!isPublicTalkCoordinator) {
        keysToIgnore.push('WM_Speaker_Part1');
        keysToIgnore.push('WM_Speaker_Part2');
      }

      if (keysToIgnore.length > 0) {
        ignoredKeysByDataView[viewKey] = keysToIgnore;
        linkedAssignments[viewKey] = linkedAssignmentsForView;
      }
    });
  }
  //MARK: STATISTICS
  // ---------------------------------------------------------
  // C. Aufruf der Statistik-Funktion
  // ---------------------------------------------------------

  console.log('kurz vor stats');
  const freqMap = getAssignmentsWithStats(sources, settings, dataView);
  const eligibilityCountMap = buildEligibilityCountMap(persons, dataView);
  const eligibilityMap =
    getEligiblePersonsPerDataViewAndCode(persons)[dataView];

  // Sammel-Array für alle Tasks dieser Woche
  const tasks: AssignmentTask[] = [];
  //MARK: TASK BUILDING & ASSIGNMENT
  weeksList.forEach((schedule) => {
    // 1. Datum & Source Check
    const actualDateMidweek = getActualMeetingDate(
      schedule.weekOf,
      schedule,
      settings,
      dataView,
      'midweek'
    );
    const actualDateWeekend = getActualMeetingDate(
      schedule.weekOf,
      schedule,
      settings,
      dataView,
      'weekend'
    );
    //Source enthält die konkreten Aufgabennamen und Details in der jeweiligen Sprache
    const source = sources.find((s) => s.weekOf === schedule.weekOf);
    if (!source) return;

    //Ermittlung der Art der Woche (CO-Besuch etc.) für den Hauptsaal
    const COWeek = getWeekType(schedule, 'main') === Week.CO_VISIT;
    if (COWeek && dataView !== 'main') return;

    assignmentKeys.forEach((key) => {
      // Ziel: 1) filtern der elevanten keys 2) ermitteln des zugehörigen codes
      if (COWeek && assignmentsToIgnoreInCO_Visit.has(key)) return;

      let code: AssignmentCode | undefined;
      let elderOnly = false;

      // A Midweekmeeting treatment
      // Fall 1: Assistenten-Aufgaben
      if (key.includes('_Assistant_')) {
        // 1. Part Index aus dem Key extrahieren (AYFPart1, AYFPart2...)
        const partMatch = key.match(/AYFPart(\d+)/);
        if (!partMatch) return; // Sollte nicht passieren
        const partIndex = partMatch[1];

        // 2. Daten aus der Source holen
        // Wir brauchen den Typ und den Quelltext (für den Talk-Check)
        const ayfSourceData = source.midweek_meeting[`ayf_part${partIndex}`];

        if (!ayfSourceData) return;

        const sourceType = ayfSourceData.type[lang];
        const sourceSrc = ayfSourceData.src[lang];

        // 3. Prüfen: Ist es ein Vortrag?
        // Bei "Glaubensansichten erklären" kann es ein Vortrag oder eine Diskussion sein.
        // Die Funktion gibt true zurück, wenn es ein Vortrag ist.
        const isTalk =
          sourceType === AssignmentCode.MM_ExplainingBeliefs
            ? sourcesCheckAYFExplainBeliefsAssignment(sourceSrc, sourceLocale)
            : false; // Andere Typen sind per Definition keine "ExplainingBeliefs"-Talks (aber MM_Talk ist natürlich einer)
        const isValidAssistantPart =
          STUDENT_ASSIGNMENT.includes(sourceType) && !isTalk;

        // Wenn die Aufgabe keinen Assistenten braucht (z.B. reiner Vortrag), brechen wir ab.
        if (!isValidAssistantPart) return;
        // Wenn wir hier sind, ist es eine gültige Assistenten-Aufgabe.
        code = AssignmentCode.MM_AssistantOnly;
        elderOnly = false;
      }

      // ... Fall 2: Schüleraufgaben ...
      // Fall 2: Schüleraufgaben (AYF Parts - Redner/Student); hier muss zusätzlich die Source ausgewertet werden
      else if (key.includes('AYFPart')) {
        const dynamicCode = getAyfCodeFromSource(key, source);
        if (dynamicCode) {
          code = dynamicCode;
          elderOnly = false;
        }
      }

      // Fall 3: Statische Defaults (z.B. Chairman, Prayer, BibleReading); hier ist direkt klar welcher Code zugehörig ist
      else if (ASSIGNMENT_DEFAULTS[key]) {
        code = ASSIGNMENT_DEFAULTS[key].code;
        elderOnly = !!ASSIGNMENT_DEFAULTS[key].elderOnly;
      }

      if (!code) return;
      //ABSCHNITT CODE ERMITTELN ENDE

      // B) LEBEN ALS CHRIST (LC Parts)
      if (code === AssignmentCode.MM_LCPart) {
        let title = '';
        let desc = '';

        if (key === 'MM_LCPart3') {
          title =
            source.midweek_meeting.lc_part3?.title?.find(
              (m) => m.type === dataView
            )?.value || '';
          desc =
            source.midweek_meeting.lc_part3?.desc?.find(
              (m) => m.type === dataView
            )?.value || '';
        } else {
          const part = source.midweek_meeting;
          title =
            (key === 'MM_LCPart1'
              ? part.lc_part1?.title?.default?.[lang]
              : part.lc_part2?.title?.default?.[lang]) || '';
          desc =
            (key === 'MM_LCPart1'
              ? part.lc_part1?.desc?.default?.[lang]
              : part.lc_part2?.desc?.default?.[lang]) || '';
        }

        // Falls die Source unvollständig ist und wir keinen Titel haben -> Skip
        if (!title) return;
        // CHECK: Video / Keine Zuweisung?
        const noAssign = sourcesCheckLCAssignments(title, sourceLocale);
        if (noAssign) return;

        // CHECK: Nur Älteste?
        if (sourcesCheckLCElderAssignment(title, desc, sourceLocale)) {
          elderOnly = true;
        }
      }

      const actualDate = key.startsWith('MM_')
        ? actualDateMidweek
        : actualDateWeekend;

      // Die Sortierung muss überarbeitet und vereinfacht werden
      const sortIndex = eligibilityCountMap.get(code!) ?? 99999;

      tasks.push({
        schedule: schedule,
        targetDate: actualDate,
        path: ASSIGNMENT_PATH[key as keyof typeof ASSIGNMENT_PATH],
        assignmentKey: key,
        code,
        elderOnly,
        sortIndex,
        dataView,
      });
    });
  });

  // MARK: TASK SORTING
  tasks.sort((a, b) => {
    // 1. Definition: Ist Aufgabe A oder B fest zugewiesen?
    const isFixedA = !!fixedAssignments[a.dataView]?.[a.assignmentKey];
    const isFixedB = !!fixedAssignments[b.dataView]?.[b.assignmentKey];

    // REGEL A: Fixierte Aufgaben kommen IMMER als erstes (damit die Person blockiert ist)
    if (isFixedA && !isFixedB) return -1; // A nach vorne
    if (!isFixedA && isFixedB) return 1; // B nach vorne

    // ---------------------------------------------------------
    // Ab hier sind entweder BEIDE fixiert oder KEINER von beiden.
    // Wir kümmern uns jetzt um die "Abhängigen" (die warten müssen).
    // ---------------------------------------------------------

    // 2. Definition: Ist Aufgabe A oder B abhängig (Assistent oder Verknüpft)?
    const isAssistantA = a.code === AssignmentCode.MM_AssistantOnly;
    const isAssistantB = b.code === AssignmentCode.MM_AssistantOnly;

    // HIER DIE ÄNDERUNG: Part 2 ist auch dependent!
    const isPart2A = a.assignmentKey === 'WM_Speaker_Part2';
    const isPart2B = b.assignmentKey === 'WM_Speaker_Part2';

    const isLinkedA = !!linkedAssignments[a.dataView]?.[a.assignmentKey];
    const isLinkedB = !!linkedAssignments[b.dataView]?.[b.assignmentKey];

    const isDependentA = isAssistantA || isLinkedA || isPart2A;
    const isDependentB = isAssistantB || isLinkedB || isPart2B;

    // REGEL B: Abhängige Aufgaben kommen nach hinten (nach den Standard-Aufgaben)
    // Damit der "Meister" (Standard) schon in der History steht, wenn der "Sklave" (Dependent) kommt.
    if (isDependentA && !isDependentB) return 1; // A nach hinten
    if (!isDependentA && isDependentB) return -1; // B nach hinten

    // ---------------------------------------------------------
    // REGEL C: Standard-Sortierung nach Knappheit (SortIndex)
    // ---------------------------------------------------------
    return a.sortIndex - b.sortIndex;
  });
  for (const task of tasks) {
    // 1. Standard-Liste holen
    let allowedUIDs = eligibilityMap[task.code];

    // --- SPEZIALFALL: WM_Speaker_Part1 ---
    // Hier erlauben wir 'WM_Speaker' UND 'WM_SpeakerSymposium'
    if (task.assignmentKey === 'WM_Speaker_Part1') {
      // Liste A: Normale Redner (Code 120)
      const standardSpeakers =
        eligibilityMap[AssignmentCode.WM_Speaker] || new Set();

      // Liste B: Symposiumsredner (Code ??? - vermutlich 121 oder ähnlich, bitte checken!)
      // Tippe "AssignmentCode." und schau, wie der Enum für Symposium heißt
      const symposiumSpeakers =
        eligibilityMap[AssignmentCode.WM_SpeakerSymposium] || new Set();

      // BEIDE Listen kombinieren (Merge)
      allowedUIDs = new Set([...standardSpeakers, ...symposiumSpeakers]);
    }
    // -------------------------------------

    // 1. Vorbereitung: Falls es ein Assistent ist, suchen wir VORHER den Schüler
    //let studentPerson: PersonType | undefined = undefined;

    const studentPersonUID = getCorrespondingStudentOrAssistant(
      task.assignmentKey,
      task.schedule.weekOf,
      cleanHistory,
      task.dataView
    );
    const studentPerson = persons.find(
      (p) => p.person_uid === studentPersonUID
    );

    // 2. Linked Assignment Check (Vorsitz -> Gebet)
    let forcedPerson: PersonType | undefined = undefined;

    const linkedKey = linkedAssignments[task.dataView]?.[task.assignmentKey];
    if (linkedKey) {
      // --- HIER IST DIE VEREINFACHUNG ---
      // Statt im Schedule-Objekt zu wühlen, schauen wir einfach in die History,
      // die wir im vorherigen Schleifendurchlauf (beim Vorsitzenden) gerade aktualisiert haben.

      const linkedEntry = cleanHistory.find(
        (entry) =>
          entry.weekOf === task.schedule.weekOf &&
          entry.assignment.key === linkedKey &&
          entry.assignment.dataView === task.dataView
      );

      if (linkedEntry) {
        forcedPerson = persons.find(
          (p) => p.person_uid === linkedEntry.assignment.person
        );
      }
    }

    const fixedPersonId = fixedAssignments[task.dataView]?.[task.assignmentKey];
    if (fixedPersonId) {
      forcedPerson = persons.find((p) => p.person_uid === fixedPersonId);
    }

    // 2. Einmaliges, sauberes Filtern (const ist jetzt erlaubt!)
    const candidates = persons.filter((p) => {
      // A) FORCED CHECK
      if (forcedPerson) {
        return p.person_uid === forcedPerson.person_uid;
      }
      // A) Basis-Checks
      if (!allowedUIDs || !allowedUIDs.has(p.person_uid)) return false;
      if (task.elderOnly && !personIsElder(p)) return false;

      // B) Assistenten-Check (nur wenn wir einen Schüler gefunden haben)
      if (studentPerson) {
        // Passt dieser Kandidat zum Schüler?
        if (!isValidAssistantForStudent(studentPerson, p)) return false;
      }

      if (task.code === AssignmentCode.MM_AssistantOnly) {
        const studentUid = getCorrespondingStudentOrAssistant(
          task.assignmentKey,
          task.schedule.weekOf,
          cleanHistory,
          task.dataView
        );
        if (studentUid && p.person_uid === studentUid) {
          return false; // Assistent cannot be the same person as the student
        }
      }

      return true;
    });

    // --- B) WEEKEND MEETING TREATMENT (KORRIGIERT) ---
    if (task.assignmentKey === 'WM_Speaker_Part2') {
      //FIX IS NEEDED HERE
      console.log('Fix is needed');
      /* 
        // 1. Prüfen ob Talk Type "localSpeaker" ist
        const publicTalkType = schedule.weekend_meeting.public_talk_type.find(
          (record) => record.type === dataView
        )?.value;

        // Wenn es kein lokaler Redner ist (z.B. Gastredner), überspringen wir Part 2 Autofill
        if (publicTalkType !== 'localSpeaker') continue; // continue statt return!

        // 2. Speaker 1 finden (WICHTIG: In cleanHistory suchen, nicht im Schedule!)
        // Da Part 1 durch die Sortierung VORHER dran war, steht er jetzt in cleanHistory.
        const speaker1Entry = cleanHistory.find(
          (entry) =>
            entry.weekOf === task.schedule.weekOf &&
            entry.assignment.key === 'WM_Speaker_Part1' && // Suche Part 1
            entry.assignment.dataView === dataView
        );

        if (!speaker1Entry) {
          // Wenn Part 1 noch nicht zugewiesen ist, können wir Part 2 nicht prüfen -> Abbruch für diesen Task
          continue;
        }

        const speaker1UID = speaker1Entry.assignment.person;

        // 3. Prüfen: Ist Speaker 1 ein Symposium-Redner?
        const speaker1IsSymposium = persons
          .find((person) => person.person_uid === speaker1UID)
          ?.person_data.assignments.find((entry) => entry.type === dataView)
          ?.values.includes(AssignmentCode.WM_SpeakerSymposium);

        // Wenn Speaker 1 KEIN Symposium hat, darf Speaker 2 nicht gefüllt werden (es gibt nur 1 Vortrag)
        if (!speaker1IsSymposium) continue; */
    }
    // --- ENDE WEEKEND TREATMENT ---

    assignPersonToTask(
      task,
      dataView,
      cleanHistory,
      candidates,
      freqMap,
      eligibilityCountMap
    );
  }

  handleDownloadDebugCSV();

  downloadAnalysisCSV(persons, cleanHistory);
};

export const downloadAnalysisCSV = (
  persons: PersonType[],
  history: AssignmentHistoryType[]
) => {
  // 1. CSV-String generieren (mit deiner Analyse-Logik)
  const csvContent = generateDeepAnalysisCSV(persons, history);

  // 2. Blob erstellen
  // '\uFEFF' ist der "Byte Order Mark" (BOM), damit Excel Umlaute korrekt anzeigt.
  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);

  // 3. Download im Browser erzwingen
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

export const findBestPersonForTask = (
  task: AssignmentTask,
  candidates: PersonType[],
  history: AssignmentHistoryType[],
  freqMap: Map<number, number>,
  eligibilityCountMap: Map<number, number>
): PersonType | undefined => {
  if (candidates.length === 0) return undefined;

  const sortedCandidates = sortCandidatesMultiLevel(
    candidates,
    task,
    history,
    freqMap,
    eligibilityCountMap
  );

  for (const candidate of sortedCandidates) {
    if (isPersonAway(candidate, task.targetDate)) continue;
    if (
      hasAssignmentConflict(
        candidate,
        task.schedule.weekOf,
        task.code,
        history,
        task.dataView
      )
    )
      continue;

    return candidate;
  }
  return undefined;
};

// ... Rest der Datei (handleAutofillMidweekNew, etc.) wie gehabt

export const handleAutofillMidweekNew = async (weeksList: SchedWeekType[]) => {
  // 3. START: Wir übergeben die BEREINIGTE History
  handleDynamicAssignmentAutofill(weeksList, 'midweek');

  // save shallow copy to indexeddb
  await dbSchedBulkUpdate(weeksList);

  // update assignments history global state
  // Am Ende bauen wir die Historie komplett neu aus den Schedules auf,
  // damit alles wieder synchron ist.
  const newFullHistory = schedulesBuildHistoryList();
  store.set(assignmentsHistoryState, newFullHistory);
};

export const handleDownloadDebugCSV = () => {
  // Daten laden
  const weeks = store.get(schedulesState);
  const sources = store.get(sourcesState);
  const persons = store.get(personsByViewState);

  // CSV String generieren
  const csvContent = exportScheduleToCSV(weeks, sources, persons);

  // Blob erstellen
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  // Download Link simulieren
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

// Hilfsfunktion: Berechnet Min/Max Abstände in Wochen aus einer Liste von Datums-Strings
const calculateIntervalMetrics = (dateStrings: string[]) => {
  if (dateStrings.length < 2) {
    return { min: 0, max: 0 };
  }

  // 1. Sortieren
  const timestamps = dateStrings
    .map((d) => new Date(d).getTime())
    .sort((a, b) => a - b);

  let minDiff = Infinity;
  let maxDiff = -Infinity;

  // 2. Abstände messen
  for (let i = 1; i < timestamps.length; i++) {
    const diffMs = timestamps[i] - timestamps[i - 1];
    const diffWeeks = Math.round(diffMs / (1000 * 60 * 60 * 24 * 7));

    if (diffWeeks < minDiff) minDiff = diffWeeks;
    if (diffWeeks > maxDiff) maxDiff = diffWeeks;
  }

  return { min: minDiff, max: maxDiff };
};

// 1. Alle numerischen Codes aus dem Enum holen
const getAllAssignmentCodes = (): number[] => {
  return Object.values(AssignmentCode).filter(
    (v) => typeof v === 'number'
  ) as number[];
};

const isPersonEligible = (person: PersonType, code: number): boolean => {
  return person.person_data.assignments
    .find((e) => e.type === 'main')
    ?.values.includes(code);
};
export const generateDeepAnalysisCSV = (
  persons: PersonType[],
  history: AssignmentHistoryType[]
): string => {
  // 1. Gesamtzeitraum ermitteln
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

  // 2. Alle relevanten Codes holen
  const allCodes = getAllAssignmentCodes();

  // 3. Globale Statistiken vorbereiten
  // Map: Code -> Wie oft insgesamt in der History?
  const globalCodeFreq = new Map<number, number>();
  history.forEach((entry) => {
    const c = entry.assignment.code;
    globalCodeFreq.set(c, (globalCodeFreq.get(c) || 0) + 1);
  });

  // Map: Code -> Wie viele Personen sind berechtigt? (Teiler für Soll-Berechnung)
  const codeEligibilityCount = new Map<number, number>();

  // Wir iterieren einmal über alles, um die Teiler zu bestimmen
  allCodes.forEach((code) => {
    const eligiblePersons = persons.filter((p) => isPersonEligible(p, code));
    codeEligibilityCount.set(code, eligiblePersons.length);
  });

  console.log('XXXXXXXCode Eligibility Count:', codeEligibilityCount);
  const fakeChairmen = persons.filter((p) => isPersonEligible(p, 110));
  console.log(
    'yyyyyyAnzahl Chairman-Kandidaten:',
    fakeChairmen.length,
    'Namen:',
    fakeChairmen.map((p) => p.person_data.person_lastname.value).join(', ')
  );
  // 4. CSV Bauen
  const rows: string[] = [];
  rows.push(
    'Name;Aufgabe;Code;Global Ø/Woche;Soll Ø/Woche (Global/Berechtigte);Ist Ø/Woche;Min Abstand;Max Abstand;Anz Personen berechtigt'
  );

  persons.forEach((person) => {
    const name = `${person.person_data.person_lastname.value}, ${person.person_data.person_firstname.value}`;

    // Sammler für die "GESAMT"-Zeile
    let sumTheoretical = 0;
    let sumActual = 0;
    let sumGlobal = 0;
    const allDatesOfPerson: string[] = [];

    // Wir gehen ALLE Codes durch (nicht nur die aus der History)
    allCodes.forEach((code) => {
      // WICHTIG: Nur wenn Person berechtigt ist, Zeile erzeugen
      if (!isPersonEligible(person, code)) return;

      const codeName = AssignmentCode[code];

      // A) Globaler Durchschnitt dieser Aufgabe (z.B. Vorsitz ist immer 1.0)
      const globalTotal = globalCodeFreq.get(code) || 0;
      const globalAvg = globalTotal / totalWeeks;

      // B) Wie viele Leute können das?
      const numEligible = codeEligibilityCount.get(code) || 0;

      // C) Soll Durchschnitt (Fair Share)
      const theoreticalAvg = numEligible > 0 ? globalAvg / numEligible : 0;

      // D) Ist Durchschnitt (Eigene History)
      const personEntries = history.filter(
        (h) =>
          h.assignment.person === person.person_uid &&
          h.assignment.code === code
      );
      const actualCount = personEntries.length;
      const actualAvg = actualCount / totalWeeks;

      // E) Abstände
      const dates = personEntries.map((e) => e.weekOf);
      const { min, max } = calculateIntervalMetrics(dates);
      const minStr = min === Infinity ? '-' : min.toString();
      const maxStr = max === -Infinity ? '-' : max.toString();

      // Zu Summen hinzufügen
      sumGlobal += globalAvg;
      sumTheoretical += theoreticalAvg;
      sumActual += actualAvg;
      allDatesOfPerson.push(...dates);

      rows.push(
        `${name};${codeName};` +
          `${code};` +
          `${globalAvg.toFixed(4).replace('.', ',')};` +
          `${theoreticalAvg.toFixed(4).replace('.', ',')};` +
          `${actualAvg.toFixed(4).replace('.', ',')};` +
          `${minStr};${maxStr};` +
          `${numEligible}`
      );
    });

    // GESAMT Zeile für Person
    const { min: gMin, max: gMax } = calculateIntervalMetrics(allDatesOfPerson);
    const gMinStr = gMin === Infinity ? '-' : gMin.toString();
    const gMaxStr = gMax === -Infinity ? '-' : gMax.toString();

    rows.push(
      `${name};GESAMT;` +
        `999;` +
        `${sumGlobal.toFixed(4).replace('.', ',')};` +
        `${sumTheoretical.toFixed(4).replace('.', ',')};` +
        `${sumActual.toFixed(4).replace('.', ',')};` +
        `${gMinStr};${gMaxStr}`
    );
  });

  return rows.join('\n');
};
