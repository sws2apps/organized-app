// services/app/assignment_selection.ts
import { AssignmentHistoryType } from '@definition/schedules';
import { PersonType } from '@definition/person';
import {
  AssignmentCode,
  MM_ASSIGNMENT_CODES,
  WM_ASSIGNMENT_CODES,
} from '@definition/assignment';
import {
  ASSIGNMENT_CONFLICTS,
  STUDENT_TASK_CODES,
} from '@constants/assignmentConflicts';
import { ASSIGNMENTS_STRUCTURE } from '@constants/index';
import { AssignmentTask } from './autofill_new';
import { calculateOpportunityScore } from './assignments_with_stats';

/**
 * Berechnet dynamisch den Threshold-Faktor basierend auf der Nutzer-Formel:
 * 80 / (1 + 0,019 * (Ratio*100)^0,75)
 */
const getDynamicThresholdFactor = (
  specificScore: number,
  globalScore: number
): number => {
  // Schutz vor Division durch Null
  if (globalScore === 0) return 0.5;

  // 1. Ratio berechnen (0.0 bis 1.0)
  let ratio = specificScore / globalScore;

  // Safety Clamps
  if (ratio > 1) ratio = 1;
  if (ratio < 0) ratio = 0;

  // 2. Umrechnen in Prozent für die Formel (0 bis 100)
  const ratioPercent = ratio * 100;

  // 3. Deine Formel anwenden
  // Math.pow(basis, exponent) ist JS für basis^exponent
  const thresholdPercent = 80 / (1 + 0.019 * Math.pow(ratioPercent, 0.75));

  // 4. Rückgabe als Faktor (z.B. 0.5 für 50%)
  return thresholdPercent / 100;
};

// Helper: Gibt den Montag der Woche zurück, um Wochentage zu ignorieren
const getMondayOfWeek = (d: Date): number => {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.getTime();
};

// Helper: Berechnet die Differenz in VOLLEN WOCHEN
export const getDistanceInWeeks = (
  history: AssignmentHistoryType[],
  personUid: string,
  targetDateStr: string,
  codesToCheck?: AssignmentCode[],
  codesToIgnore: AssignmentCode[] = []
): number => {
  const targetDate = new Date(targetDateStr);
  const targetMondayTime = getMondayOfWeek(new Date(targetDate)); // Kopie erstellen um Original nicht zu ändern

  let minWeeks = Infinity;

  for (const entry of history) {
    if (entry.assignment.person !== personUid) continue;

    const code = entry.assignment.code;

    // Assistenten ignorieren (optional, aber empfohlen)
    if (codesToIgnore.includes(entry.assignment.code)) continue; // 129 = MM_AssistantOnly (Prüfe deinen Code-Enum!)

    const isRelevant = codesToCheck ? codesToCheck.includes(code) : true;

    if (isRelevant) {
      // Wir normalisieren auch das History-Datum auf den Montag
      const entryDate = new Date(entry.weekOf);
      const entryMondayTime = getMondayOfWeek(new Date(entryDate));

      // Differenz in Millisekunden zwischen den Montagen
      const diffMs = Math.abs(targetMondayTime - entryMondayTime);

      // Umrechnen in Wochen (Runden, um Ungenauigkeiten zu vermeiden)
      const weeks = Math.round(diffMs / (1000 * 60 * 60 * 24 * 7));

      if (weeks < minWeeks) {
        minWeeks = weeks;
      }
    }
  }
  return minWeeks;
};

// Helper: Berechnet den "Sättigungs-Status" (sind 80% der Wartezeit rum?)
export const isSaturated = (
  weeksSinceLast: number,
  totalCandidates: number,
  frequencyPerWeek: number,
  thresholdFactor: number = 0.8
): boolean => {
  // Wenn noch nie gemacht (Infinity), ist man immer gesättigt
  if (weeksSinceLast === Infinity) return true;

  // Ideal-Intervall: Wie viele Wochen dauert es rechnerisch, bis jeder 1x dran war?
  // Schutz vor Division durch Null
  const freq = frequencyPerWeek > 0 ? frequencyPerWeek : 0.1;
  const idealInterval = totalCandidates / freq;

  // Die Schwelle: z.B. 20 Wochen Ideal * 0.8 = 16 Wochen Mindestpause
  const threshold = idealInterval * thresholdFactor;

  return weeksSinceLast >= threshold;
};

export const getCorrespondingStudentOrAssistant = (
  assignmentKey: string,
  targetWeekOf: string,
  assignmentsHistory: AssignmentHistoryType[],
  dataView: string
): string | null => {
  // 1. Guard Clause: Nur für AYF Aufgaben relevant
  if (!assignmentKey.startsWith('MM_AYFPart')) return null;

  // 2. Den "Gegenpart"-Key berechnen
  // Wenn wir Assistant sind -> Suche Student. Wenn Student -> Suche Assistant.
  const targetAssignmentKey = assignmentKey.includes('_Assistant_')
    ? assignmentKey.replace('_Assistant_', '_Student_')
    : assignmentKey.replace('_Student_', '_Assistant_');

  const targetAssignment = assignmentsHistory.find((entry) => {
    // A) Datum Check
    if (entry.weekOf !== targetWeekOf) return false;

    // B) Key Check
    if (entry.assignment.key !== targetAssignmentKey) return false;

    // C) DataView Check (Optional, aber gut gegen "Geister-Einträge" aus anderen Gruppen)
    if (entry.assignment.dataView !== dataView) return false;

    return true;
  });

  return targetAssignment ? targetAssignment.assignment.person : null;
};
// Findet heraus, vor wie vielen Wochen der Assistent (assistantUid)
// das letzte Mal mit dem Schüler (studentUid) zusammen war.
const getWeeksSinceLastPairing = (
  assistantUid: string,
  studentUid: string,
  history: AssignmentHistoryType[],
  currentWeekOf: string
): number => {
  // Wir suchen rückwärts in der Historie
  const lastPairingEntry = history.find((entry) => {
    // Check 1: Ist es eine Assistenten-Aufgabe?
    if (!entry.assignment.key.includes('_Assistant_')) return false;

    // Check 2: Ist der Kandidat hier der Assistent?
    if (entry.assignment.person !== assistantUid) return false;

    // Check 3: War der Schüler in diesem Eintrag der Partner?
    // Hinweis: In der History speichern wir oft 'ayf: { student: "UID" }'
    // Wir müssen sicherstellen, dass wir auf das richtige Feld zugreifen.
    // Basierend auf deinen Logs scheint das im `ayf` Objekt zu stehen.
    const entryStudent = entry.assignment.ayf?.student;

    return entryStudent === studentUid;
  });

  if (!lastPairingEntry) {
    return 9999; // Noch nie zusammen gewesen -> Höchste Priorität!
  }

  // Datum berechnen
  const current = new Date(currentWeekOf).getTime();
  const last = new Date(lastPairingEntry.weekOf).getTime();
  const diffWeeks = (current - last) / (1000 * 60 * 60 * 24 * 7);

  return Math.abs(diffWeeks);
};

//MARK: Haupt-Sortierfunktion - für Test auskommentiert
/* export const sortCandidatesMultiLevel = (
  candidates: PersonType[],
  task: AssignmentTask,
  history: AssignmentHistoryType[],
  freqMap: Map<number, number>,
  eligibilityCountMap: Map<number, number>
): PersonType[] => {
  const metaCache = new Map<
    string,
    {
      taskDistWeeks: number;
      globalDistWeeks: number;
      assistantDistWeeks: number; // <--- NEU
      globalOppScore: number;
      isReady: boolean;
      hasAssignmentThisWeek: boolean;
      _thresholdWeeks: number;
    }
  >();

  const isAssistantTask = task.code === AssignmentCode.MM_AssistantOnly;

  candidates.forEach((p) => {
    // 1. Abstände MÜSSEN VERMUTLICH AUCH AUF DATAVIEW BASIS BERECHNET WERDEN
    const taskDistWeeks = getDistanceInWeeks(
      history,
      p.person_uid,
      task.targetDate,
      [task.code]
    );

    const globalDistWeeks = getDistanceInWeeks(
      history,
      p.person_uid,
      task.targetDate,
      'ANY'
    );

    const studentUid = isAssistantTask
      ? getCorrespondingStudentOrAssistant(
          task.assignmentKey,
          task.schedule.weekOf,
          history,
          task.dataView
        )
      : null;

    const assistantDistWeeks =
      isAssistantTask && studentUid
        ? getWeeksSinceLastPairing(
            p.person_uid,
            studentUid,
            history,
            task.schedule.weekOf
          )
        : 0; // Fallback, falls kein Schüler gefunden wurde

    const hasAssignmentThisWeek = globalDistWeeks === 0;

    // 2. Scores
    const { globalScore, specificScore } = calculateOpportunityScore(
      p,
      freqMap,
      eligibilityCountMap,
      task.dataView,
      task.code
    );

    // 3. Dynamische Sättigung berechnen
    let isSaturated = true;
    let debugThreshold = 0;

    if (specificScore > 0 && globalScore > 0) {
      // A) Basis: Das ideale Intervall (z.B. alle 20 Wochen)
      const idealIntervalWeeks = 1 / specificScore;

      // B) Der dynamische Faktor (Das Herzstück!)
      // Spezialisten bekommen hier z.B. 0.4, Generalisten 0.9
      const dynamicFactor = getDynamicThresholdFactor(
        specificScore,
        globalScore
      );

      // C) Der individuelle Threshold
      // Bsp Schüler: 20 Wochen * 0.4 = 8 Wochen Pause nötig.
      // Bsp Ältester: 20 Wochen * 0.9 = 18 Wochen Pause nötig.
      const thresholdWeeks = idealIntervalWeeks * dynamicFactor;

      debugThreshold = thresholdWeeks;

      // D) Prüfung
      // Wir prüfen primär auf die Aufgaben-Wartezeit, da der Faktor
      // die Global-Last ja schon über die Ratio berücksichtigt!
      const isSaturatedSpecific = taskDistWeeks >= thresholdWeeks;

      // Optional: Globale Sättigung (Burnout-Schutz)
      // Hier können wir strikter sein (z.B. feste 50% des Global Intervals),
      // aber meistens reicht die gesteuerte spezifische Sättigung.
      const idealGlobalInterval = 1 / globalScore;
      const isSaturatedGlobal = globalDistWeeks >= idealGlobalInterval * 0.5;

      //the
      const isSaturatedAssistant = isAssistantTask
        ? assistantDistWeeks >= thresholdWeeks
        : true;

      if (!isAssistantTask) {
        isSaturated = isSaturatedSpecific && isSaturatedGlobal;
      } else {
        isSaturated = isSaturatedSpecific && isSaturatedAssistant;
      }
    }

    const isReady = !hasAssignmentThisWeek && isSaturated;

    metaCache.set(p.person_uid, {
      taskDistWeeks,
      globalDistWeeks,
      assistantDistWeeks: assistantDistWeeks || 0, // <--- NEU (mit Default 0 für Nicht-Assis)
      globalOppScore: globalScore,
      isReady,
      hasAssignmentThisWeek,
      _thresholdWeeks: debugThreshold,
    });
  });

  // 4. Sortieren
  return [...candidates].sort((a, b) => {
    const metaA = metaCache.get(a.person_uid)!;
    const metaB = metaCache.get(b.person_uid)!;

    // Stufe 0: Notbremse
    if (metaA.hasAssignmentThisWeek !== metaB.hasAssignmentThisWeek) {
      return metaA.hasAssignmentThisWeek ? 1 : -1;
    }

    // Stufe 1: Bereitschaft (Tier 1 vs Tier 2)
    if (metaA.isReady !== metaB.isReady) {
      return metaA.isReady ? -1 : 1;
    }

    // Stufe 2: Sortierung
    if (metaA.isReady) {
      // --- NEU: ZUSATZREGEL FÜR ASSISTENTEN ---
      if (isAssistantTask) {
        // Wer länger nicht mit DIESEM Schüler war, kommt zuerst!
        // Wir nutzen metaA.assistantDistWeeks (das musst du im Interface oben ergänzen)
        if (metaA.assistantDistWeeks !== metaB.assistantDistWeeks) {
          return metaB.assistantDistWeeks - metaA.assistantDistWeeks;
        }
        // Wenn gleichstand, greift die normale Logik unten als Tie-Breaker
      }
      // ----------------------------------------
      // Beide sind Ready -> Spezialisten (geringe Last) zuerst
      if (Math.abs(metaA.globalOppScore - metaB.globalOppScore) > 0.0001) {
        return metaA.globalOppScore - metaB.globalOppScore;
      }
      return metaB.taskDistWeeks - metaA.taskDistWeeks;
    } else {
      // Beide Wartend -> Global längste Pause zuerst
      if (metaA.globalDistWeeks !== metaB.globalDistWeeks) {
        if (metaA.globalDistWeeks === Infinity) return -1;
        if (metaB.globalDistWeeks === Infinity) return 1;
        return metaB.globalDistWeeks - metaA.globalDistWeeks;
      }
      return metaA.globalOppScore - metaB.globalOppScore;
    }
  });
}; 
*/

export const sortCandidatesMultiLevel = (
  candidates: PersonType[],
  task: AssignmentTask,
  history: AssignmentHistoryType[],
  freqMap: Map<number, number>,
  eligibilityCountMap: Map<number, number>
): PersonType[] => {
  const metaCache = new Map<
    string,
    {
      taskDistWeeks: number;
      globalDistWeeks: number;
      assistantDistWeeks: number;
      globalOppScore: number;
      isReady: boolean;
      hasAssignmentThisWeek: boolean;
      _thresholdWeeks: number;
    }
  >();
  const codesForGlobalDist = MM_ASSIGNMENT_CODES.includes(task.code)
    ? MM_ASSIGNMENT_CODES
    : WM_ASSIGNMENT_CODES;
  const isAssistantTask = task.code === AssignmentCode.MM_AssistantOnly;

  candidates.forEach((p) => {
    // 1. Abstände berechnen
    const taskDistWeeks = getDistanceInWeeks(
      history,
      p.person_uid,
      task.targetDate,
      [task.code]
    );

    const globalDistWeeks = getDistanceInWeeks(
      history,
      p.person_uid,
      task.targetDate,
      codesForGlobalDist,
      [AssignmentCode.MM_AssistantOnly]
    );

    const studentUid = isAssistantTask
      ? getCorrespondingStudentOrAssistant(
          task.assignmentKey,
          task.schedule.weekOf,
          history,
          task.dataView
        )
      : null;

    const assistantDistWeeks =
      isAssistantTask && studentUid
        ? getWeeksSinceLastPairing(
            p.person_uid,
            studentUid,
            history,
            task.schedule.weekOf
          )
        : 0;

    const hasAssignmentThisWeek = globalDistWeeks === 0;

    // 2. Scores
    const scores = calculateOpportunityScore(
      p,
      freqMap,
      eligibilityCountMap,
      task.dataView,
      task.code
    );

    const isMidweekTask = MM_ASSIGNMENT_CODES.includes(task.code);

    const relevantGlobalScore = isMidweekTask
      ? scores.mm_globalScore
      : scores.wm_globalScore;

    // 3. Dynamische Sättigung berechnen
    let isSaturated = true;
    let debugThreshold = 0;

    if (scores.specificScore > 0 && relevantGlobalScore > 0) {
      const idealIntervalWeeks = 1 / scores.specificScore;
      const dynamicFactor = getDynamicThresholdFactor(
        scores.specificScore,
        relevantGlobalScore
      );

      const thresholdWeeks = idealIntervalWeeks * dynamicFactor;
      debugThreshold = thresholdWeeks;

      const isSaturatedSpecific = taskDistWeeks >= thresholdWeeks;

      const idealGlobalInterval = 1 / relevantGlobalScore;
      const isSaturatedGlobal =
        globalDistWeeks >= idealGlobalInterval * dynamicFactor;

      const isSaturatedAssistant = isAssistantTask
        ? assistantDistWeeks >= thresholdWeeks
        : true;

      if (!isAssistantTask) {
        isSaturated = isSaturatedSpecific && isSaturatedGlobal;
      } else {
        isSaturated = isSaturatedSpecific && isSaturatedAssistant;
      }
    }

    const isReady = !hasAssignmentThisWeek && isSaturated;

    metaCache.set(p.person_uid, {
      taskDistWeeks,
      globalDistWeeks,
      assistantDistWeeks: assistantDistWeeks || 0,
      globalOppScore: relevantGlobalScore,
      isReady,
      hasAssignmentThisWeek,
      _thresholdWeeks: debugThreshold,
    });
  });

  // 4. Sortieren (Ergebnis in Variable speichern)
  const sortedResult = [...candidates].sort((a, b) => {
    const metaA = metaCache.get(a.person_uid)!;
    const metaB = metaCache.get(b.person_uid)!;

    // Stufe 0: Notbremse
    if (metaA.hasAssignmentThisWeek !== metaB.hasAssignmentThisWeek) {
      return metaA.hasAssignmentThisWeek ? 1 : -1;
    }

    // Stufe 1: Bereitschaft
    if (metaA.isReady !== metaB.isReady) {
      return metaA.isReady ? -1 : 1;
    }

    // Stufe 2: Sortierung
    if (metaA.isReady) {
      if (isAssistantTask) {
        if (metaA.assistantDistWeeks !== metaB.assistantDistWeeks) {
          return metaB.assistantDistWeeks - metaA.assistantDistWeeks;
        }
      }
      if (Math.abs(metaA.globalOppScore - metaB.globalOppScore) > 0.0001) {
        return metaA.globalOppScore - metaB.globalOppScore;
      }
      return metaB.taskDistWeeks - metaA.taskDistWeeks;
    } else {
      if (metaA.globalDistWeeks !== metaB.globalDistWeeks) {
        if (metaA.globalDistWeeks === Infinity) return -1;
        if (metaB.globalDistWeeks === Infinity) return 1;
        return metaB.globalDistWeeks - metaA.globalDistWeeks;
      }
      return metaA.globalOppScore - metaB.globalOppScore;
    }
  });

  // --- NEU: LOGGING ---

  // Zeile 1: Kontext-Infos
  const taskName = AssignmentCode[task.code];
  const freqVal = freqMap.get(task.code) ?? 0;
  const eligVal = eligibilityCountMap.get(task.code) ?? 0;

  console.log(
    `%c[Sort Debug] Task: ${taskName} | Week: ${task.schedule.weekOf} | Freq: ${freqVal} | Elig: ${eligVal}`,
    'background: #222; color: #bada55; padding: 4px;'
  );

  // Zeile 2: Tabelle
  // Wir mappen die sortierte Liste auf ein flaches Objekt für console.table
  const tableData = sortedResult.map((p) => {
    const m = metaCache.get(p.person_uid)!;
    return {
      Name: `${p.person_data.person_lastname.value}, ${p.person_data.person_firstname.value}`, // Passe dies an deine Namensfelder an
      Ready: m.isReady ? '✅' : '❌',
      ThisWeek: m.hasAssignmentThisWeek ? '⚠️' : '-',
      TaskDist: m.taskDistWeeks === Infinity ? 'Inf' : m.taskDistWeeks,
      GlobDist: m.globalDistWeeks,
      AssisDist: isAssistantTask ? m.assistantDistWeeks : 'n/a',
      Score: Number(m.globalOppScore.toFixed(4)), // Number für bessere Lesbarkeit in Chrome
      Thresh: Number(m._thresholdWeeks.toFixed(1)),
    };
  });

  console.table(tableData);

  // Ergebnis zurückgeben
  return sortedResult;
};

/**
 * Prüft, ob ein Assistent zu einem Schüler passt.
 * Regeln:
 * 1. Gleiches Geschlecht
 * 2. ODER Familienmitglied (dann ist Geschlecht egal)
 */
export const isValidAssistantForStudent = (
  student: PersonType,
  assistant: PersonType
): boolean => {
  // 1. Familien-Check
  // Prüfen, ob Assistent in der Familie des Schülers ist
  const isAssistantInStudentsFamily =
    student.person_data.family_members?.members.includes(assistant.person_uid);

  // Prüfen, ob Schüler in der Familie des Assistenten ist (Sicherheitshalber beidseitig)
  const isStudentInAssistantsFamily =
    assistant.person_data.family_members?.members.includes(student.person_uid);

  const isFamily = isAssistantInStudentsFamily || isStudentInAssistantsFamily;

  if (isFamily) {
    return true; // Familie darf immer zusammenarbeiten
  }

  // 2. Geschlechter-Check (nur wenn keine Familie)
  const studentIsMale = student.person_data.male.value;
  const assistantIsMale = assistant.person_data.male.value;

  // Beide müssen das gleiche Geschlecht haben
  return studentIsMale === assistantIsMale;
};

/**
 * Baut Maps auf, um Beziehungen zwischen Codes und Sektionen schnell abzufragen.
 * Basierend auf der zentralen ASSIGNMENTS_STRUCTURE.
 */
export const buildSectionMaps = (structure = ASSIGNMENTS_STRUCTURE) => {
  // Map 1: Welcher Code gehört zu welcher Section-ID?
  const codeToSectionId = new Map<number, string>();

  // Map 2: Welche Codes sind in einer Section enthalten?
  const sectionIdToCodes = new Map<string, number[]>();

  structure.forEach((section) => {
    // Wir brauchen eine ID für die Sektion.
    // Falls deine Structure keine 'id' hat, nimm 'key' oder generiere eine.
    // Ich gehe hier von 'section.id' oder 'section.header' aus.
    const sectionId = section.id;

    const codes: number[] = [];

    section.items.forEach((item) => {
      codeToSectionId.set(item.code, sectionId);
      codes.push(item.code);
    });

    sectionIdToCodes.set(sectionId, codes);
  });

  return { codeToSectionId, sectionIdToCodes };
};

export const hasAssignmentConflict = (
  candidate: PersonType,
  targetWeekOf: string,
  currentTaskCode: AssignmentCode,
  history: AssignmentHistoryType[],
  currentDataView: string
): boolean => {
  // 1. Hole alle Aufgaben der Person in dieser Woche (egal welche DataView!)
  // Wir filtern nur nach Person und Woche.

  const tasksInWeek = history.filter(
    (entry) =>
      entry.weekOf === targetWeekOf &&
      entry.assignment.person === candidate.person_uid &&
      entry.assignment.key.slice(0, 3) ===
        AssignmentCode[currentTaskCode].slice(0, 3) //only the midweek or the weekend part
  );

  if (tasksInWeek.length === 0) return false;

  // 2. Konflikt-Prüfung
  for (const entry of tasksInWeek) {
    const existingCode = entry.assignment.code;

    // --- NEU: DATAVIEW CHECK (Der Fremd-Filter) ---
    // Wir schauen, ob der Eintrag zu unserer aktuellen DataView gehört.
    // Hinweis: Wir gehen davon aus, dass in 'entry.assignment' ein Feld 'type' oder 'dataView' existiert.
    // Passe 'type' an den Namen an, wie er bei dir in der DB steht (z.B. entry.assignment.type oder entry.dataView).
    const entryDataView = entry.assignment.dataView || 'unknown';

    if (entryDataView !== currentDataView) {
      // AHA! Der Bruder hat eine Aufgabe in einer ANDEREN DataView (z.B. andere Versammlung/Gruppe).
      // Das ist ein harter Konflikt -> Sperren!
      return true;
    }
    // ------------------------------------------------

    // 3. Matrix-Checks (Nur für Aufgaben innerhalb DERSELBEN DataView)

    // Identitäts-Check
    if (existingCode === currentTaskCode) {
      return true;
    }
    // Matrix (Bidirektional)
    const conflictsNew = ASSIGNMENT_CONFLICTS[currentTaskCode] || [];
    if (conflictsNew.includes(existingCode)) {
      return true;
    }

    const conflictsExisting = ASSIGNMENT_CONFLICTS[existingCode] || [];
    if (conflictsExisting.includes(currentTaskCode)) {
      return true;
    }
  }

  // 4. Gruppen-Logik (Schüleraufgaben)
  if (STUDENT_TASK_CODES.includes(currentTaskCode)) {
    const hasStudentPart = tasksInWeek.some(
      (entry) =>
        // Auch hier sicherstellen, dass wir nur Aufgaben der gleichen DataView als "Doppelung" zählen,
        // aber oben haben wir Fremd-DataViews ja schon pauschal verboten.
        entry.assignment.dataView === currentDataView &&
        STUDENT_TASK_CODES.includes(entry.assignment.code)
    );
    if (hasStudentPart) return true;
  }

  return false;
};
