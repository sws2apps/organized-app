import { ASSIGNMENT_PATH } from '@constants/index';
import { ASSIGNMENT_DEFAULTS } from '@constants/index';
import { AssignmentCode } from '@definition/assignment';
import { SchedWeekType } from '@definition/schedules';
import { SourceWeekType, ApplyMinistryType } from '@definition/sources';
import {
  schedulesAutofillSaveAssignment,
  schedulesBuildHistoryList,
} from './schedules';
import { AssignmentFieldType } from '@definition/assignment';
import { AssignmentHistoryType } from '@definition/schedules';
import { PersonType } from '@definition/person';
import { AssignmentsStatsResultType } from '@definition/assignment';
import { getPersonsSortedByDistance } from './assignments_with_stats';
import { getEligiblePersonsPerDataViewAndCode } from './assignments_with_stats';
import { store } from '@states/index';
import { getAssignmentsWithStats } from './assignments_with_stats';
import { sourcesState } from '@states/sources';
import { personsState } from '@states/persons';
import { assignmentsHistoryState } from '@states/schedules';
import { userDataViewState } from '@states/settings';
import { dbSchedBulkUpdate } from '@services/dexie/schedules';

// SAUBER: Kein 'any' mehr notwendig!
type AssignmentTask = {
  schedule: SchedWeekType; // Wir halten die Referenz auf das typisierte Wochen-Objekt
  path: string; // Der Pfad als String (z.B. "midweek_meeting.chairman...")
  assignmentKey: string;
  code: AssignmentCode;
  elderOnly: boolean;
  sortIndex: number;
};

const assignPersonToTask = (
  task: AssignmentTask,
  dataView: string,
  history: AssignmentHistoryType[],
  candidates: PersonType[] // Alle Personen
) => {
  // B. DIE BESTE PERSON FINDEN
  // Wir übergeben nur die gefilterten Kandidaten an die Logik
  const selectedPerson = findBestPersonForTask(task, candidates, history);

  if (!selectedPerson) {
    console.warn(
      `No available person found for ${task.assignmentKey} in ${dataView} (out of ${candidates.length} candidates)`
    );
    return;
  }

  // C. SPEICHERN
  // Wir nutzen die existierende Funktion
  schedulesAutofillSaveAssignment({
    schedule: task.schedule,
    assignment: task.assignmentKey as AssignmentFieldType,
    value: selectedPerson,
    history: history,
    dataView: dataView,
  });

  console.log(
    `Assigned ${selectedPerson.person_data.person_lastname.value} to ${task.assignmentKey}`
  );
};

// Hilfsfunktion für AYF (bleibt gleich, hier nur verkürzt)
const getAyfCodeFromSource = (
  key: string,
  source: SourceWeekType
): AssignmentCode | null => {
  const partMatch = key.match(/AYFPart(\d+)/);
  if (!partMatch) return null;
  const partIndex = partMatch[1];
  const ayfKey = `ayf_part${partIndex}` as keyof typeof source.midweek_meeting;
  const ayfData = source.midweek_meeting[ayfKey] as ApplyMinistryType;
  if (!ayfData || !ayfData.type) return null;
  const availableCodes = Object.values(ayfData.type);
  return availableCodes.length > 0 ? availableCodes[0] : null;
};

export const handleDynamicAssignmentAutofill = (
  weeksList: SchedWeekType[],
  sources: SourceWeekType[],
  stats: AssignmentsStatsResultType,
  dataView: string,
  assignmentsHistory: AssignmentHistoryType[],
  persons: PersonType[]
) => {
  // 1. Berechtigungs-Map einmalig erstellen
  const eligibilityMap = getEligiblePersonsPerDataViewAndCode(persons);

  const assignmentKeys = Object.keys(ASSIGNMENT_PATH).filter((key) =>
    key.startsWith('MM_')
  );

  weeksList.forEach((schedule) => {
    const source = sources.find((s) => s.weekOf === schedule.weekOf);
    if (!source) return;

    const tasks: AssignmentTask[] = [];

    // --- TASK ERSTELLUNG (wie gehabt) ---
    assignmentKeys.forEach((key) => {
      if (key === 'MM_CircuitOverseer') return;
      if (key.endsWith('_B')) return;

      let code: AssignmentCode | undefined;
      let elderOnly = false;

      if (ASSIGNMENT_DEFAULTS[key]) {
        code = ASSIGNMENT_DEFAULTS[key].code;
        elderOnly = !!ASSIGNMENT_DEFAULTS[key].elderOnly;
      } else if (key.includes('AYFPart')) {
        const dynamicCode = getAyfCodeFromSource(key, source);
        if (dynamicCode) {
          code = dynamicCode;
          elderOnly = false;
        }
      }

      if (!code) return;

      let sortIndex = 99999;
      const viewStats = stats[dataView];
      if (viewStats && viewStats.sections) {
        for (const section of viewStats.sections) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const item = section.items.find((i: any) => i.code === code);
          if (item) {
            sortIndex = item.eligible_count;
            break;
          }
        }
      }

      tasks.push({
        schedule: schedule,
        path: ASSIGNMENT_PATH[key as keyof typeof ASSIGNMENT_PATH],
        assignmentKey: key,
        code,
        elderOnly,
        sortIndex,
      });
    });

    // --- SORTIEREN ---
    tasks.sort((a, b) => a.sortIndex - b.sortIndex);

    // --- ABARBEITEN (Delegieren an die Wrapper-Funktion) ---
    for (const task of tasks) {
      const allowedUIDs = eligibilityMap[dataView]?.[task.code];

      // Wenn für diese Aufgabe niemand qualifiziert ist, brechen wir sofort ab
      if (!allowedUIDs || allowedUIDs.size === 0) {
        // Optional: console.log(`Skipping ${task.assignmentKey}: No eligible persons found.`);
        return;
      }

      // Wir erstellen die Liste der echten Kandidaten-Objekte
      const candidates = persons.filter((p) => allowedUIDs.has(p.person_uid));

      assignPersonToTask(
        task,
        dataView,
        assignmentsHistory,
        candidates // Wir übergeben alle Personen...
      );
    }
  });
};
/**
 * Findet die beste Person aus einer Liste von KANDIDATEN.
 * Erwartet, dass 'candidates' bereits nur Personen enthält, die qualifiziert sind.
 */
export const findBestPersonForTask = (
  task: AssignmentTask,
  candidates: PersonType[], // <--- Das sind jetzt nur noch die "Richtigen"
  history: AssignmentHistoryType[]
): PersonType | undefined => {
  if (candidates.length === 0) {
    return undefined;
  }

  // 1. SORTIEREN: Nach zeitlichem Abstand (Vergangenheit & Zukunft)
  const sortedCandidates = getPersonsSortedByDistance(
    history,
    candidates,
    task.code,
    task.schedule.weekOf
  );

  // 2. VERFÜGBARKEIT PRÜFEN
  for (const candidate of sortedCandidates) {
    // TODO: Hier später TimeAway & Konflikt-Check einfügen
    // if (isAvailable(...) && !hasConflict(...)) {
    return candidate;
    // }
  }

  return undefined;
};

export const handleAutofillMidweekNew = async (weeksList: SchedWeekType[]) => {
  const sources = store.get(sourcesState);
  console.log('sources', sources);
  const assignmentsHistory = store.get(assignmentsHistoryState);
  console.log('assignmentsHistory', assignmentsHistory);

  const dataView = store.get(userDataViewState);

  const persons = store.get(personsState);

  const stats = getAssignmentsWithStats(assignmentsHistory, persons);

  handleDynamicAssignmentAutofill(
    weeksList,
    sources,
    stats,
    dataView,
    assignmentsHistory,
    persons
  );

  // save shallow copy to indexeddb
  await dbSchedBulkUpdate(weeksList);

  // update assignments history
  const history = schedulesBuildHistoryList();
  store.set(assignmentsHistoryState, history);
};
