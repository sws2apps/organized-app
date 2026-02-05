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
import { AssignmentTask } from './autofill';
import { personsAssignmentMetrics } from './assignments_with_stats';

import { differenceInCalendarWeeks } from 'date-fns';

/**
 * Calculates the minimum distance in full calendar weeks between a target date and the most recent relevant assignment in the history.
 *
 * It uses `date-fns` to reliably calculate calendar weeks (assuming weeks start on Monday),
 * which avoids issues with daylight saving time or manual millisecond conversions.
 *
 * @param history - The complete history of assignments.
 * @param personUid - The UID of the person to check.
 * @param targetDateStr - The date currently being planned (as a string).
 * @param codesToCheck - (Optional) If provided, only these assignment codes are considered relevant.
 * @param codesToIgnore - (Optional) List of codes to explicitly ignore (e.g., Assistant parts).
 * @returns The number of calendar weeks since the last assignment. Returns `Infinity` if no matching assignment is found.
 */
export const getDistanceInWeeks = (
  history: AssignmentHistoryType[],
  personUid: string,
  targetDateStr: string,
  codesToCheck?: AssignmentCode[],
  codesToIgnore: AssignmentCode[] = []
): number => {
  const targetDate = new Date(targetDateStr);
  let minWeeks = Infinity;

  for (const entry of history) {
    // 1. Filter: Person match
    if (entry.assignment.person !== personUid) continue;

    const code = entry.assignment.code;

    // 2. Filter: Ignore list
    if (codesToIgnore.includes(code)) continue;

    // 3. Filter: Whitelist (if defined)
    const isRelevant = codesToCheck ? codesToCheck.includes(code) : true;

    if (isRelevant) {
      const entryDate = new Date(entry.weekOf);

      // 4. Calculate Difference
      // 'weekStartsOn: 1' ensures the calculation respects ISO weeks (Monday start)
      const weeks = Math.abs(
        differenceInCalendarWeeks(targetDate, entryDate, { weekStartsOn: 1 })
      );

      if (weeks < minWeeks) {
        minWeeks = weeks;
      }
    }
  }

  return minWeeks;
};

/**
 * Finds the UID of the person assigned to the corresponding role (Student ↔ Assistant) for a specific AYF part.
 *
 * This function helps to identify the "partner" for a given assignment.
 * - If the input key is an **Assistant**, it looks for the assigned **Student**.
 * - If the input key is a **Student**, it looks for the assigned **Assistant**.
 *
 * Useful for validation (e.g., checking if Student and Assistant match gender requirements)
 * or to ensure the same person isn't assigned to both roles simultaneously.
 *
 * @param assignmentKey - The assignment key of the current task (e.g., `MM_AYFPart1_Student`).
 * @param targetWeekOf - The ISO date string of the week to search in.
 * @param assignmentsHistory - The history/schedule array containing existing assignments.
 * @param dataView - The data view (e.g., 'main') to ensure the lookup happens in the correct group.
 * @returns The `personUid` of the counterpart if found, otherwise `null`.
 */
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

/**
 * Calculates the number of weeks since a specific student and assistant last worked together.
 *
 * This function scans the history to find the most recent assignment where the given `assistantUid`
 * supported the given `studentUid`. It is used to prevent the same pair from working together too frequently.
 *
 * @param assistantUid - The UID of the assistant being checked.
 * @param studentUid - The UID of the student who needs an assistant.
 * @param history - The complete assignment history.
 * @param currentWeekOf - The date of the week currently being planned (ISO string).
 * @returns The number of weeks since the last pairing. Returns `9999` if they have never worked together.
 */
const getWeeksSinceLastPairing = (
  assistantUid: string,
  studentUid: string,
  history: AssignmentHistoryType[],
  currentWeekOf: string
): number => {
  const targetDate = new Date(currentWeekOf);

  // 1. Find ALL past pairings of this couple
  const pairings = history.filter((entry) => {
    // Basic checks
    if (!entry.assignment.key?.includes('_Assistant_')) return false;
    if (entry.assignment.person !== assistantUid) return false;

    // Check if the student matches
    const entryStudent = entry.assignment.ayf?.student;
    return entryStudent === studentUid;
  });

  if (pairings.length === 0) {
    return 9999; // Never worked together -> No penalty
  }

  // 2. Find the minimum distance (most recent occurrence)
  let minWeeks = Infinity;

  pairings.forEach((entry) => {
    const entryDate = new Date(entry.weekOf);

    // Calculate difference in weeks using date-fns
    const weeks = Math.abs(
      differenceInCalendarWeeks(targetDate, entryDate, { weekStartsOn: 1 })
    );

    if (weeks < minWeeks) {
      minWeeks = weeks;
    }
  });

  return minWeeks;
};

/**
 * Calculates the "Recovery Tier" (0-5) for a candidate.
 *
 * This metric normalizes the waiting time based on the person's workload.
 * - **Standard Task:** Compares waiting time against the person's total workload score.
 * - **Assistant Task:** Compares waiting time against the fixed assignment threshold.
 *
 * @returns A tier integer (usually 0 to 5), where higher means "more recovered" (higher priority).
 */
const calculateRecoveryTier = (
  person: PersonType,
  task: AssignmentTask,
  history: AssignmentHistoryType[],
  personMetrics: personsAssignmentMetrics | undefined,
  assignmentCodeThreshold: number
): number => {
  const isAssistantTask = task.code === AssignmentCode.MM_AssistantOnly;
  const weightingFactor = personMetrics?.weightingFactor || 1;
  let recoveryProgress = 0;

  if (!isAssistantTask) {
    // 1. Standard Logic
    const codesForGlobalDist = MM_ASSIGNMENT_CODES.includes(task.code)
      ? MM_ASSIGNMENT_CODES
      : WM_ASSIGNMENT_CODES;

    const personalLoad = personMetrics?.total_globalScore || 0;

    const globalDistWeeks = getDistanceInWeeks(
      history,
      person.person_uid,
      task.targetDate,
      codesForGlobalDist,
      [AssignmentCode.MM_AssistantOnly]
    );

    const safeGlobalDist =
      globalDistWeeks === Infinity ? 1000 : globalDistWeeks;
    const weightedGlobalWait = safeGlobalDist * weightingFactor;

    // Threshold is inverse of load (Load 0.5 -> Threshold 2 weeks)
    const globalThreshold = Math.max(
      1,
      Math.floor(personalLoad > 0 ? 1 / personalLoad : 0)
    );

    if (globalThreshold > 0) {
      recoveryProgress = weightedGlobalWait / globalThreshold;
    } else {
      recoveryProgress = 10.0; // Instant recovery if no load
    }
  } else {
    // 2. Assistant Logic
    const assistantDistWeeks = getDistanceInWeeks(
      history,
      person.person_uid,
      task.targetDate,
      [AssignmentCode.MM_AssistantOnly]
    );

    const assistantSafeDist =
      assistantDistWeeks === Infinity ? 1000 : assistantDistWeeks;
    const assistantWeightedWait = assistantSafeDist * weightingFactor;

    recoveryProgress = assignmentCodeThreshold > 0 
      ? assistantWeightedWait / assignmentCodeThreshold 
      : 1; // Full recovery if no threshold defined
  }

  // Cap at 100% (1.0) and calculate Tier (steps of 20%)
  if (recoveryProgress > 1) recoveryProgress = 1;
  return Math.round((recoveryProgress * 100) / 20);
};

/**
 * Calculates the weighted waiting time for the specific task or pairing.
 *
 * - **Standard Task:** Returns the time since the person last performed *this specific code*.
 * - **Assistant Task:** Returns the time since the person last assisted *this specific student*.
 *
 * @returns The weighted distance in weeks.
 */
const calculateTaskWaitScore = (
  person: PersonType,
  task: AssignmentTask,
  history: AssignmentHistoryType[],
  weightingFactor: number
): number => {
  const isAssistantTask = task.code === AssignmentCode.MM_AssistantOnly;
  let relevantDistWeeks = 0;

  if (!isAssistantTask) {
    // A) Standard: Time since this specific task code
    relevantDistWeeks = getDistanceInWeeks(
      history,
      person.person_uid,
      task.targetDate,
      [task.code]
    );
  } else {
    // B) Assistant: Time since pairing with this student
    const studentUid = getCorrespondingStudentOrAssistant(
      task.assignmentKey,
      task.schedule.weekOf,
      history,
      task.dataView
    );

    if (studentUid) {
      relevantDistWeeks = getWeeksSinceLastPairing(
        person.person_uid,
        studentUid,
        history,
        task.schedule.weekOf
      );
    } else {
      relevantDistWeeks = 0; // Neutral if no student assigned yet
    }
  }

  const safeDist = relevantDistWeeks === Infinity ? 1000 : relevantDistWeeks;
  return safeDist * weightingFactor;
};

//MARK: MAIN SORT FUNCTION
/**
 * Sorts a list of candidates based on a multi-level priority system ("Tier System").
 *
 * The sorting logic applies four levels of criteria in descending order of importance:
 *
 * 1. **Global Waiting Tier (Recovery):**
 * - Divides candidates into "Tiers" (groups) based on how long they have waited relative to their personal workload.
 * - A candidate with high "Recovery Progress" (e.g., waited 10 weeks while usually assigned every 4 weeks) gets a higher Tier.
 * - This ensures fairness by normalizing different assignment frequencies.
 *
 * 2. **Specific Task Wait Time:**
 * - Within the same Tier, candidates are sorted by how long it has been since they last performed *this specific task*.
 * - Candidates who have waited longer for this particular assignment code are preferred.
 *
 * 3. **Workload in Current Meeting:**
 * - Candidates with fewer assignments in the current meeting week are preferred to avoid overloading.
 *
 * 4. **Random Tie-Breaker:**
 * - If all metrics above (Tier, Wait Time, Workload) are identical, a random factor is applied.
 * - This prevents static ordering (e.g., by name or ID) and ensures variation among equally qualified candidates.
 *
 * @param candidates - List of eligible persons to sort.
 * @param task - The specific assignment task being planned.
 * @param history - Complete assignment history for distance calculations.
 * @param assignmentCodeThreshold - Reference value for assistant task frequency (only used for assistant tasks).
 * @param personsMetrics - Pre-calculated metrics map containing global scores and weighting factors.
 * @returns A new array of candidates sorted by priority (best candidate first).
 */
export const sortCandidatesMultiLevel = (
  candidates: PersonType[],
  task: AssignmentTask,
  history: AssignmentHistoryType[],
  assignmentCodeThreshold: number,
  personsMetrics: Map<string, personsAssignmentMetrics>
): PersonType[] => {
  const metaCache = new Map<
    string,
    {
      globalWaitTier: number;
      taskWaitTime: number;
      taskCountThisMeeting: number;
      randomSeed: number;
    }
  >();

  candidates.forEach((p) => {
    const personMetrics = personsMetrics.get(p.person_uid);
    const weightingFactor = personMetrics?.weightingFactor || 1;

    // 1. Calculate Tier
    const recoveryTier = calculateRecoveryTier(
      p,
      task,
      history,
      personMetrics,
      assignmentCodeThreshold
    );

    // 2. Calculate Specific Wait (or Pairing)
    const taskWaitTime = calculateTaskWaitScore(
      p,
      task,
      history,
      weightingFactor
    );
    // 3. Calculate Workload this week
    const assignmentCountThisWeek = history.filter(
      (h) =>
        h.weekOf === task.schedule.weekOf &&
        h.assignment.person === p.person_uid &&
        MM_ASSIGNMENT_CODES.includes(h.assignment.code) ===
          MM_ASSIGNMENT_CODES.includes(task.code)
    ).length;

    const randomFactor = Math.random();

    metaCache.set(p.person_uid, {
      globalWaitTier: recoveryTier,
      taskWaitTime: taskWaitTime,
      taskCountThisMeeting: assignmentCountThisWeek,
      randomSeed: randomFactor,
    });
  });

  // 4. Sorting
  const sortedResult = [...candidates].sort((a, b) => {
    const metaA = metaCache.get(a.person_uid)!;
    const metaB = metaCache.get(b.person_uid)!;

    // Priority 1: Global Tier (High to Low)
    if (metaA.globalWaitTier !== metaB.globalWaitTier) {
      return metaB.globalWaitTier - metaA.globalWaitTier;
    }

    // Priority 2: Specific Wait Time / Pairing Distance (Long to Short)
    if (metaA.taskWaitTime !== metaB.taskWaitTime) {
      return metaB.taskWaitTime - metaA.taskWaitTime;
    }

    // Priority 3: Workload this week (Low to High)
    if (metaA.taskCountThisMeeting !== metaB.taskCountThisMeeting) {
      return metaA.taskCountThisMeeting - metaB.taskCountThisMeeting;
    }

    // NEU: Priority 4: Random Tie-Breaker
    return metaA.randomSeed - metaB.randomSeed;
  });

  return sortedResult;
};

/**
 * Checks if an assistant matches a student.
 * Rules:
 * 1. Same gender
 * 2. OR family member (then gender doesn't matter)
 */
/**
 * Checks if a specific assistant is valid for a student based on gender and family relationship rules.
 *
 * Validation Logic:
 * 1. **Family Exception:** Family members are always allowed to work together, regardless of gender (e.g., husband assisting wife, father assisting daughter).
 * 2. **Gender Consistency:** If they are NOT related, the assistant must have the same gender as the student (Male-Male or Female-Female).
 *
 * @param student - The person assigned to the main student part.
 * @param assistant - The candidate being checked for the assistant role.
 * @returns `true` if the pairing is permitted, otherwise `false`.
 */
export const isValidAssistantForStudent = (
  student: PersonType,
  assistant: PersonType
): boolean => {
  // 1. Family check (Bidirectional)
  const isAssistantInStudentsFamily =
    student.person_data.family_members?.members.includes(
      assistant.person_uid
    ) ?? false;

  const isStudentInAssistantsFamily =
    assistant.person_data.family_members?.members.includes(
      student.person_uid
    ) ?? false;

  const isFamily = isAssistantInStudentsFamily || isStudentInAssistantsFamily;

  if (isFamily) {
    return true;
  }

  // 2. Gender check (only required if not family)
  const studentIsMale = student.person_data.male.value;
  const assistantIsMale = assistant.person_data.male.value;

  // Non-family pairs must have the same gender
  return studentIsMale === assistantIsMale;
};

/**
 * Checks if assigning a specific task to a candidate would cause a conflict with their existing assignments in the target week.
 *
 * The conflict detection works on two levels:
 * 1. **Cross-DataView Conflict (Hard Block):**
 * - If the candidate already has an assignment in a *different* DataView (e.g., a Language Group) during the same meeting (Midweek/Weekend),
 * - it is considered a physical impossibility to be in two places at once. Returns `true`.
 *
 * 2. **Same-DataView Conflict (Rule Matrix):**
 * - If the assignments are within the *same* DataView, it checks the `ASSIGNMENT_CONFLICTS` matrix.
 * - Also enforces the "One Student Part Per Meeting" rule.
 *
 * @param candidate - The person being considered for the task.
 * @param targetWeekOf - The ISO date string of the week.
 * @param currentTaskCode - The code of the task currently being planned.
 * @param history - The complete assignment history.
 * @param currentDataView - The current view context (e.g., 'main').
 * @returns `true` if a conflict exists (assignment is NOT allowed), otherwise `false`.
 */
export const hasAssignmentConflict = (
  candidate: PersonType,
  targetWeekOf: string,
  currentTaskCode: AssignmentCode,
  history: AssignmentHistoryType[],
  currentDataView: string
): boolean => {
  // 1. Get all tasks of the person in this week (regardless of DataView!)
  // We filter specifically for the same meeting type (Midweek or Weekend)
  // relying on the naming convention (MM_... vs WM_...)
  const targetPrefix = AssignmentCode[currentTaskCode].slice(0, 3); // 'MM_' or 'WM_'

  const tasksInWeek = history.filter((entry) => {
    const isSameWeek = entry.weekOf === targetWeekOf;
    const isSamePerson = entry.assignment.person === candidate.person_uid;

    const key = entry.assignment.key || '';
    const isSameMeetingType = key.slice(0, 3) === targetPrefix;

    return isSameWeek && isSamePerson && isSameMeetingType;
  });

  if (tasksInWeek.length === 0) return false;

  // 2. Conflict check
  for (const entry of tasksInWeek) {
    const existingCode = entry.assignment.code;

    // --- DATAVIEW CHECK (The Foreign Filter) ---
    // We check if the entry belongs to our current DataView.
    // Default to 'unknown' if undefined to prevent logic errors.
    const entryDataView = entry.assignment.dataView || 'unknown';

    if (entryDataView !== currentDataView) {
      // The brother has a task in ANOTHER DataView (e.g. other congregation/group).
      // This is a hard conflict -> Block!
      return true;
    }
    // ------------------------------------------------

    // 3. Matrix checks (Only for tasks within the SAME DataView)

    // Identity check (cannot do same task twice)
    if (existingCode === currentTaskCode) {
      return true;
    }

    // Matrix (Bidirectional Check)
    // Check if NEW task forbids EXISTING task
    const conflictsNew = ASSIGNMENT_CONFLICTS[currentTaskCode] || [];
    if (conflictsNew.includes(existingCode)) {
      return true;
    }

    // Check if EXISTING task forbids NEW task
    const conflictsExisting = ASSIGNMENT_CONFLICTS[existingCode] || [];
    if (conflictsExisting.includes(currentTaskCode)) {
      return true;
    }
  }

  // 4. Group logic (Student tasks)
  // Ensure a student doesn't have multiple student parts in the same meeting
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
