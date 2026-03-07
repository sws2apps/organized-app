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
import {
  personsAssignmentMetrics,
  AssignmentStatisticsView,
  personsWeightingMetrics,
} from './assignments_with_stats';

import { differenceInCalendarWeeks, subWeeks, addWeeks } from 'date-fns';
import { DataViewKey } from './assignments_with_stats';

export interface DistanceResult {
  minPast: number; // e.g. -3 (3 weeks in the past), or -Infinity
  minFuture: number; // e.g. 3 (3 weeks in the future), or Infinity
  hasAssignmentToday: boolean;
}
/**
 * Calculates the shortest distance in calendar weeks between a target date and a person's closest past and future assignments.
 *
 * This function evaluates the assignment history for a specific person, optionally filtering by data view,
 * included assignment codes, and excluded assignment codes. It calculates calendar week differences
 * (assuming weeks start on Monday). Past assignments result in negative values (closer to 0 is more recent),
 * while future assignments result in positive values. It also flags if an assignment exists in the exact same week.
 *
 * @param history - The complete array of past and future assignments to search through.
 * @param personUid - The unique identifier of the person being evaluated.
 * @param targetDateStr - The reference target date (as a string) from which distances are measured.
 * @param dataView - (Optional) The specific data view (e.g., 'main') to filter assignments by.
 * @param codesToCheck - (Optional) An array of assignment codes to exclusively consider. If omitted, all codes are valid.
 * @param codesToIgnore - (Optional) An array of assignment codes to explicitly exclude from the evaluation. Defaults to an empty array.
 *
 * @returns A `DistanceResult` object containing:
 * - `minPast`: The closest past distance in weeks (a negative number, e.g., -2), or `-Infinity` if none found.
 * - `minFuture`: The closest future distance in weeks (a positive number, e.g., 3), or `Infinity` if none found.
 * - `hasAssignmentToday`: `true` if the person has an assignment in the exact same target week, otherwise `false`.
 */
export const getDistanceInWeeks = (
  history: AssignmentHistoryType[],
  personUid: string,
  targetDateStr: string,
  dataView?: DataViewKey,
  codesToCheck?: AssignmentCode[],
  codesToIgnore: AssignmentCode[] = []
): DistanceResult => {
  const targetDate = new Date(targetDateStr);

  let minPast = -Infinity;
  let minFuture = Infinity;
  let hasAssignmentToday = false;

  for (const entry of history) {
    if (entry.assignment.person !== personUid) continue;

    const code = entry.assignment.code;
    if (codesToIgnore.includes(code!)) continue;

    const isRelevantKey =
      codesToCheck && codesToCheck.length > 0
        ? codesToCheck.includes(code!)
        : true;
    const isRelevantView =
      dataView && dataView.length > 0
        ? dataView === entry.assignment.dataView
        : true;

    if (isRelevantKey && isRelevantView) {
      const entryDate = new Date(entry.weekOf);
      const weeks = differenceInCalendarWeeks(entryDate, targetDate, {
        weekStartsOn: 1,
      });

      if (weeks === 0) {
        hasAssignmentToday = true;
        continue;
      }

      // Is it in the past? (negative value)
      if (weeks < 0 && weeks > minPast) {
        minPast = weeks;
      }

      // Is it in the future? (positive value
      if (weeks > 0 && weeks < minFuture) {
        minFuture = weeks;
      }
    }
  }

  return { minPast, minFuture, hasAssignmentToday };
};

/**
 * Calculates a new date by subtracting a specified number of weeks from a target date.
 *
 * This utility function takes a date string, validates it, and uses `date-fns` to return a `Date` object
 * shifted backward in time by the given weeks distance. If a negative distance is provided,
 * it will effectively add weeks to the target date instead.
 *
 * @param targetDateStr - The reference date as a valid date string (e.g., 'YYYY-MM-DD').
 * @param weeksDistance - The number of weeks to subtract from the target date.
 *
 * @returns A new `Date` object shifted by the specified weeks, or `null` if the input string is empty, missing, or invalid.
 */
export const getLastAssignmentDateByWeeksDistance = (
  targetDateStr: string,
  weeksDistance: number
): Date | null => {
  if (!targetDateStr) return null;

  const targetDate = new Date(targetDateStr);
  // Validation: Check if the date is valid
  if (isNaN(targetDate.getTime())) return null;

  return subWeeks(targetDate, weeksDistance);
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
 * Calculates a person's historical assignment density (load) within a dynamically determined time window.
 *
 * This function analyzes a person's assignment history relative to a target date to determine their recent workload.
 * The analysis window is intelligently constructed based on the closest past and future assignments:
 *
 * **Window Logic:**
 * - **Case 1 (Exact Balance):** If the closest past and future assignments are equidistant, the window spans exactly
 *   between these two assignments (e.g., last task 3 weeks ago, next task 3 weeks ahead → 7-week window).
 * - **Case 2 (Asymmetric):** Uses the shortest distance from either direction and mirrors it symmetrically
 *   around the target date (e.g., last task 2 weeks ago → 5-week window from -2 to +2).
 * - **Edge Cases:**
 *   - Only assignment in target week → 1-week window
 *   - No assignments found → returns `0`
 *
 * The load is calculated as `taskCount / windowSizeInWeeks`, where only relevant assignments (matching filters)
 * within the calculated boundaries are counted.
 *
 * @param personUid - The unique identifier of the person to evaluate.
 * @param history - The complete assignment history to analyze.
 * @param targetDateStr - The reference target date (ISO string) for window calculation.
 * @param dataView - (Optional) Filter to assignments in this specific data view (e.g., 'main').
 * @param codesToCheck - (Optional) Only count assignments matching these specific codes.
 *
 * @returns A decimal number representing assignment frequency within the calculated window
 *          (e.g., `0.4` = 2 tasks in 5 weeks, `1.0` = 1 task per week, `0` = no relevant history).
 */
export const getActualLoad = (
  personUid: string,
  history: AssignmentHistoryType[],
  targetDateStr: string,
  dataView?: DataViewKey,
  codesToCheck?: AssignmentCode[]
): number => {
  const distances = getDistanceInWeeks(
    history,
    personUid,
    targetDateStr,
    dataView,
    codesToCheck
  );

  const pastAbs = Math.abs(distances.minPast);
  const futureAbs = Math.abs(distances.minFuture);

  const targetDate = new Date(targetDateStr);
  let boundaryStart: Date;
  let boundaryEnd: Date;
  let windowSizeInWeeks: number;

  // CASE 1: Exact tie between past and future distance
  if (pastAbs !== Infinity && futureAbs !== Infinity && pastAbs === futureAbs) {
    // If the gap is equal, the time window is crystal clear.
    // No buffer estimation needed. The window spans exactly from the last to the next task.

    boundaryStart = addWeeks(targetDate, distances.minPast);
    boundaryEnd = addWeeks(targetDate, distances.minFuture);
    windowSizeInWeeks = futureAbs + pastAbs + 1;
  }
  // CASE 2: Default case
  else {
    let closestDistance = Infinity;

    if (pastAbs < futureAbs) {
      closestDistance = pastAbs;
    } else if (futureAbs < pastAbs) {
      closestDistance = futureAbs;
    }

    if (closestDistance === Infinity) {
      // Fallback: the person has no assignments, or only one today
      if (distances.hasAssignmentToday) {
        // Person has ONLY one task today and nothing else in the entire DB.
        boundaryStart = targetDate;
        boundaryEnd = targetDate;
        windowSizeInWeeks = 1;
      } else {
        return 0;
      }
    } else {
      // Default logic: mirror the shortest distance in both directions
      boundaryStart = addWeeks(targetDate, -closestDistance);
      boundaryEnd = addWeeks(targetDate, closestDistance);
      windowSizeInWeeks = closestDistance * 2 + 1;
    }
  }

  // --- Count the tasks within the calculated boundaries ---
  const validHistory = history.filter((entry) => {
    if (entry.assignment.person !== personUid) return false;
    if (
      codesToCheck &&
      codesToCheck.length > 0 &&
      !codesToCheck.includes(entry.assignment.code!)
    )
      return false;
    if (
      dataView &&
      dataView.length > 0 &&
      dataView !== entry.assignment.dataView
    )
      return false;

    // Boundary-Check
    const entryDate = new Date(entry.weekOf);
    // Note: We cut off exactly at the calculated week boundaries
    return entryDate >= boundaryStart && entryDate <= boundaryEnd;
  });

  const taskCount = validHistory.length;

  // Calculate load: How many tasks fell within this window?
  return taskCount / windowSizeInWeeks;
};

/**
 * Calculates a priority tier score indicating how under- or over-assigned a person is compared to expectations.
 *
 * This scoring function compares a person's theoretical expected assignment frequency (`expectedLoad`)
 * against their actual historical frequency (`actualLoad`), producing a tier score where:
 * - **High scores** = underutilized (due for assignment, higher priority)
 * - **Low scores** = overutilized (recently assigned enough, lower priority)
 *
 * **Scoring Logic:**
 * - `expectedLoad === 0` → returns `0` (person ineligible for this task type)
 * - `actualLoad === 0` → returns `999999` (highest priority - never done this task)
 * - Otherwise: `round((expectedLoad / actualLoad) * weightingFactor * 100 / 20)`
 *
 * The formula amplifies the `expected/actual` ratio and applies a congregation-specific weighting factor.
 *
 * @param expectedLoad - Theoretical assignment frequency based on eligibility/availability analysis.
 * @param actualLoad - Historical assignment density from `getActualLoad()` (tasks per week).
 * @param weightingFactor - Congregation-specific multiplier to normalize scores across groups.
 *
 * @returns An integer tier score where higher = higher priority for assignment.
 *          - `999999` = maximum priority (never assigned)
 *          - `0` = ineligible or sufficiently assigned
 */
export const calculateTierScore = (
  expectedLoad: number,
  actualLoad: number,
  weightingFactor: number
): number => {
  if (expectedLoad === 0) return 0;
  if (actualLoad === 0) return 999999;

  const ratio = expectedLoad / actualLoad;
  return Math.round((ratio * weightingFactor * 100) / 20);
};

/**
 * Determines if an assignment task is eligible for Room 1 swapping based on its assignment key and path.
 *
 * This utility function identifies tasks associated with Room 1 (marked by `_A` suffix) while excluding
 * Chairman tasks, which have special swapping restrictions. Room 1 swapping is typically used to
 * coordinate assignments between the main room and auxiliary classroom setups.
 *
 * **Eligibility Rules:**
 * - **Eligible**: Tasks ending with `_A` in `assignmentKey` or `path` (Room 1 indicator)
 * - **Ineligible**: Chairman tasks (`MM_Chairman`, `MMChairman`) regardless of room designation
 *
 * @param task - The assignment task to evaluate for Room 1 swap eligibility.
 *
 * @returns `true` if the task can participate in Room 1 swapping, `false` otherwise.
 */
const isRoom1SwapEligibleTask = (task: AssignmentTask): boolean => {
  const assignmentKey = task.assignmentKey ?? '';
  const path = task.path ?? '';

  const isRoom1Task = assignmentKey.endsWith('_A') || path.endsWith('_A');

  const isChairmanTask =
    assignmentKey.startsWith('MM_Chairman') ||
    assignmentKey.startsWith('MMChairman') ||
    path.includes('MM_Chairman') ||
    path.includes('MMChairman');

  return isRoom1Task && !isChairmanTask;
};

/**
 * Calculates how many weeks have passed since a person's last Room 2 assignment.
 *
 * This function determines a person's Room 2 assignment recency for swap prioritization.
 * It scans assignment history to find the most recent Room 2 (`classroom === '2'`) assignment
 * on or before the current week, returning weeks elapsed. Used for Room 2 swap eligibility.
 *
 * **Logic:**
 * - Filters history for person's Room 2 assignments matching optional `dataView`
 * - Calculates calendar weeks difference (`currentWeekOf` - `entry.weekOf`)
 * - Only considers past assignments or current week (`weeks >= 0`)
 * - Returns smallest (most recent) weeks count
 *
 * **Special Cases:**
 * - Never assigned to Room 2 → returns `9999` (maximum swap priority)
 * - No matching assignments → returns `9999`
 *
 * @param personUid - Person identifier to check Room 2 history for.
 * @param history - Complete assignment history to analyze.
 * @param currentWeekOf - Reference week (ISO date string) for weeks calculation.
 * @param dataView - (Optional) Filter to specific data view assignments.
 *
 * @returns Weeks since last Room 2 assignment, or `9999` if never assigned.
 *          Higher values = higher priority for Room 2 swapping.
 */
const getWeeksSinceLastRoom2 = (
  personUid: string,
  history: AssignmentHistoryType[],
  currentWeekOf: string,
  dataView?: string
): number => {
  const currentDate = new Date(currentWeekOf);
  let minWeeks = Infinity;

  for (const entry of history) {
    if (entry.assignment.person !== personUid) continue;
    if (dataView && entry.assignment.dataView !== dataView) continue;

    const isRoom2Entry = entry.assignment.classroom === '2';

    if (!isRoom2Entry) continue;

    const entryDate = new Date(entry.weekOf);
    const weeks = differenceInCalendarWeeks(currentDate, entryDate, {
      weekStartsOn: 1,
    });

    if (weeks < 0) continue;

    if (weeks < minWeeks) {
      minWeeks = weeks;
    }
  }

  return minWeeks === Infinity ? 9999 : minWeeks;
};

//MARK: MAIN SORT FUNCTION
/**
 * Sorts assignment candidates using multi-level fairness metrics across two distinct strategies.
 *
 * This core scheduling function ranks eligible persons for a specific task by calculating tier scores
 * that balance **global fairness**, **dataview fairness**, **meeting-type fairness** (Midweek MM vs Weekend WM),
 * and **task-specific fairness**. Two strategies ensure comprehensive distribution:
 *
 * **Default Strategy** (broad fairness, Round 1):
 * 1. Minimize current meeting load (`tasksInCurrentMeeting`)
 * 2. Maximize global tier → dataView tier → meeting-type tier → code tier
 * 3. Maximize assistant pairing time (MM_AssistantOnly only)
 *
 * **Alternative Strategy** (quota filling, Round 2):
 * 1. Maximize percentage gap (target% - actual% of task code within meeting type)
 * 2. Minimize current meeting load
 * 3. Maximize code tier → assistant pairing time
 *
 * **Room 1 Swap Post-Processing** (alternative + `_A` tasks):
 * Swaps top 2 candidates if #2 has longer wait since last Room 2 (`weeksSinceLastRoom2`).
 *
 * All tiers use `calculateTierScore(expected / actualLoad, weightingFactor)`.
 *
 * @param candidates - Eligible persons for this task.
 * @param task - Task being assigned (determines `dataView`, `code`, `schedule.weekOf`).
 * @param history - Assignment history for load calculations.
 * @param personsCompleteMetrics - Precomputed expected scores per dataView/person.
 * @param weightingMetrics - Person-specific weighting factors.
 * @param assignmentsMetricsTotal - Global task frequency stats.
 * @param sortStrategy - `'default'` (broad) or `'alternative'` (quota-focused).
 *
 * @returns Sorted candidates (index 0 = best).
 */
export const sortCandidatesMultiLevel = (
  candidates: PersonType[],
  task: AssignmentTask,
  history: AssignmentHistoryType[],
  personsCompleteMetrics: personsAssignmentMetrics,
  weightingMetrics: personsWeightingMetrics,
  assignmentsMetricsTotal: AssignmentStatisticsView,
  sortStrategy: 'default' | 'alternative' = 'default'
): PersonType[] => {
  const metaCache = new Map<
    string,
    {
      globalTier: number;
      dataViewTier: number;
      assignmentsKindTier: number;
      assignmentCodeTier: number;
      percentageGap: number;
      targetPercentage: number;
      actualPercentage: number;
      assistantTimeLastPairing: number;
      tasksInCurrentMeeting: number;
      weeksSinceLastRoom2: number;
    }
  >();

  const personsDataViewMetrics = personsCompleteMetrics.get(task.dataView);
  const room1SwapEligibleTask = isRoom1SwapEligibleTask(task);

  candidates.forEach((p) => {
    const personMetrics = personsDataViewMetrics?.get(p.person_uid);
    const personWeightingMetrics = weightingMetrics.get(p.person_uid);
    const weightingFactor = personWeightingMetrics?.weightingFactor || 1;

    // --- Global tier (overall fairness) ---
    const actualGlobalLoad = getActualLoad(
      p.person_uid,
      history,
      task.schedule.weekOf
    );

    const globalTier = calculateTierScore(
      personWeightingMetrics?.total_globalScore || 0,
      actualGlobalLoad,
      weightingFactor
    );

    // --- DataView tier (overall fairness within this specific group) ---
    const actualDataViewLoad = getActualLoad(
      p.person_uid,
      history,
      task.schedule.weekOf,
      task.dataView
    );

    const dataViewTier = calculateTierScore(
      personMetrics?.view_globalScore || 0,
      actualDataViewLoad,
      weightingFactor
    );

    // --- Meeting-kind tier (midweek vs weekend fairness) ---
    const assignmentsKind = MM_ASSIGNMENT_CODES.includes(task.code!)
      ? 'midweek'
      : 'weekend';

    const relevantMeetingTypeScore =
      assignmentsKind === 'midweek'
        ? personMetrics?.mm_globalScore || 0
        : personMetrics?.wm_globalScore || 0;

    const relevantMeetingTypeCodes =
      assignmentsKind === 'midweek' ? MM_ASSIGNMENT_CODES : WM_ASSIGNMENT_CODES;

    const actualAssignmentsKindTypeLoad = getActualLoad(
      p.person_uid,
      history,
      task.schedule.weekOf,
      task.dataView,
      relevantMeetingTypeCodes
    );

    const meetingTypeTier = calculateTierScore(
      relevantMeetingTypeScore,
      actualAssignmentsKindTypeLoad,
      weightingFactor
    );

    // --- Code tier (fairness for the specific assignment code - historic fallback) ---
    const actualCodeLoad = getActualLoad(
      p.person_uid,
      history,
      task.schedule.weekOf,
      task.dataView,
      [task.code!]
    );

    const codeTier = calculateTierScore(
      assignmentsMetricsTotal.get(task.code!)?.frequency || 0,
      actualCodeLoad,
      weightingFactor
    );

    // --- Percentage Gap Analysis for "alternative" round ---
    let percentageGap = 0;
    let targetPercentage = 0;
    let actualPercentage = 0;

    const expectedMetricsForCode = personMetrics?.assignmentsScores?.get(
      task.code!
    );

    if (expectedMetricsForCode) {
      targetPercentage = expectedMetricsForCode.percentageOfTotal;

      if (actualAssignmentsKindTypeLoad > 0) {
        actualPercentage = actualCodeLoad / actualAssignmentsKindTypeLoad;
      } else {
        actualPercentage = 0;
      }

      percentageGap = targetPercentage - actualPercentage;
    }

    // --- Assistant pairing bonus (maximize time since last pairing) ---
    let assistantTimeLastPairing = 0;
    if (task.code === AssignmentCode.MM_AssistantOnly) {
      const studentUid = getCorrespondingStudentOrAssistant(
        task.assignmentKey,
        task.schedule.weekOf,
        history,
        task.dataView
      );

      if (studentUid) {
        assistantTimeLastPairing = getWeeksSinceLastPairing(
          p.person_uid,
          studentUid,
          history,
          task.schedule.weekOf
        );
      }
    }

    // --- count how many assignments the person already has in the current meeting ---
    const tasksInCurrentMeeting = history.filter((entry) => {
      const isSameWeek = entry.weekOf === task.schedule.weekOf;
      const isSamePerson = entry.assignment.person === p.person_uid;
      const isSameDataView = entry.assignment.dataView === task.dataView;
      const isRelevantMeeting =
        assignmentsKind === 'midweek'
          ? MM_ASSIGNMENT_CODES.includes(entry.assignment.code!)
          : WM_ASSIGNMENT_CODES.includes(entry.assignment.code!);

      return isSameWeek && isSamePerson && isSameDataView && isRelevantMeeting;
    }).length;

    // --- NEW: Only for alternative "_A" tasks: how long since room 1? ---
    const weeksSinceLastRoom2 =
      sortStrategy === 'alternative' && room1SwapEligibleTask
        ? getWeeksSinceLastRoom2(
            p.person_uid,
            history,
            task.schedule.weekOf,
            task.dataView
          )
        : 0;

    metaCache.set(p.person_uid, {
      globalTier,
      dataViewTier,
      assignmentsKindTier: meetingTypeTier,
      assignmentCodeTier: codeTier,
      percentageGap,
      targetPercentage,
      actualPercentage,
      assistantTimeLastPairing,
      tasksInCurrentMeeting,
      weeksSinceLastRoom2,
    });
  });

  // --- Sorting ---
  const sortedResult = [...candidates].sort((a, b) => {
    const metaA = metaCache.get(a.person_uid);
    const metaB = metaCache.get(b.person_uid);

    if (!metaA || !metaB) return 0;

    // ----------------------------------------------------
    // ROUND 1: DEFAULT STRATEGY (Initial broad distribution)
    // ----------------------------------------------------
    if (sortStrategy === 'default') {
      if (metaA.tasksInCurrentMeeting !== metaB.tasksInCurrentMeeting) {
        return metaA.tasksInCurrentMeeting - metaB.tasksInCurrentMeeting;
      }

      if (metaA.globalTier !== metaB.globalTier) {
        return metaB.globalTier - metaA.globalTier;
      }
      if (metaA.dataViewTier !== metaB.dataViewTier) {
        return metaB.dataViewTier - metaA.dataViewTier;
      }
      if (metaA.assignmentsKindTier !== metaB.assignmentsKindTier) {
        return metaB.assignmentsKindTier - metaA.assignmentsKindTier;
      }
      if (metaA.assignmentCodeTier !== metaB.assignmentCodeTier) {
        return metaB.assignmentCodeTier - metaA.assignmentCodeTier;
      }
      if (metaA.assistantTimeLastPairing !== metaB.assistantTimeLastPairing) {
        return metaB.assistantTimeLastPairing - metaA.assistantTimeLastPairing;
      }
      return 0;
    }

    // ----------------------------------------------------
    // ROUND 2: ALTERNATIVE STRATEGY (Gap/Quota Filling)
    // ----------------------------------------------------
    if (sortStrategy === 'alternative') {
      if (Math.abs(metaA.percentageGap - metaB.percentageGap) > 0.01) {
        return metaB.percentageGap - metaA.percentageGap;
      }
      if (metaA.tasksInCurrentMeeting !== metaB.tasksInCurrentMeeting) {
        return metaA.tasksInCurrentMeeting - metaB.tasksInCurrentMeeting;
      }
      if (metaA.assignmentCodeTier !== metaB.assignmentCodeTier) {
        return metaB.assignmentCodeTier - metaA.assignmentCodeTier;
      }
      if (metaA.assistantTimeLastPairing !== metaB.assistantTimeLastPairing) {
        return metaB.assistantTimeLastPairing - metaA.assistantTimeLastPairing;
      }
      return 0;
    }

    return 0;
  });

  // ----------------------------------------------------
  // POST-PROCESSING FOR ALTERNATIVE "_A" TASKS
  // Swap positions 1 and 2 if position 2 has been out of
  // Room 2 longer than position 1.
  // ----------------------------------------------------
  if (
    sortStrategy === 'alternative' &&
    room1SwapEligibleTask &&
    sortedResult.length >= 2
  ) {
    const first = sortedResult[0];
    const second = sortedResult[1];

    const metaFirst = metaCache.get(first.person_uid);
    const metaSecond = metaCache.get(second.person_uid);

    if (
      metaFirst &&
      metaSecond &&
      metaSecond.weeksSinceLastRoom2 < metaFirst.weeksSinceLastRoom2
    ) {
      [sortedResult[0], sortedResult[1]] = [sortedResult[1], sortedResult[0]];
    }
  }

  return sortedResult;
};

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

  const codeStr = AssignmentCode[currentTaskCode];

  // Validation: Ensure the task code string exists and starts with the expected prefixes.
  // If the code is invalid or doesn't belong to Midweek (MM_) or Weekend (WM_), we cannot determine conflicts.
  if (!codeStr || (!codeStr.startsWith('MM_') && !codeStr.startsWith('WM_'))) {
    return false;
  }

  const targetPrefix = codeStr.slice(0, 3); // 'MM_' or 'WM_'

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
    const hasStudentPart = tasksInWeek.some((entry) =>
      STUDENT_TASK_CODES.includes(entry.assignment.code)
    );
    if (hasStudentPart) return true;
  }

  return false;
};
