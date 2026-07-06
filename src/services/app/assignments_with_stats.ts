//// services/app/assignments_with_stats.ts
import {
  STUDENT_ASSIGNMENT,
  WEEK_TYPE_ASSIGNMENT_CODES,
  VARIABLE_MM_KEYS,
} from '@constants/index';
import { SchedWeekType } from '@definition/schedules';
import { PersonType } from '@definition/person';
import {
  AssignmentCode,
  MM_ASSIGNMENT_CODES,
  WM_ASSIGNMENT_CODES,
} from '@definition/assignment';
import { SettingsType } from '@definition/settings';
import { SourceWeekType } from '@definition/sources';
import { Week } from '@definition/week_type';
import { FieldServiceGroupType } from '@definition/field_service_groups';
import { FixedAssignmentsByCode, getCodeAndElderOnly } from './autofill';
import { ASSIGNMENT_CONFLICTS } from '@constants/assignmentConflicts';

/**
 * Identifies all active data views (main + language groups) with scheduled meetings.
 *
 * This utility function determines which data views need assignment planning by checking:
 * - Always includes `'main'` view (primary congregation)
 * - Adds language group `group_id` **only if**:
 *   - Language groups feature is **enabled** in congregation settings
 *   - Group is **not deleted** (`_deleted === false`)
 *   - Group has **at least one meeting** scheduled (midweek_meeting OR weekend_meeting)
 *
 * Used to scope assignment processing to only relevant groups with actual meeting needs.
 *
 * @param settings - Congregation settings containing language_groups.enabled flag.
 * @param languageGroups - Array of all language service groups to evaluate.
 *
 * @returns Set of active DataViewKey strings (e.g., `Set(['main', 'group_ID1', 'group_ID2'])`).
 *          Empty groups or disabled feature → only `['main']`.
 */
export const getDataViewsWithMeetings = (
  settings: SettingsType,
  languageGroups: FieldServiceGroupType[]
): Set<string> => {
  const relevantViews = new Set<string>(['main']);

  if (!settings.cong_settings.language_groups?.enabled?.value) {
    return relevantViews;
  }
  languageGroups.forEach((g) => {
    const { _deleted, midweek_meeting, weekend_meeting } = g.group_data;

    if (_deleted) return;

    const hasMeetings = Boolean(midweek_meeting || weekend_meeting);

    if (hasMeetings) {
      relevantViews.add(g.group_id);
    }
  });

  return relevantViews;
};

/**
 * Gives back the language key for a specific view.
 *
 * This function extracts language configurations from the settings.
 *
 * Key Details:
 * - **Source:** Iterates over `settings.cong_settings.source_material.language`.
 *
 * @param settings - The global application settings containing language configurations.
 * @param view - The specific dataview
 * @returns language key, for example 'X' or 'E'
 */
export const getLanguageKey = (
  settings: SettingsType,
  view: string
): string => {
  const langEntry = settings.cong_settings.source_material?.language.find(
    (l) => l.type === view
  );

  return langEntry ? langEntry.value : '';
};

/**
 * Creates a lookup map of eligible persons for each assignment code, grouped by data view.
 *
 * Key Logic:
 * - **Filtering:** Skips persons who are deleted, archived, or disqualified.
 *
 * @param persons - The list of all persons to process.
 * @returns Map<DataViewKey, Map<AssignmentCode, Set<string>>>
 */
export const getEligiblePersonsPerDataViewAndCode = (
  persons: PersonType[]
): Map<string, Map<AssignmentCode, Set<string>>> => {
  const map = new Map<string, Map<AssignmentCode, Set<string>>>();

  persons.forEach((person) => {
    // 1. Filter: Person must exist and be active
    const isDeleted = person._deleted.value;
    const isArchived = person.person_data.archived.value;
    const isDisqualified = person.person_data.disqualified.value;

    if (isDeleted || isArchived || isDisqualified) {
      return;
    }

    const uid = person.person_uid;

    // 2. Iterate all assignments and add UIDs to the map
    person.person_data.assignments.forEach((assignment) => {
      const viewType = assignment.type;

      if (Array.isArray(assignment.values)) {
        assignment.values.forEach((code) => {
          let innerMap = map.get(viewType);
          if (!innerMap) {
            innerMap = new Map<AssignmentCode, Set<string>>();
            map.set(viewType, innerMap);
          }

          let codeSet = innerMap.get(code);
          if (!codeSet) {
            codeSet = new Set<string>();
            innerMap.set(code, codeSet);
          }
          codeSet.add(uid);
        });
      }
    });
  });

  return map;
};

/**
 * Determines the validity status of the Midweek and Weekend meetings for a specific data view.
 *
 * Checks whether the configured week type represents a valid state for processing (e.g., for statistics).
 * A week is considered valid if:
 * - It is explicitly marked as no meeting (`Week.NO_MEETING`). That helps to get the right statistics in case of language groups that don't have a meeting every week.
 * - It is a week type (e.g., CO Visit) that has allowed assignment codes defined in `WEEK_TYPE_ASSIGNMENT_CODES`.
 *
 * @param weekSchedule - The schedule object for the week containing meeting types.
 * @param view - The specific data view (e.g., 'main' or language group) to check.
 * @returns An object containing boolean flags (`mmIsValid`, `wmIsValid`) indicating if the meetings are valid.
 */
const getWeekStatsInclusion = (
  weekSchedule: SchedWeekType,
  view: string
): { mmIsValid: boolean; wmIsValid: boolean } => {
  // 1. Get Midweek Type
  const mmWeekTypeObj = weekSchedule.midweek_meeting.week_type.find(
    (s) => s.type === view
  );
  const mmWeekType = mmWeekTypeObj ? mmWeekTypeObj.value : Week.NORMAL;

  const mmCodes = WEEK_TYPE_ASSIGNMENT_CODES.get(mmWeekType);

  //counting of NO_Meeting is on purpose, because it helps to get the right statistics in case of language groups that don't have a meeting every week
  const mmIsValid =
    mmWeekType === Week.NO_MEETING || (mmCodes ? mmCodes.size > 0 : false);

  // 2. Get Weekend Type
  const wmWeekTypeObj = weekSchedule.weekend_meeting.week_type.find(
    (s) => s.type === view
  );
  const wmWeekType = wmWeekTypeObj ? wmWeekTypeObj.value : Week.NORMAL;

  const wmCodes = WEEK_TYPE_ASSIGNMENT_CODES.get(wmWeekType);
  const wmIsValid =
    wmWeekType === Week.NO_MEETING || (wmCodes ? wmCodes.size > 0 : false);

  return { mmIsValid, wmIsValid };
};

/**
 * Counts all variable midweek assignment occurrences from the source weeks
 * by reusing the same source-to-task resolution logic as the autofill pipeline.
 *
 * This function iterates over all variable midweek assignment keys
 * (`VARIABLE_MM_KEYS`) for each source week and resolves the effective
 * `AssignmentCode` via `getCodeAndElderOnly()`.
 *
 * Key logic:
 * - Respects the configured class count for the current data view and skips
 *   auxiliary (`_B`) school slots when only one class is active.
 * - Counts only assignments that actually resolve to a valid task code.
 * - Keeps AYF counting aligned with autofill behavior, including suppressed
 *   discussion `_B` slots and assistant eligibility rules.
 * - Keeps LC counting aligned with autofill behavior because LC keys are
 *   resolved through `getCodeAndElderOnly()`, which delegates LC parts to
 *   `getCodeAndElderOnlyLCPart()` and therefore honors view overrides,
 *   video/no-assignment filtering, and elder-only detection.
 *
 * @param sources - Source weeks to analyze for variable midweek assignments.
 * @param settings - Congregation settings used to determine class count for the view.
 * @param langKey - Language key used to resolve localized source data.
 * @param view - Data view whose class count and localized overrides should be applied.
 * @param sourceLocale - Locale of the source material used by source parsing heuristics.
 * @returns A map where each key is an `AssignmentCode` and each value is the
 * number of generated variable assignment occurrences across the provided weeks.
 */
const getVariableAssignmentsCount = (
  sources: SourceWeekType[],
  settings: SettingsType,
  langKey: string,
  view: string,
  sourceLocale: string
): Map<AssignmentCode, number> => {
  const classCount =
    settings.cong_settings.midweek_meeting?.find((s) => s.type === view)
      ?.class_count.value || 1;

  const variableAssignmentCounts = new Map<AssignmentCode, number>();

  for (const weekSource of sources) {
    for (const key of VARIABLE_MM_KEYS) {
      if (key.endsWith('_B') && classCount !== 2) continue;

      const resolved = getCodeAndElderOnly(
        key,
        weekSource,
        view,
        langKey,
        sourceLocale
      );

      if (!resolved) continue;

      variableAssignmentCounts.set(
        resolved.code,
        (variableAssignmentCounts.get(resolved.code) || 0) + 1
      );
    }
  }

  return variableAssignmentCounts;
};

/**
 * Calculates the accumulated "correction counts" for assignments displaced by special events across multiple weeks.
 *
 * In special weeks (e.g., CO Visit, Assemblies), standard assignments might not take place.
 * This function iterates through the provided list of schedules and aggregates how often
 * specific standard assignments were skipped due to the week type.
 *
 * Logic:
 * 1. Iterates through all provided weeks in `schedules`.
 * 2. Checks if the Midweek or Weekend meeting is a special week type (not `Week.NORMAL`).
 * 3. If special, compares standard codes against allowed codes for that type.
 * 4. Accumulates the count of missing standard codes in the return map.
 *
 * @param schedules - Array of schedule objects to analyze.
 * @param view - The data view (e.g., 'main') to check.
 * @returns A Map where the key is the `AssignmentCode` and the value is the total count to be subtracted from statistics.
 */
const getCorrectionCounts = (
  schedules: SchedWeekType[],
  view: string
): Map<number, number> => {
  const correctionCount = new Map<number, number>();

  const EMPTY_SET = new Set<number>();

  for (const weekSchedule of schedules) {
    const mmWeekTypeObj = weekSchedule.midweek_meeting.week_type.find(
      (s) => s.type === view
    );
    const mmWeekType = mmWeekTypeObj ? mmWeekTypeObj.value : Week.NORMAL;

    const wmWeekTypeObj = weekSchedule.weekend_meeting.week_type.find(
      (s) => s.type === view
    );
    const wmWeekType = wmWeekTypeObj ? wmWeekTypeObj.value : Week.NORMAL;

    if (mmWeekType === Week.NORMAL && wmWeekType === Week.NORMAL) continue;

    if (mmWeekType !== Week.NORMAL) {
      const availableCodes =
        WEEK_TYPE_ASSIGNMENT_CODES.get(mmWeekType) || EMPTY_SET;

      MM_ASSIGNMENT_CODES.forEach((c) => {
        if (!availableCodes.has(c)) {
          correctionCount.set(c, (correctionCount.get(c) || 0) + 1);
        }
      });
    }

    if (wmWeekType !== Week.NORMAL) {
      const availableCodes =
        WEEK_TYPE_ASSIGNMENT_CODES.get(wmWeekType) || EMPTY_SET;

      WM_ASSIGNMENT_CODES.forEach((c) => {
        if (!availableCodes.has(c)) {
          correctionCount.set(c, (correctionCount.get(c) || 0) + 1);
        }
      });
    }
  }

  return correctionCount;
};

/**
 * Calculates the default *theoretical* weekly frequency for each assignment code based on congregation settings.
 *
 * This function determines the baseline frequency (how often per week) each assignment code would occur
 * based on the stored configuration.
 *
 * **Note:** This function does NOT check if the meeting is globally disabled/deleted.
 * It assumes the meeting is active if settings exist. The caller is responsible for checking the active status.
 *
 * Logic factors:
 * - **Prayer Assignments:** Adjusts frequency based on linked prayer settings (e.g. opening/closing prayers linked to other assignments).
 * - **Class Count:** Doubles frequency for Bible Reading and student assignments when two classes are configured.
 * - **Excluded Codes:** Skips certain codes (e.g., Ministry Hours Credit) that are irrelevant.
 *
 * @param settings - The global application settings containing meeting configurations.
 * @param view - The specific data view (e.g., 'main') to calculate frequencies for.
 * @returns A Map linking each `AssignmentCode` to its configured weekly frequency (typically 1 or 2).
 */
const EXCLUDED_DEFAULT_CODES = new Set([
  AssignmentCode.MINISTRY_HOURS_CREDIT,
  AssignmentCode.WM_SpeakerSymposium,
]);

const TWO_CLASS_DOUBLED_CODES = new Set<AssignmentCode>([
  AssignmentCode.MM_BibleReading,
  ...STUDENT_ASSIGNMENT,
  AssignmentCode.MM_AssistantOnly,
]);

/**
 * Computes the base weekly frequency for a single assignment code, before
 * applying the two-class doubling rule.
 *
 * @param code - The assignment code to calculate the frequency for.
 * @param classCount - The number of active classes in the current view.
 * @param mmOpenPrayerLinked - Boolean indicating if the Midweek opening prayer is linked to another assignment.
 * @param mmClosePrayerLinked - Boolean indicating if the Midweek closing prayer is linked to another assignment.
 * @param wmOpenPrayerAuto - Boolean indicating if the Weekend opening prayer is auto-assigned.
 * @returns The base integer frequency for the provided code.
 */
const getBaseFrequency = (
  code: AssignmentCode,
  classCount: number,
  mmOpenPrayerLinked: boolean,
  mmClosePrayerLinked: boolean,
  wmOpenPrayerAuto: boolean
): number => {
  switch (code) {
    case AssignmentCode.MM_Prayer: {
      let count = 2;
      if (mmOpenPrayerLinked) count--;
      if (mmClosePrayerLinked) count--;
      return count;
    }
    case AssignmentCode.WM_Prayer:
      return wmOpenPrayerAuto ? 1 : 2;
    case AssignmentCode.MM_AuxiliaryCounselor:
      return classCount === 2 ? 1 : 0;
    default:
      return 1;
  }
};

/**
 * Assembles the theoretical default weekly frequencies for all assignment codes within a specific data view.
 *
 * This function evaluates the congregation settings for the provided data view and computes how often
 * each task code is expected to occur in a standard week. It delegates prayer and auxiliary class rules
 * to `getBaseFrequency` and applies the doubling rule for two-class setups where appropriate.
 *
 * @param settings - The global congregation settings.
 * @param view - The specific data view identifier (e.g., 'main' or a language group ID).
 * @returns A Map linking each valid `AssignmentCode` to its default weekly frequency.
 */
const getDefaultAssignmentsFrequency = (
  settings: SettingsType,
  view: string
): Map<AssignmentCode, number> => {
  const allCodes = [...MM_ASSIGNMENT_CODES, ...WM_ASSIGNMENT_CODES];
  const statsForView = new Map<AssignmentCode, number>();
  const cong_settings = settings.cong_settings;

  const mm_Settings = cong_settings.midweek_meeting?.find(
    (s) => s.type === view
  );
  const wm_Settings = cong_settings.weekend_meeting?.find(
    (s) => s.type === view
  );

  const classCount = mm_Settings?.class_count.value || 1;
  const mmOpenPrayerLinked =
    !!mm_Settings?.opening_prayer_linked_assignment.value;
  const mmClosePrayerLinked =
    !!mm_Settings?.closing_prayer_linked_assignment.value;
  const wmOpenPrayerAuto = !!wm_Settings?.opening_prayer_auto_assigned.value;
  const hasTwoClasses = classCount === 2;

  allCodes.forEach((code) => {
    if (EXCLUDED_DEFAULT_CODES.has(code)) return;

    const hasSettings =
      (MM_ASSIGNMENT_CODES.includes(code) && mm_Settings) ||
      (WM_ASSIGNMENT_CODES.includes(code) && wm_Settings);

    let frequency = 0;

    if (hasSettings) {
      frequency = getBaseFrequency(
        code,
        classCount,
        mmOpenPrayerLinked,
        mmClosePrayerLinked,
        wmOpenPrayerAuto
      );

      if (hasTwoClasses && TWO_CLASS_DOUBLED_CODES.has(code)) {
        frequency *= 2;
      }
    }

    statsForView.set(code, frequency);
  });

  return statsForView;
};

/**
 * Counts the number of valid weeks for Midweek and Weekend meetings in the given schedules.
 *
 * This function iterates through all schedules and determines how many weeks are considered valid
 * for statistics calculation. A week is valid if it meets the criteria defined in `getWeekStatsInclusion`:
 * - It is marked as `Week.NO_MEETING` (helps with language groups that don't meet every week).
 * - It is a week type (e.g., CO Visit) that has allowed assignment codes defined.
 *
 * @param schedules - Array of schedule objects for the weeks to analyze.
 * @param view - The specific data view (e.g., 'main' or language group) to count weeks for.
 * @returns An object containing:
 * - `mmValidWeeksCount`: The number of valid Midweek Meeting weeks.
 * - `wmValidWeeksCount`: The number of valid Weekend Meeting weeks.
 */
const getWeeksCount = (
  schedules: SchedWeekType[],
  view: string
): { mmValidWeeksCount: number; wmValidWeeksCount: number } => {
  // Initialize counter
  let mmValidWeeksCount: number = 0;
  let wmValidWeeksCount: number = 0;

  //Analyze (AYF & LC)
  schedules.forEach((weekSchedule) => {
    //counting weeks
    const { mmIsValid, wmIsValid } = getWeekStatsInclusion(weekSchedule, view);
    if (mmIsValid) mmValidWeeksCount++;
    if (wmIsValid) wmValidWeeksCount++;
  });
  return { mmValidWeeksCount, wmValidWeeksCount };
};

/**
 * Metrics representing the frequency and eligible pool for a specific assignment code.
 */
export type AssignmentMetrics = {
  frequency: number;
  eligibleUIDS: Set<string>;
};

/**
 * A mapping of assignment codes to their computed metrics for a single data view.
 */
export type AssignmentStatisticsView = Map<AssignmentCode, AssignmentMetrics>;

/**
 * A complete mapping of data views to their respective assignment statistics.
 * Includes a special 'total' key for congregation-wide aggregates.
 */
export type AssignmentStatisticsComplete = Map<
  string,
  AssignmentStatisticsView
>;

/**
 * Computes comprehensive assignment statistics across all active data views (main + language groups).
 *
 * This core statistics function calculates **expected frequencies** for every assignment code per data view,
 * accounting for meeting activation status, variable part counts from source weeks, and correction adjustments.
 * Produces both **per-view stats** and **aggregated totals** for benchmark calculations.
 *
 * **Frequency Calculation Logic** (per code/view):
 * ```
 * 1. Base: static frequency from settings
 * 2. Variable: observed count / relevant weeks (MM/WM) OR base frequency
 * 3. Correction: (corrections × variable freq) / weeks
 * 4. Final: max(0, variable - correction)
 * ```
 *
 * **Filtering Rules:**
 * - Only processes views with active meetings (`getDataViewsWithMeetings`)
 * - Skips MM codes if midweek disabled, WM if weekend disabled
 * - Includes eligibility lists per code/view
 *
 * **Output Structure:**
 * ```
 * Map<DataViewKey, Map<AssignmentCode, {frequency: number, eligibleUIDS: Set<string>}>>
 * + 'total' entry with cross-view aggregates
 * ```
 *
 * @param persons - All persons for eligibility analysis.
 * @param sourceWeeks - Source weeks containing variable assignment counts.
 * @param schedules - Existing schedules for corrections/weeks count.
 * @param settings - Congregation settings (frequencies, language groups).
 * @param languageGroups - Language groups to check meeting status.
 * @param sourceLocale - Locale for source week processing.
 *
 * @returns Complete statistics map with per-view and total aggregations.
 */
export const getAssignmentsWithStats = (
  persons: PersonType[],
  sourceWeeks: SourceWeekType[],
  schedules: SchedWeekType[],
  settings: SettingsType,
  languageGroups: FieldServiceGroupType[],
  sourceLocale: string
): AssignmentStatisticsComplete => {
  const stats: AssignmentStatisticsComplete = new Map();
  const relevantViews = getDataViewsWithMeetings(settings, languageGroups);

  const eligiblePersonsAll = getEligiblePersonsPerDataViewAndCode(persons);

  relevantViews.forEach((view) => {
    const statsForView: AssignmentStatisticsView = new Map();
    const langKey = getLanguageKey(settings, view);
    const frequencyForView = getDefaultAssignmentsFrequency(settings, view);
    const variableAssignmentCounts = getVariableAssignmentsCount(
      sourceWeeks,
      settings,
      langKey,
      view,
      sourceLocale
    );
    const corrections = getCorrectionCounts(schedules, view);
    const weeksCounts = getWeeksCount(schedules, view);

    const relevantGroup = languageGroups.find(
      (record) => record.group_id === view
    );

    const isMidweekActive = relevantGroup?.group_data.midweek_meeting ?? true;
    const isWeekendActive = relevantGroup?.group_data.weekend_meeting ?? true;

    frequencyForView.forEach((frequency, code) => {
      const mmCode = MM_ASSIGNMENT_CODES.includes(code); //
      const eligiblePersonsView = eligiblePersonsAll.get(view);

      if ((mmCode && !isMidweekActive) || (!mmCode && !isWeekendActive)) {
        statsForView.set(code, {
          frequency: 0,
          eligibleUIDS: eligiblePersonsView?.get(code) || new Set(),
        });
        return;
      }

      const relevantWeeksCount = mmCode
        ? weeksCounts.mmValidWeeksCount
        : weeksCounts.wmValidWeeksCount;

      const variableCount = variableAssignmentCounts.get(code);
      // undefined means the code is NOT a variable part (e.g., Chairman, Prayer) → use static frequency
      // A numeric value (always > 0) means the code IS variable → use observed frequency

      let variableFrequency: number;
      if (relevantWeeksCount > 0) {
        variableFrequency = variableCount
          ? variableCount / relevantWeeksCount
          : frequency;
      } else {
        variableFrequency = 0;
      }

      const correctionCount = corrections.get(code);

      const correctionFrequency =
        correctionCount && relevantWeeksCount > 0
          ? //there may be 2 assignments of a code in one meeting that have to be corrected, therefore the correction count is multiplied by the variable frequency
            (correctionCount * variableFrequency) / relevantWeeksCount
          : 0;

      const resultFrequency = Math.max(
        0,
        variableFrequency - correctionFrequency
      );

      statsForView.set(code, {
        frequency: resultFrequency,
        eligibleUIDS: eligiblePersonsView?.get(code) ?? new Set(),
      });
    });
    stats.set(view, statsForView);
  });

  const totalStatsForView: AssignmentStatisticsView = new Map();

  stats.forEach((viewStatsMap) => {
    viewStatsMap.forEach((metrics, code) => {
      const existingTotalMetrics = totalStatsForView.get(code);

      if (existingTotalMetrics) {
        existingTotalMetrics.frequency += metrics.frequency;

        metrics.eligibleUIDS.forEach((uid) => {
          existingTotalMetrics.eligibleUIDS.add(uid);
        });
      } else {
        totalStatsForView.set(code, {
          frequency: metrics.frequency,
          eligibleUIDS: new Set(metrics.eligibleUIDS),
        });
      }
    });
  });

  // add total stats as additional entry to the map, so we can easily access it when calculating the benchmark and opportunity score
  stats.set('total', totalStatsForView);
  // ------------------------------------------------

  return stats;
};

/**
 * Calculates the benchmark score representing the average assignment workload per person.
 *
 * The benchmark is derived by summing the weekly frequencies of **all assignment codes
 * from the pre-aggregated `'total'` view** and dividing by the total number of persons
 * in the congregation.
 *
 * This gives a congregation-wide baseline: "How much assignment volume is theoretically
 * available per person per week?" – regardless of individual eligibility.
 *
 * The benchmark is used as the reference point in `calculateWeightingFactor()` to determine
 * whether a person is above or below average in terms of their personal opportunity score.
 *
 * @param assignmentsMetrics - Complete statistics containing frequencies for all assignment
 *   codes across all data views. Only the synthetic `'total'` view is read, which already
 *   aggregates all individual views without double-counting.
 * @param personsCount - The total number of persons in the congregation (including those
 *   with no assignments), used as the divisor for the average.
 * @returns The benchmark score (total assignment frequency / persons count).
 *   Returns `0` if `personsCount` is 0 or no `'total'` view exists.
 */
const calculateBenchmarkScore = (
  assignmentsMetrics: AssignmentStatisticsComplete,
  personsCount: number
): number => {
  if (personsCount === 0) return 0;

  const totalView = assignmentsMetrics.get('total');
  if (!totalView) return 0;

  let totalFrequencySum = 0;
  totalView.forEach((metrics) => {
    totalFrequencySum += metrics.frequency;
  });

  return totalFrequencySum / personsCount;
};

/**
 * Calculates a weighting factor that reflects how a person's assignment load compares
 * to the congregation-wide benchmark.
 *
 * The factor is derived from the ratio `benchmarkScore / personScore` and follows a
 * two-part continuous curve that is always 1.0 at the average (ratio = 1):
 *
 * - **Below average load** (ratio < 1, person has more to do than average):
 *   Linear descent: `0.5 + 0.5 * ratio`
 *   → Asymptote at **0.5** (person is extremely overloaded)
 *   → Actively deprioritizes heavily loaded persons.
 *
 * - **Above average load** (ratio > 1, person has less to do than average):
 *   Hyperbolic ascent: `-0.5 / ratio + 1.5`
 *   → Asymptote at **1.5** (person has almost no assignments)
 *   → Gradually boosts underutilized persons without extreme prioritization.
 *
 * Both branches meet continuously at `ratio = 1 → weightingFactor = 1.0`.
 *
 * Example values:
 * | ratio | weightingFactor | Meaning                          |
 * |-------|-----------------|----------------------------------|
 * | 0.25  | 0.625           | Person has 4× more load than avg |
 * | 0.5   | 0.75            | Person has 2× more load than avg |
 * | 1.0   | 1.0             | Person is exactly at average     |
 * | 2.0   | 1.25            | Person has 2× less load than avg |
 * | 4.0   | 1.375           | Person has 4× less load than avg |
 * | ∞     | → 1.5           | Person has virtually no load     |
 *
 * @param benchmarkScore - The congregation-wide average workload per person,
 *   calculated by `calculateBenchmarkScore()`.
 * @param personScore - The individual opportunity score (`total_globalScore`) of the person,
 *   calculated by `calculateOpportunityScore()`.
 * @returns A weighting factor in the range (0.5, 1.5). Returns `1` if either score is 0
 *   to avoid division by zero and maintain neutral behavior for unscored persons.
 */
export const calculateWeightingFactor = (
  benchmarkScore: number,
  personScore: number
): number => {
  if (benchmarkScore === 0 || personScore === 0) return 1;

  const ratio = benchmarkScore / personScore;

  // Bidirectional hyperbolic curve, continuous at ratio=1 → weightingFactor=1.0
  // ratio < 1 → linear descent to 0.5 → person is heavily loaded
  // ratio > 1 → asymptotic ascent to 1.5 → person is underutilized
  return ratio <= 1 ? 0.5 + 0.5 * ratio : -0.5 / ratio + 1.5;
};

/**
 * Represents the computed score and percentage value of a single assignment task.
 */
export type TaskScoreMetrics = {
  score: number;
  percentageOfTotal: number;
};

/**
 * Aggregated opportunity scores and metrics for a person within a specific data view.
 */
export type personsAssignmentMetricsItem = {
  assignmentsScores: Map<AssignmentCode, TaskScoreMetrics>;
  mm_globalScore: number;
  wm_globalScore: number;
  view_globalScore: number;
};

/**
 * A nested mapping caching the opportunity metrics for all persons across all data views.
 * Map<DataViewKey, Map<personUID, personsAssignmentMetricsItem>>
 */
export type personsAssignmentMetrics = Map<
  string,
  Map<string, personsAssignmentMetricsItem>
>;

/**
 * Contains the overall global score and the computed weighting factor for a specific person.
 */
export type personWeightMetricsItem = {
  total_globalScore: number;
  weightingFactor: number;
};

/**
 * A mapping of person UIDs to their overall weighting metrics for fair assignment distribution.
 */
export type personsWeightingMetrics = Map<string, personWeightMetricsItem>;

/**
 * Constant representing a zeroed-out baseline result for persons with no assignments in the target view.
 */
const EMPTY_SCORE_RESULT = {
  mm_globalScore: 0,
  wm_globalScore: 0,
  view_globalScore: 0,
  assignmentsScores: new Map<AssignmentCode, TaskScoreMetrics>(),
} as const;

/**
 * Builds the set of assignment codes blocked for a person due to fixed assignments.
 * A code is blocked when the person holds a fixed assignment whose conflict matrix
 * lists that code.
 *
 * @param person - The person being evaluated.
 * @param viewFixedAssignments - A mapping of predefined fixed assignments for the current view.
 * @param targetDataView - The data view currently being processed.
 * @returns A Set of assignment codes that the person cannot be assigned to due to conflicts.
 */
const getBlockedCodes = (
  person: PersonType,
  viewFixedAssignments: FixedAssignmentsByCode | undefined,
  targetDataView: string
): Set<number> => {
  const blockedCodes = new Set<number>();
  const viewFixedAssignmentsMap = viewFixedAssignments?.get(targetDataView);
  if (!viewFixedAssignmentsMap) return blockedCodes;

  for (const [
    fixedCode,
    fixedPersonUIDs,
  ] of viewFixedAssignmentsMap.entries()) {
    if (!fixedPersonUIDs.has(person.person_uid)) continue;
    const conflicts = ASSIGNMENT_CONFLICTS[Number(fixedCode)];
    conflicts?.forEach((c) => blockedCodes.add(c));
  }
  // NOSONAR suppresses S3516 (Functions should not return the same value)
  // False Positive: The analyzer doesn't detect that the Set is mutated in the loop above.
  return blockedCodes; // NOSONAR
};

/**
 * Applies the main-view cross-view correction.
 * Subtracts the frequency of a code from every other language group the person also participates in,
 * so the main view opportunity is not double-counted.
 *
 * @param person - The person being evaluated.
 * @param assignmentsMetrics - The complete statistics mapping across all data views.
 * @param code - The specific assignment code being evaluated.
 * @param baseFreq - The initial, uncorrected frequency for the code in the main view.
 * @returns The corrected numeric frequency.
 */
const applyMainViewFrequencyCorrection = (
  person: PersonType,
  assignmentsMetrics: AssignmentStatisticsComplete,
  code: AssignmentCode,
  baseFreq: number
): number => {
  let freq = baseFreq;

  assignmentsMetrics.forEach((_viewMetrics, viewKey) => {
    if (viewKey === 'main' || viewKey === 'total') return;
    const personsViewAssignments = person.person_data.assignments.filter(
      (assignment) => assignment.type === viewKey
    );
    if (personsViewAssignments.length === 0) return;
    if (!personsViewAssignments[0].values.includes(code)) return;
    const viewStatsMapRunning = assignmentsMetrics.get(viewKey);
    const codeStats = viewStatsMapRunning?.get(code);
    if (!codeStats) return;
    freq = freq - codeStats.frequency;
  });

  return freq;
};

/**
 * Computes the task value for a single code, honoring fixed-assignment rules.
 * The fixed person receives the full frequency, everyone else receives 0.
 * When no fixed assignment exists, the value is shared across the eligible pool.
 *
 * @param freq - The frequency of the task.
 * @param eligCount - The total number of eligible persons for the task.
 * @param fixedPersonUIDsForCode - An optional Set of person UIDs who hold fixed assignments for this code.
 * @param personUID - The unique identifier of the person currently being evaluated.
 * @returns The computed numeric task value representing the person's opportunity share.
 */
const computeTaskValue = (
  freq: number,
  eligCount: number,
  fixedPersonUIDsForCode: Set<string> | undefined,
  personUID: string
): number => {
  if (fixedPersonUIDsForCode && fixedPersonUIDsForCode.size > 0) {
    return fixedPersonUIDsForCode.has(personUID) ? freq : 0;
  }
  return freq / eligCount;
};

/**
 * Calculates a person's theoretical assignment opportunity score within a specific data view.
 *
 * This function determines how many assignments a person **should** receive based on:
 * - Tasks they **can** do (`person.person_data.assignments[targetDataView]`)
 * - Task **frequency** and **eligibility pool size** from statistics
 * - **Fixed assignment** blocking rules
 * - **Cross-view corrections** for main view persons
 *
 * **Core Formula** (per eligible code): `taskValue = frequency / eligibleCount`
 * - Fixed persons: `full frequency` if assigned, `0` otherwise
 * - Aggregates to `mm_globalScore`, `wm_globalScore`, `view_globalScore`
 * - Returns percentages: `score / view_globalScore`
 *
 * **Special Logic:**
 * - **Blocked codes**: Skip if person has conflicting fixed assignments
 * - **Auto-adds** `MM_AssistantOnly` for persons with student tasks (no assistant configured)
 * - **Main view correction**: Subtracts frequency from other language groups in case of persons who are in language groups
 *
 * **Output Structure:**
 * ```typescript
 * {
 *   mm_globalScore: number,      // Total expected Midweek assignments
 *   wm_globalScore: number,      // Total expected Weekend assignments
 *   view_globalScore: number,    // mm + wm total
 *   assignmentsScores: Map<AssignmentCode, {score: number, percentageOfTotal: number}>
 * }
 * ```
 *
 * @param person - Person whose opportunity score to calculate.
 * @param targetDataView - Specific group/view (e.g., `'main'`, `'lg_de'`).
 * @param assignmentsMetrics - Complete statistics from `getAssignmentsWithStats()`.
 * @param fixedAssignmentsByCode - (Optional) Fixed assignments blocking conflicts.
 *
 * @returns Person's expected assignment opportunities with percentage breakdown.
 *          All zeros if person has no tasks in target data view.
 */
export const calculateOpportunityScore = (
  person: PersonType,
  targetDataView: string,
  assignmentsMetrics: AssignmentStatisticsComplete,
  fixedAssignmentsByCode?: FixedAssignmentsByCode
): {
  mm_globalScore: number;
  wm_globalScore: number;
  view_globalScore: number;
  assignmentsScores: Map<AssignmentCode, TaskScoreMetrics>;
} => {
  const assignmentsView = person.person_data.assignments.find(
    (a) => a.type === targetDataView
  );

  if (!assignmentsView) return { ...EMPTY_SCORE_RESULT };

  const viewStatsMap = assignmentsMetrics.get(targetDataView);
  if (!viewStatsMap) return { ...EMPTY_SCORE_RESULT };

  const blockedCodes = getBlockedCodes(
    person,
    fixedAssignmentsByCode,
    targetDataView
  );
  const viewFixedAssignments = fixedAssignmentsByCode?.get(targetDataView);

  let mm_globalScore = 0;
  let wm_globalScore = 0;
  const codeScores = new Map<AssignmentCode, number>();

  for (const code of assignmentsView.values) {
    if (blockedCodes.has(code)) continue;

    const metrics = viewStatsMap.get(code);
    const baseFreq = metrics?.frequency || 0;
    const eligCount = metrics?.eligibleUIDS.size || 0;

    const freq =
      targetDataView === 'main'
        ? applyMainViewFrequencyCorrection(
            person,
            assignmentsMetrics,
            code,
            baseFreq
          )
        : baseFreq;

    if (freq <= 0 || eligCount === 0) continue;

    const taskValue = computeTaskValue(
      freq,
      eligCount,
      viewFixedAssignments?.get(code),
      person.person_uid
    );

    if (taskValue === 0) continue;

    codeScores.set(code, (codeScores.get(code) || 0) + taskValue);

    if (MM_ASSIGNMENT_CODES.includes(code)) {
      mm_globalScore += taskValue;
    } else if (WM_ASSIGNMENT_CODES.includes(code)) {
      wm_globalScore += taskValue;
    }
  }

  const view_globalScore = mm_globalScore + wm_globalScore;

  const assignmentsScores = new Map<AssignmentCode, TaskScoreMetrics>();
  if (view_globalScore > 0) {
    codeScores.forEach((score, code) => {
      assignmentsScores.set(code, {
        score,
        percentageOfTotal: score / view_globalScore,
      });
    });
  }

  return {
    mm_globalScore,
    wm_globalScore,
    view_globalScore,
    assignmentsScores,
  };
};

/**
 * Computes person-specific weighting factors for fair assignment distribution.
 *
 * This function creates a weighting map for **all persons** by:
 * 1. Calculating **congregation benchmark** (`calculateBenchmarkScore`)
 * 2. **Summing** each person's `view_globalScore` **across all data views**
 *    (main + language groups where they have assignments)
 * 3. Applying `calculateWeightingFactor(benchmark, total_globalScore)`
 *
 * **Purpose:** Adjusts prioritization so underutilized persons get boosted
 * (factor > 1), overloaded persons get deprioritized (factor < 1).
 *
 * **Key Insight:** `total_globalScore` aggregates **multi-group participation** -
 * a person active in main +  language groups gets their opportunity score summed,
 * compared against single-group benchmark for global fairness.
 *
 * **Output:** `Map<personUID, {total_globalScore: number, weightingFactor: number}>`
 *
 * @param persons - All persons in the congregation.
 * @param personsMetrics - Per-dataView metrics from `calculateOpportunityScore()`.
 * @param assignmentsMetrics - Statistics for benchmark calculation.
 *
 * @returns Weighting metrics map used in `sortCandidatesMultiLevel()` tier scores.
 */
export const getPersonsWeightingMetrics = (
  persons: PersonType[],
  personsMetrics: personsAssignmentMetrics,
  assignmentsMetrics: AssignmentStatisticsComplete
): personsWeightingMetrics => {
  // Use only active persons (not deleted, archived, or disqualified) as the
  // benchmark denominator, matching the eligibility criteria applied later in
  // the weighting flow (see `getEligiblePersonsPerDataViewAndCode`).
  const activePersonsCount = persons.filter(
    (person) =>
      !person._deleted.value &&
      !person.person_data.archived.value &&
      !person.person_data.disqualified.value
  ).length;

  const benchmarkScore = calculateBenchmarkScore(
    assignmentsMetrics,
    activePersonsCount
  );

  const weightingMetrics: personsWeightingMetrics = new Map();

  persons.forEach((person) => {
    const personUID = person.person_uid;
    let total_globalScore = 0;

    // CORRECTION: We iterate over all DataViews, but only fetch the entry for the currently evaluated personUID!
    personsMetrics.forEach((viewMetrics) => {
      const metricForPerson = viewMetrics.get(personUID);
      if (metricForPerson) {
        total_globalScore += metricForPerson.view_globalScore;
      }
    });

    const weightingFactor = calculateWeightingFactor(
      benchmarkScore,
      total_globalScore
    );

    weightingMetrics.set(personUID, {
      total_globalScore,
      weightingFactor: weightingFactor,
    });
  });

  return weightingMetrics;
};

/**
 * Precomputes opportunity scores for **all persons × all relevant data views**.
 *
 * This factory function creates the complete metrics map used throughout the assignment engine:
 * ```
 * Map<DataViewKey, Map<personUID, OpportunityScore>>
 * ```
 *
 * **Batch Processing Logic:**
 * - Iterates over `relevantViews` (main + active language groups)
 * - For **each view**, calls `calculateOpportunityScore()` for **every person**
 * - Handles fixed assignment blocking via optional parameter
 *
 * **Performance Note:** O(n × m) where n=persons, m=views. Designed for batch execution
 * before individual task sorting to avoid repeated calculations.
 *
 * **Usage:** Feeds `getPersonsWeightingMetrics()` and `sortCandidatesMultiLevel()`.
 *
 * @param persons - All congregation persons.
 * @param relevantViews - Active views from `getDataViewsWithMeetings()`.
 * @param assignmentsMetrics - Statistics from `getAssignmentsWithStats()`.
 * @param fixedAssignmentsByCode - (Optional) Fixed assignments blocking conflicts.
 *
 * @returns Nested metrics map: `Map<view, Map<personUID, {mm_globalScore, wm_globalScore, ...}>>`.
 */
export const getPersonsAssignmentMetrics = (
  persons: PersonType[],
  relevantViews: Set<string>,
  assignmentsMetrics: AssignmentStatisticsComplete,
  fixedAssignmentsByCode?: FixedAssignmentsByCode
): personsAssignmentMetrics => {
  const mainMap: personsAssignmentMetrics = new Map();

  relevantViews.forEach((view) => {
    const viewMap = new Map<string, personsAssignmentMetricsItem>();
    mainMap.set(view, viewMap);
    persons.forEach((person) => {
      const personUID = person.person_uid;
      const personMetrics = calculateOpportunityScore(
        person,
        view,
        assignmentsMetrics,
        fixedAssignmentsByCode
      );
      viewMap.set(personUID, personMetrics);
    });
  });

  return mainMap;
};
