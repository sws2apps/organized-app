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
import { AssignmentTask } from './autofill_new';
import { calculateOpportunityScore } from './assignments_with_stats';

// Helper: Returns the Monday of the week to ignore weekdays
const getMondayOfWeek = (d: Date): number => {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.getTime();
};

// Helper: Calculates the difference in FULL WEEKS
export const getDistanceInWeeks = (
  history: AssignmentHistoryType[],
  personUid: string,
  targetDateStr: string,
  codesToCheck?: AssignmentCode[],
  codesToIgnore: AssignmentCode[] = []
): number => {
  const targetDate = new Date(targetDateStr);
  const targetMondayTime = getMondayOfWeek(new Date(targetDate)); // Create a copy to avoid modifying the original

  let minWeeks = Infinity;

  for (const entry of history) {
    if (entry.assignment.person !== personUid) continue;

    const code = entry.assignment.code;

    // Ignore assistants (optional but recommended)
    if (codesToIgnore.includes(entry.assignment.code)) continue;

    const isRelevant = codesToCheck ? codesToCheck.includes(code) : true;

    if (isRelevant) {
      // We also normalize the history date to Monday
      const entryDate = new Date(entry.weekOf);
      const entryMondayTime = getMondayOfWeek(new Date(entryDate));

      // Difference in milliseconds between Mondays
      const diffMs = Math.abs(targetMondayTime - entryMondayTime);

      // Convert to weeks (round to avoid inaccuracies)
      const weeks = Math.round(diffMs / (1000 * 60 * 60 * 24 * 7));

      if (weeks < minWeeks) {
        minWeeks = weeks;
      }
    }
  }
  return minWeeks;
};

export const getCorrespondingStudentOrAssistant = (
  assignmentKey: string,
  targetWeekOf: string,
  assignmentsHistory: AssignmentHistoryType[],
  dataView: string
): string | null => {
  // 1. Guard Clause: Only relevant for AYF tasks
  if (!assignmentKey.startsWith('MM_AYFPart')) return null;

  // 2. Calculate the "counterpart" key
  // If we are Assistant -> search Student. If Student -> search Assistant.
  const targetAssignmentKey = assignmentKey.includes('_Assistant_')
    ? assignmentKey.replace('_Assistant_', '_Student_')
    : assignmentKey.replace('_Student_', '_Assistant_');

  const targetAssignment = assignmentsHistory.find((entry) => {
    // A) Date check
    if (entry.weekOf !== targetWeekOf) return false;

    // B) Key check
    if (entry.assignment.key !== targetAssignmentKey) return false;

    // C) DataView Check (Optional, but good against "ghost entries" from other groups)
    if (entry.assignment.dataView !== dataView) return false;

    return true;
  });

  return targetAssignment ? targetAssignment.assignment.person : null;
};
// Finds out how many weeks ago the assistant (assistantUid)
// was last paired with the student (studentUid).
const getWeeksSinceLastPairing = (
  assistantUid: string,
  studentUid: string,
  history: AssignmentHistoryType[],
  currentWeekOf: string
): number => {
  const lastPairingEntry = history.find((entry) => {
    // Check 1: Is it an assistant task?
    if (!entry.assignment.key.includes('_Assistant_')) return false;

    // Check 2: Is the candidate the assistant here?
    if (entry.assignment.person !== assistantUid) return false;

    // Check 3: Was the student the partner in this entry?
    const entryStudent = entry.assignment.ayf?.student;

    return entryStudent === studentUid;
  });

  if (!lastPairingEntry) {
    return 9999; // Never been together -> Highest priority!
  }

  // Calculate date
  const current = new Date(currentWeekOf).getTime();
  const last = new Date(lastPairingEntry.weekOf).getTime();
  const diffWeeks = (current - last) / (1000 * 60 * 60 * 24 * 7);

  return Math.abs(diffWeeks);
};

export const sortCandidatesMultiLevel = (
  candidates: PersonType[],
  task: AssignmentTask,
  history: AssignmentHistoryType[],
  freqMap: Map<string, Map<number, number>>,
  eligibilityCountMap: Map<string, Map<number, number>>
): PersonType[] => {
  let benchmarkScore = 0;
  let totalFrequencySum = 0;

  freqMap.forEach((viewFreqMap) => {
    viewFreqMap.forEach((freq, code) => {
      const isMidweekTask = MM_ASSIGNMENT_CODES.includes(task.code);
      if (isMidweekTask && MM_ASSIGNMENT_CODES.includes(code)) {
        totalFrequencySum += freq;
      } else if (!isMidweekTask && WM_ASSIGNMENT_CODES.includes(code)) {
        totalFrequencySum += freq;
      }
    });
  });

  const maxEligiblePeople = MM_ASSIGNMENT_CODES.includes(task.code)
    ? eligibilityCountMap.get('main')?.get(998) || 1
    : eligibilityCountMap.get('main')?.get(999) || 1;

  benchmarkScore = totalFrequencySum / maxEligiblePeople;

  const tempScores = new Map<string, number>();
  candidates.forEach((p) => {
    const scores = calculateOpportunityScore(
      p,
      freqMap,
      eligibilityCountMap,
      task.dataView,
      task.code
    );
    const isMidweek = MM_ASSIGNMENT_CODES.includes(task.code);
    const globalVal = isMidweek ? scores.mm_globalScore : scores.wm_globalScore;
    tempScores.set(p.person_uid, globalVal);
  });

  const metaCache = new Map<
    string,
    {
      weightedWaitScore: number;
      isReady: boolean;
      recoveryProgress: number;
      recoveryTier: number;
      hasAssignmentThisWeek: boolean;
      assignmentCountThisWeek: number;
      rawWait: number;
      factor: number;
    }
  >();

  const codesForGlobalDist = MM_ASSIGNMENT_CODES.includes(task.code)
    ? MM_ASSIGNMENT_CODES
    : WM_ASSIGNMENT_CODES;
  const isAssistantTask = task.code === AssignmentCode.MM_AssistantOnly;

  candidates.forEach((p) => {
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

    const assignmentCountThisWeek = history.filter(
      (h) =>
        h.weekOf === task.schedule.weekOf &&
        h.assignment.person === p.person_uid &&
        h.assignment.dataView === task.dataView
    ).length;
    const hasAssignmentThisWeek = globalDistWeeks === 0;

    // Weighting factor
    const personalLoad = tempScores.get(p.person_uid) || 0;
    let weightingFactor = 1.0;
    if (benchmarkScore > 0 && personalLoad > 0) {
      weightingFactor = benchmarkScore / personalLoad;
    } else if (personalLoad === 0) {
      weightingFactor = 2.0;
    }

    if (weightingFactor < 1) {
      weightingFactor = 1;
    } else {
      weightingFactor = (-2.5 / benchmarkScore) * personalLoad + 2.5;
    }

    const safeTaskDist = taskDistWeeks === Infinity ? 1000 : taskDistWeeks;
    const weightedWaitScore = safeTaskDist * weightingFactor;

    const safeGlobalDist =
      globalDistWeeks === Infinity ? 1000 : globalDistWeeks;
    const weightedGlobalWait = safeGlobalDist * weightingFactor;

    // Recovery calculation
    const globalThreshold = Math.floor(personalLoad > 0 ? 1 / personalLoad : 0);
    let recoveryProgress = 0;
    if (globalThreshold > 0) {
      recoveryProgress = weightedGlobalWait / globalThreshold;
    } else {
      recoveryProgress = 10.0;
    }

    // Calculate clustering (Tier)
    // Divide percent (0-100) by 20 and round
    // Ex: 45% -> 45 / 20 = 2.25 -> Round to 2
    // Ex: 90% -> 90 / 20 = 4.5 -> Round to 5
    const recoveryTier = Math.round((recoveryProgress * 100) / 20);

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
    const isAssistantReady = isAssistantTask ? assistantDistWeeks >= 4 : true;

    const isSaturated = recoveryProgress >= 1.0; // >= 100%
    const isReady = !hasAssignmentThisWeek && isSaturated && isAssistantReady;

    metaCache.set(p.person_uid, {
      weightedWaitScore,
      isReady,
      recoveryProgress,
      recoveryTier,
      hasAssignmentThisWeek,
      assignmentCountThisWeek,
      rawWait: safeTaskDist,
      factor: weightingFactor,
    });
  });

  // -----------------------------------------------------------
  // VARIABLE RECYCLING FOR ASSISTANTS
  // -----------------------------------------------------------
  if (isAssistantTask) {
    // 1. Collect all real wait times for quartile calculation
    const allWaits = candidates.map(
      (p) => metaCache.get(p.person_uid)!.rawWait
    );
    allWaits.sort((a, b) => b - a);

    candidates.forEach((p) => {
      const m = metaCache.get(p.person_uid)!;

      // A) Calculate quartile (This will be our new "recoveryTier")
      const rankIndex = allWaits.indexOf(m.rawWait);
      const percentile = rankIndex / allWaits.length;
      let quartile = 1;
      if (percentile <= 0.25) quartile = 4;
      else if (percentile <= 0.5) quartile = 3;
      else if (percentile <= 0.75) quartile = 2;
      else quartile = 1;

      // B) Get pairing distance (This will be our new "weightedWaitScore")
      const studentUid = getCorrespondingStudentOrAssistant(
        task.assignmentKey,
        task.schedule.weekOf,
        history,
        task.dataView
      );
      let pairDist = 0;
      if (studentUid) {
        pairDist = getWeeksSinceLastPairing(
          p.person_uid,
          studentUid,
          history,
          task.schedule.weekOf
        );
      }
      m.recoveryTier = quartile; // Tier is now the "Wait Time Group"
      m.weightedWaitScore = pairDist; // Score is now the "Pairing Distance"
      m.isReady = false;
    });
  }

  // 4. Sorting
  const sortedResult = [...candidates].sort((a, b) => {
    const metaA = metaCache.get(a.person_uid)!;
    const metaB = metaCache.get(b.person_uid)!;

    if (metaA.hasAssignmentThisWeek !== metaB.hasAssignmentThisWeek) {
      return metaA.hasAssignmentThisWeek ? 1 : -1;
    }

    if (metaA.isReady !== metaB.isReady) {
      return metaA.isReady ? -1 : 1;
    }

    if (metaA.isReady) {
      // CASE A: Both are READY -> Specific deficit decides
      return metaB.weightedWaitScore - metaA.weightedWaitScore;
    } else {
      // CASE B: Both are NOT READY (Backup)

      // 1. Criterion: The Recovery Tier (20% steps)
      if (metaA.recoveryTier !== metaB.recoveryTier) {
        return metaB.recoveryTier - metaA.recoveryTier;
      }

      // 2. Criterion (if in same tier): Specific wait time
      // Here we prefer the one who waits longer for THIS task
      return metaB.weightedWaitScore - metaA.weightedWaitScore;
    }
  });

  // LOGGING
  const taskName = AssignmentCode[task.code];
  console.log(
    `%c[Sort NewLogic] ${taskName} | weekOf, ${task.schedule.weekOf}`,
    'color: #0f0'
  );

  const tableData = sortedResult.map((p) => {
    const m = metaCache.get(p.person_uid)!;
    return {
      Name: p.person_data.person_lastname.value,
      Ready: m.isReady ? '✅' : '❌',
      Tier: m.recoveryTier,
      Progress: (m.recoveryProgress * 100).toFixed(0) + '%',
      TaskScore: Number(m.weightedWaitScore.toFixed(2)),
      ThisWeek: m.hasAssignmentThisWeek ? '⚠️' : '-',
    };
  });
  console.table(tableData);

  return sortedResult;
};

/**
 * Checks if an assistant matches a student.
 * Rules:
 * 1. Same gender
 * 2. OR family member (then gender doesn't matter)
 */
export const isValidAssistantForStudent = (
  student: PersonType,
  assistant: PersonType
): boolean => {
  // 1. Family check
  const isAssistantInStudentsFamily =
    student.person_data.family_members?.members.includes(assistant.person_uid);

  // Check if assistant is in student's family
  const isStudentInAssistantsFamily =
    assistant.person_data.family_members?.members.includes(student.person_uid);

  const isFamily = isAssistantInStudentsFamily || isStudentInAssistantsFamily;

  if (isFamily) {
    return true; // Family may always work together
  }

  // 2. Gender check (only if not family)
  const studentIsMale = student.person_data.male.value;
  const assistantIsMale = assistant.person_data.male.value;

  // Both must have the same gender
  return studentIsMale === assistantIsMale;
};

export const hasAssignmentConflict = (
  candidate: PersonType,
  targetWeekOf: string,
  currentTaskCode: AssignmentCode,
  history: AssignmentHistoryType[],
  currentDataView: string
): boolean => {
  // 1. Get all tasks of the person in this week (regardless of DataView!)
  // We filter only by person and week.
  const tasksInWeek = history.filter(
    (entry) =>
      entry.weekOf === targetWeekOf &&
      entry.assignment.person === candidate.person_uid &&
      entry.assignment.key.slice(0, 3) ===
        AssignmentCode[currentTaskCode].slice(0, 3) //only the midweek or the weekend part
  );

  if (tasksInWeek.length === 0) return false;

  // 2. Conflict check
  for (const entry of tasksInWeek) {
    const existingCode = entry.assignment.code;

    // --- DATAVIEW CHECK (The Foreign Filter) ---
    // We check if the entry belongs to our current DataView.
    const entryDataView = entry.assignment.dataView || 'unknown';

    if (entryDataView !== currentDataView) {
      // The brother has a task in ANOTHER DataView (e.g. other congregation/group).
      // This is a hard conflict -> Block!
      return true;
    }
    // ------------------------------------------------

    // 3. Matrix checks (Only for tasks within the SAME DataView)

    // Identity check
    if (existingCode === currentTaskCode) {
      return true;
    }
    // Matrix (Bidirectional)
    const conflictsNew = ASSIGNMENT_CONFLICTS[currentTaskCode] || [];
    if (conflictsNew.includes(existingCode)) {
      return true;
    }

    const conflictsExisting = ASSIGNMENT_CONFLICTS[existingCode] || [];
    if (conflictsExisting.includes(currentTaskCode)) {
      return true;
    }
  }

  // 4. Group logic (Student tasks)
  if (STUDENT_TASK_CODES.includes(currentTaskCode)) {
    const hasStudentPart = tasksInWeek.some(
      (entry) =>
        entry.assignment.dataView === currentDataView &&
        STUDENT_TASK_CODES.includes(entry.assignment.code)
    );
    if (hasStudentPart) return true;
  }

  return false;
};
