import { ASSIGNMENT_PATH } from '@constants/index';
import { ASSIGNMENT_DEFAULTS } from '@constants/index';
import { AssignmentCode } from '@definition/assignment';
import { SchedWeekType } from '@definition/schedules';
import { SourceWeekType, ApplyMinistryType } from '@definition/sources';
import { AssignmentsStatsResultType } from '@services/app/assignments_with_stats';

// SAUBER: Kein 'any' mehr notwendig!
type AssignmentTask = {
  schedule: SchedWeekType; // Wir halten die Referenz auf das typisierte Wochen-Objekt
  path: string; // Der Pfad als String (z.B. "midweek_meeting.chairman...")
  assignmentKey: string;
  code: AssignmentCode;
  elderOnly: boolean;
  sortIndex: number;
};

/**
 * Löst den Pfad sicher auf und gibt den Ziel-Knoten zurück.
 * Wir nutzen hier Generics <T>, damit wir definieren können, was wir erwarten.
 */
function getPropertyByPath<T = unknown>(
  obj: unknown,
  path: string
): T | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return path.split('.').reduce((acc: any, part) => acc && acc[part], obj) as T;
}

/**
 * Diese Funktion führt die Zuweisung durch.
 */
const assignPersonToTask = (task: AssignmentTask, dataView: string) => {
  console.log(`Processing ${task.assignmentKey} -> Path: ${task.path}`);

  // 1. Jetzt lösen wir den Pfad auf
  // Wir wissen, dass das Ziel entweder ein Array oder ein Objekt sein muss.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const target = getPropertyByPath<any>(task.schedule, task.path);

  if (!target) {
    console.warn(`Path not found: ${task.path}`);
    return;
  }

  // 2. Logik zur Unterscheidung der Ziel-Typen
  // (Das ist analog zu der schedulesAutofillSaveAssignment Logik, die du gefunden hast)

  // FALL A: Es ist ein Array (z.B. AssignmentCongregation[])
  if (Array.isArray(target)) {
    const assigned = target.find((record) => record.type === dataView);

    // Hier würdest du jetzt die echte Person suchen ...
    const foundPersonUID = 'UID_DER_GEFUNDENEN_PERSON'; // Platzhalter

    if (assigned) {
      assigned.value = foundPersonUID;
      assigned.updatedAt = new Date().toISOString();
    } else {
      target.push({
        type: dataView,
        value: foundPersonUID,
        updatedAt: new Date().toISOString(),
        name: '', // Ggf. füllen
      });
    }
  }
  // FALL B: Es ist ein einzelnes Objekt (z.B. bei manchen AYF Parts oder Objekten)
  else if (typeof target === 'object') {
    // Logik für direkte Objekt-Zuweisung, falls nötig
    // (Hängt davon ab, ob deine Pfade immer auf Arrays zeigen oder nicht)
  }
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
  dataView: string
) => {
  const assignmentKeys = Object.keys(ASSIGNMENT_PATH).filter((key) =>
    key.startsWith('MM_')
  );

  weeksList.forEach((schedule) => {
    const source = sources.find((s) => s.weekOf === schedule.weekOf);
    if (!source) return;

    const tasks: AssignmentTask[] = [];

    assignmentKeys.forEach((key) => {
      // Filter
      if (key === 'MM_CircuitOverseer') return;
      if (key.endsWith('_B')) return;

      // Code ermitteln
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

      // Sortierindex
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

      // TASK ERSTELLEN (Jetzt Typ-Sicher!)
      tasks.push({
        schedule: schedule, // Typ: SchedWeekType (sauber!)
        path: ASSIGNMENT_PATH[key as keyof typeof ASSIGNMENT_PATH], // Typ: string (sauber!)
        assignmentKey: key,
        code,
        elderOnly,
        sortIndex,
      });
    });

    // Sortieren
    tasks.sort((a, b) => a.sortIndex - b.sortIndex);

    // Abarbeiten
    for (const task of tasks) {
      assignPersonToTask(task, dataView);
    }
  });
};
