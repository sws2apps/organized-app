//// services/app/assignments_with_stats.ts
import { WEEK_TYPE_ASSIGNMENT_CODES } from '@constants/index';
import { AssignmentHistoryType, SchedWeekType } from '@definition/schedules';
import { PersonType } from '@definition/person';
import {
  AssignmentCode,
  MM_ASSIGNMENT_CODES,
  WM_ASSIGNMENT_CODES,
} from '@definition/assignment';
import { STUDENT_TASK_CODES } from '@constants/assignmentConflicts';
import { SettingsType } from '@definition/settings';
import { SourceWeekType } from '@definition/sources';
import { Week } from '@definition/week_type';
import { FieldServiceGroupType } from '@definition/field_service_groups';

/**
 * Creates a map counting how many persons are eligible for each assignment code.
 *
 * This function iterates through all persons and their assignments to determine the size of the "pool"
 * of available candidates for each specific task code ("Scarcity Check").
 *
 * Key Details:
 * - **Filters:** Ignores deleted, archived, or disqualified persons.
 * - **Data Structure:** Results are grouped by `dataView` (e.g., 'main').
 * - **Special Codes:** Adds two synthetic codes to each view, used for global benchmark calculations:
 * - `998`: Total number of unique persons eligible for *any* Midweek task.
 * - `999`: Total number of unique persons eligible for *any* Weekend task.
 *
 * @param persons - The list of all persons in the congregation.
 * @returns A Map: `DataView` -> `AssignmentCode` -> `Count of Eligible Persons`.
 */
export const buildEligibilityCountMap = (
  persons: PersonType[]
): Map<string, Map<number, number>> => {
  const map = new Map<string, Map<number, number>>();
  const mmPersonsSet = new Set<string>();
  const wmPersonsSet = new Set<string>();

  for (const person of persons) {
    // 2. Iterate through all assignments of person
    if (
      person._deleted.value ||
      person.person_data.archived.value ||
      person.person_data.disqualified.value
    ) {
      continue;
    }

    // This is the key for the outer map (e.g. 'main')
    person.person_data.assignments.forEach((assignment) => {
      const viewType = assignment.type;

      if (!Array.isArray(assignment.values)) return;

      assignment.values.forEach((code) => {
        const relevantPersonsSet = MM_ASSIGNMENT_CODES.includes(code)
          ? mmPersonsSet
          : wmPersonsSet;
        relevantPersonsSet.add(person.person_uid);

        let innerMap = map.get(viewType);
        if (!innerMap) {
          innerMap = new Map<number, number>();
          map.set(viewType, innerMap);
        }

        const currentCount = innerMap.get(code) || 0;
        innerMap.set(code, currentCount + 1);
      });
    });
  }

  map.forEach((m) => {
    m.set(998, mmPersonsSet.size);
    m.set(999, wmPersonsSet.size);
  });

  return map;
};

/**
 * Creates a lookup map of eligible persons for each assignment code, grouped by data view.
 *
 * This function processes the list of persons to determine who is eligible for which task.
 * It builds a nested structure allowing quick access to the set of candidate UIDs for any given
 * assignment code within a specific data view.
 *
 * Key Logic:
 * - **Filtering:** Skips persons who are deleted, archived, or disqualified.
 * - **Implicit Assistant Eligibility:** If a person is assigned a student task code (e.g., Bible Reading, Talk),
 * they are automatically added to the pool of eligible assistants (`MM_AssistantOnly`),
 * even if they don't have that specific code explicitly assigned.
 *
 * @param persons - The list of all persons to process.
 * @returns A nested object where the first key is the `dataView` (e.g., 'main'), the second key is the `AssignmentCode` (number),
 * and the value is a `Set` of person UIDs eligible for that task.
 */
export const getEligiblePersonsPerDataViewAndCode = (persons: PersonType[]) => {
  // Key 1: DataView (string), Key 2: Code (number), Value: Set<UID>
  const map: Record<string, Record<number, Set<string>>> = {};

  // Define code for assistant (129)
  const ASSISTANT_CODE = AssignmentCode.MM_AssistantOnly;

  persons.forEach((person) => {
    // 1. Filter: Person must exist and be active
    const isDeleted = person._deleted.value;
    const isArchived = person.person_data.archived.value;
    const isDisqualified = person.person_data.disqualified.value;

    if (isDeleted || isArchived || isDisqualified) {
      return;
    }

    const uid = person.person_uid;

    // 2. Iterate all assignments of person
    person.person_data.assignments.forEach((assignment) => {
      const viewType = assignment.type;

      if (Array.isArray(assignment.values)) {
        assignment.values.forEach((code) => {
          // A) Helper function to add to map
          const addToMap = (targetCode: number) => {
            if (!map[viewType]) {
              map[viewType] = {};
            }
            if (!map[viewType][targetCode]) {
              map[viewType][targetCode] = new Set();
            }
            map[viewType][targetCode].add(uid);
          };

          // B) Add actual code (e.g. Bible Reading)
          addToMap(code);

          // C) SPECIAL LOGIC: Implicit Assistant Eligibility
          // If code belongs to student tasks (e.g. Reading, Talk),
          // then person can automatically be assistant too.
          if (STUDENT_TASK_CODES.includes(code)) {
            // We add person additionally to assistant pool
            addToMap(ASSISTANT_CODE);
          }
        });
      }
    });
  });

  return map;
};
/**
 * Calculates the average weekly frequency for each assignment code based on historical source data and congregation settings.
 *
 * This function analyzes the provided `sourceWeeks` to determine how often specific tasks (e.g., AYF parts, LC parts, prayers)
 * actually occur. It takes the following factors into account:
 * - **Special Week Types:** Considers CO visits, conventions, etc., where standard tasks might be omitted.
 * - **Congregation Settings:** Respects class counts, linked prayer rules, and language groups.
 * - **DataViews:** Separates statistics for the main congregation and language groups.
 *
 * The function applies a "correction logic" to adjust frequencies for weeks where meetings took place
 * but specific tasks were displaced by special events.
 *
 * @param sourceWeeks - The historical source data containing details about meeting parts.
 * @param schedules - The schedule data defining the type of week (Normal, Special, etc.).
 * @param settings - Global settings (e.g., number of classes, rules for linked assignments).
 * @param languageGroups - Definitions of language groups to determine relevant data views.
 *
 * @returns A Map where the key is the `dataView` (e.g., 'main') and the value is another Map
 * linking the `AssignmentCode` to its calculated weekly frequency (e.g., 1.0 for weekly, 0.5 for every two weeks).
 */
export const getAssignmentsWithStats = (
  sourceWeeks: SourceWeekType[],
  schedules: SchedWeekType[],
  settings: SettingsType,
  languageGroups: FieldServiceGroupType[]
): Map<string, Map<number, number>> => {
  const stats = new Map<string, Map<number, number>>();

  // Constants for exceptions
  const EXCLUDED_CODES = [
    AssignmentCode.MINISTRY_HOURS_CREDIT,
    AssignmentCode.MM_AssistantOnly,
  ];

  // 0. Preparation: Load settings
  // ------------------------------------

  // Determine language for AYF codes
  const relevantViews = new Set<string>();
  relevantViews.add('main');
  if (settings.cong_settings.language_groups.enabled) {
    languageGroups.forEach((g) => {
      // 1. Ignore deleted groups
      if (g.group_data._deleted) return;

      // 2. Check if language group (optional, if 'language_group' flag is important)
      // and if it has relevant meetings
      const hasMeetings =
        g.group_data.midweek_meeting || g.group_data.weekend_meeting;

      if (hasMeetings) {
        relevantViews.add(g.group_id);
      }
    });
  }

  const langKey = new Map<string, string>();
  settings.cong_settings.source_material?.language.forEach((e) =>
    langKey.set(e.type, e.value)
  );

  // Midweek settings
  const classCount = new Map<string, number>();
  settings.cong_settings.midweek_meeting.forEach((e) =>
    classCount.set(e.type, e.class_count.value)
  );

  const mmOpenPrayerLinked = new Map<string, boolean>();
  settings.cong_settings.midweek_meeting.forEach((e) =>
    mmOpenPrayerLinked.set(
      e.type,
      e.opening_prayer_linked_assignment.value !== ''
    )
  );

  const mmClosePrayerLinked = new Map<string, boolean>();
  settings.cong_settings.midweek_meeting.forEach((e) =>
    mmClosePrayerLinked.set(
      e.type,
      e.closing_prayer_linked_assignment.value !== ''
    )
  );

  const wmOpenPrayerAuto = new Map<string, boolean>();
  settings.cong_settings.weekend_meeting.forEach((e) =>
    wmOpenPrayerAuto.set(e.type, e.opening_prayer_auto_assigned.value === true)
  );

  // Initialize counter maps
  const ayfCounts = new Map<string, Map<number, number>>();
  const lcPartCount = new Map<string, number>();
  const mmValidWeeksCount = new Map<string, number>();
  const wmValidWeeksCount = new Map<string, number>();
  const correctionCount = new Map<string, Map<number, number>>();

  // Initialize maps for each view
  relevantViews.forEach((view) => {
    ayfCounts.set(view, new Map());
    lcPartCount.set(view, 0);
    mmValidWeeksCount.set(view, 0);
    wmValidWeeksCount.set(view, 0);
    correctionCount.set(view, new Map());
    stats.set(view, new Map());
  });

  // 1. & 2. Analyze Source (AYF & LC)
  // -------------------------------------
  sourceWeeks.forEach((weekSource) => {
    const weekSchedule = schedules.find((s) => s.weekOf === weekSource.weekOf);

    if (!weekSchedule) return;

    relevantViews.forEach((view) => {
      // 1. Get Midweek Type
      const mmWeekTypeObj = weekSchedule.midweek_meeting.week_type.find(
        (s) => s.type === view
      );
      const mmWeekType = mmWeekTypeObj ? mmWeekTypeObj.value : Week.NORMAL;

      // 2. Get Weekend Type
      const wmWeekTypeObj = weekSchedule.weekend_meeting.week_type.find(
        (s) => s.type === view
      );
      const wmWeekType = wmWeekTypeObj ? wmWeekTypeObj.value : Week.NORMAL;
      // --- START: Week Counter ---

      // 1. Midweek Counter
      let isMMValid = false;
      if (mmWeekType === Week.NORMAL) {
        // Normal week always takes place
        isMMValid = true;
      } else {
        // Special week: Check if codes allowed for Midweek
        const codesForType = WEEK_TYPE_ASSIGNMENT_CODES[mmWeekType] || [];
        if (codesForType.some((c) => MM_ASSIGNMENT_CODES.includes(c))) {
          isMMValid = true;
        }
      }

      if (isMMValid || mmWeekType === Week.NO_MEETING) {
        mmValidWeeksCount.set(view, (mmValidWeeksCount.get(view) || 0) + 1);
      }

      // 2. Weekend Counter
      let isWMValid = false;
      if (wmWeekType === Week.NORMAL) {
        isWMValid = true;
      } else {
        // Special week: Check if codes allowed for Weekend
        const wmCodesForType = WEEK_TYPE_ASSIGNMENT_CODES[wmWeekType] || [];
        if (wmCodesForType.some((c) => WM_ASSIGNMENT_CODES.includes(c))) {
          isWMValid = true;
        }
      }

      if (isWMValid || wmWeekType === Week.NO_MEETING) {
        wmValidWeeksCount.set(view, (wmValidWeeksCount.get(view) || 0) + 1);
      }

      const mm = weekSource.midweek_meeting;
      const ayfParts = [mm.ayf_part1, mm.ayf_part2, mm.ayf_part3, mm.ayf_part4];
      const langKeyView = langKey.get(view) || 'x';

      const ayfMapForView = ayfCounts.get(view)!;

      ayfParts.forEach((part) => {
        if (part && part.type && part.type[langKeyView]) {
          const code = part.type[langKeyView];
          if (typeof code === 'number') {
            ayfMapForView.set(code, (ayfMapForView.get(code) || 0) + 1);
          }
        }
      });

      // LC Parts Logic
      const lcTitles = [
        mm.lc_part1?.title?.default?.[langKeyView],
        mm.lc_part2?.title?.default?.[langKeyView],
        mm.lc_part3?.title?.find((t) => t.type === view)?.value || '',
      ];

      for (const lcTitle of lcTitles) {
        if (lcTitle && typeof lcTitle === 'string' && lcTitle.trim() !== '') {
          lcPartCount.set(view, (lcPartCount.get(view) || 0) + 1);
        }
      }

      // CORRECTION COUNTS
      if (mmWeekType === Week.NORMAL && wmWeekType === Week.NORMAL) return;

      const correctionMapForView = correctionCount.get(view)!;

      if (mmWeekType !== Week.NORMAL) {
        // We must count codes that DO NOT take place in this special week,
        // but normally would.
        const availableCodes = new Set(WEEK_TYPE_ASSIGNMENT_CODES[mmWeekType]);
        MM_ASSIGNMENT_CODES.forEach((c) => {
          if (!availableCodes.has(c)) {
            correctionMapForView.set(c, (correctionMapForView.get(c) || 0) + 1);
          }
        });
      }
      if (wmWeekType !== Week.NORMAL) {
        const availableCodes = new Set(WEEK_TYPE_ASSIGNMENT_CODES[wmWeekType]);
        WM_ASSIGNMENT_CODES.forEach((c) => {
          if (!availableCodes.has(c)) {
            correctionMapForView.set(c, (correctionMapForView.get(c) || 0) + 1);
          }
        });
      }
    });
  });

  const mmDivisor = new Map<string, number>();
  mmValidWeeksCount.forEach((c, viewKey) => {
    mmDivisor.set(viewKey, c > 0 ? c : 1);
  });

  const wmDivisor = new Map<string, number>();
  wmValidWeeksCount.forEach((c, viewKey) => {
    wmDivisor.set(viewKey, c > 0 ? c : 1);
  });

  // 3. Iterate all relevant codes and set values
  // ----------------------------------------------------

  // We get ALL numeric codes from Enum
  // 3. CALCULATE STATS
  const allCodes = [...MM_ASSIGNMENT_CODES, ...WM_ASSIGNMENT_CODES];

  relevantViews.forEach((viewKey) => {
    const statsForView = stats.get(viewKey)!;
    const ayfCountsView = ayfCounts.get(viewKey)!;

    // --- Choose correct divisor ---
    const mmDiv = mmDivisor.get(viewKey) || 1;
    const wmDiv = wmDivisor.get(viewKey) || 1;

    const clsCount = classCount.get(viewKey) || 1;
    const lcCount = lcPartCount.get(viewKey) || 0;

    allCodes.forEach((code) => {
      if (EXCLUDED_CODES.includes(code)) return;

      let frequency = 0;

      // AYF
      if (ayfCountsView.has(code)) {
        frequency = ayfCountsView.get(code)! / mmDiv;
        if (clsCount === 2) frequency *= 2;
      }
      // LC
      else if (code === AssignmentCode.MM_LCPart) {
        frequency = lcCount / mmDiv;
      }
      // Prayer midweek
      else if (code === AssignmentCode.MM_Prayer) {
        let count = 2;
        if (mmOpenPrayerLinked.get(viewKey)) count--;
        if (mmClosePrayerLinked.get(viewKey)) count--;
        frequency = count;
      }
      // Prayer weekend
      else if (code === AssignmentCode.WM_Prayer) {
        frequency = wmOpenPrayerAuto.get(viewKey) ? 1 : 2;
      }
      // Standard
      else {
        // Differentiate if MM or WM task for divisor?
        // Simplified: Chairman, BibleReading are mostly there every week
        frequency = 1;
        if (code === AssignmentCode.MM_BibleReading && clsCount === 2) {
          frequency = 2;
        }
      }
      statsForView.set(code, frequency);
    });

    // SUBTRACT CORRECTION
    const corrections = correctionCount.get(viewKey)!;
    corrections.forEach((cc, codeKey) => {
      const currentFreq = statsForView.get(codeKey) || 0;

      const divisor = MM_ASSIGNMENT_CODES.includes(codeKey) ? mmDiv : wmDiv;

      const correctionVal = cc / divisor;
      statsForView.set(codeKey, Math.max(0, currentFreq - correctionVal));
    });
  });

  return stats;
};

/**
 * Calculates time distance to target week for a GROUP of codes.
 * Returns *smallest* distance (i.e. when was LAST time anything from group done).
 * Return: Milliseconds (Infinity if never done).
 */
export const getMinDistanceForCodes = (
  history: AssignmentHistoryType[],
  personUid: string,
  targetDateStr: string,
  codesToCheck: number[] | 'ANY'
): number => {
  const targetTime = new Date(targetDateStr).getTime();
  let minDiff = Infinity;

  for (const entry of history) {
    // 1. Person Check
    if (entry.assignment.person !== personUid) continue;

    const entryCode = entry.assignment.code;

    // Assistant assignments should not influence time distance for main tasks.
    if (entryCode === AssignmentCode.MM_AssistantOnly) {
      continue;
    }

    const isRelevant =
      codesToCheck === 'ANY' ? true : codesToCheck.includes(entryCode);

    if (isRelevant) {
      const entryTime = new Date(entry.weekOf).getTime();
      const diff = Math.abs(entryTime - targetTime);
      if (diff < minDiff) {
        minDiff = diff;
      }
    }
  }
  return minDiff;
};

/**
 * Calculates "Opportunity Score".
 * Formula per task: (Frequency per week) / (Number of eligible persons)
 * * Small Score = Person is "poor" in opportunities (Specialist).
 * // Large Score = Person is "rich" in opportunities (Generalist).
 */
export const calculateOpportunityScore = (
  person: PersonType,
  freqMap: Map<string, Map<number, number>>,
  eligibilityCountMap: Map<string, Map<number, number>>,
  dataView: string,
  targetTaskCode?: number
): {
  specificScore: number;
  mm_globalScore: number;
  wm_globalScore: number;
  total_globalScore: number;
} => {
  let mm_globalScore = 0;
  let wm_globalScore = 0;
  let specificScore = 0;

  // We iterate over ALL Views where person has tasks (e.g. 'main', 'spanish')
  person.person_data.assignments.forEach((assignmentsView) => {
    const currentViewKey = assignmentsView.type; // IMPORTANT: This is the View of THIS task

    // Get stats matching the respective View of the task
    const viewFreqMap = freqMap.get(currentViewKey);
    const viewEligMap = eligibilityCountMap.get(currentViewKey);

    // If no data exists for this View (e.g. Bug or old data), skip
    if (!viewFreqMap || !viewEligMap) return;

    // Iterate all codes in this View
    for (const code of assignmentsView.values) {
      const freq = viewFreqMap.get(code) || 0;
      const elig = viewEligMap.get(code) || 0;

      if (freq === 0 || elig === 0) continue;

      // 1. Calculate value of THIS ONE task
      const taskValue = freq / elig;

      // 2. Add to matching Global Score
      if (MM_ASSIGNMENT_CODES.includes(code)) {
        mm_globalScore += taskValue;
      } else if (WM_ASSIGNMENT_CODES.includes(code)) {
        wm_globalScore += taskValue;
      }

      // 3. Calculate Specific Score (Only for the task we are currently PLANNING)
      // Check 'dataView' here because 'specificScore' should show scarcity in target meeting.
      if (
        targetTaskCode !== undefined &&
        code === targetTaskCode &&
        currentViewKey === dataView
      ) {
        specificScore = taskValue;
      }
    }
  });

  return {
    specificScore,
    mm_globalScore,
    wm_globalScore,
    total_globalScore: mm_globalScore + wm_globalScore,
  };
};

/**
 * Sorts persons based on time distance of their assignment to target week.
 * Considers Past AND Future.
 *
 * Logic:
 * 1. Calculates difference to target week for each assignment (Math.abs).
 * 2. Remembers *smallest* distance (the "most dangerous" assignment).
 * 3. Sorts descending: Persons with large distance (or no assignment) come first.
 */
export const getPersonsSortedByDistance = (
  history: AssignmentHistoryType[],
  persons: PersonType[],
  code: AssignmentCode,
  targetWeek: string
): PersonType[] => {
  const targetTime = new Date(targetWeek).getTime();

  // Map: PersonUID -> Smallest found distance in milliseconds
  // We initialize not found persons later effectively with "Infinity"
  const minDistanceMap = new Map<string, number>();

  history.forEach((entry) => {
    // Only consider entries exactly matching our code
    if (entry.assignment.code === code) {
      const uid = entry.assignment.person;

      // When was/is this assignment?
      const entryTime = new Date(entry.weekOf).getTime();

      // Calculate absolute distance (regardless if past or future)
      const diff = Math.abs(entryTime - targetTime);

      // We want to know: How close is the *next* conflict?
      // So we always save the *smallest* distance found.
      const currentStoredDiff = minDistanceMap.get(uid);

      if (currentStoredDiff === undefined || diff < currentStoredDiff) {
        minDistanceMap.set(uid, diff);
      }
    }
  });

  // Sort
  return [...persons].sort((personA, personB) => {
    const uidA = personA.person_uid;
    const uidB = personB.person_uid;

    // Get distances. If no entry in map, person has
    // never done task (or not in recorded period).
    // Infinity is larger than any number -> Highest priority.
    const distA = minDistanceMap.get(uidA) ?? Infinity;
    const distB = minDistanceMap.get(uidB) ?? Infinity;

    // CASE A: Both never did task (Infinity)
    // -> Sort alphabetically for stable lists
    if (distA === Infinity && distB === Infinity) {
      const nameA = personA.person_data.person_lastname.value;
      const nameB = personB.person_data.person_lastname.value;
      return nameA.localeCompare(nameB);
    }

    // CASE B: We want to sort descending.
    // The larger the distance, the better the candidate.
    // (Infinity - 1000) -> positive -> A comes first
    // (500 - 5000) -> negative -> B comes first
    return distB - distA;
  });
};
