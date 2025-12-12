import { ASSIGNMENTS_STRUCTURE } from '@constants/index';
import { AssignmentHistoryType } from '@definition/schedules';
import { PersonType } from '@definition/person';
//import { AssignmentCode } from '@definition/assignment';

/**
 * Hilfsfunktion: Liefert ein Mapping von DataView -> Code -> Set an Person-UIDs.
 *
 * Struktur:
 * {
 * "main": { 110: Set("uid1", "uid2"), 112: ... },
 * "aux_class_1": { 110: Set("uid3"), ... }
 * }
 */
const getEligiblePersonsPerDataViewAndCode = (persons: PersonType[]) => {
  // Key 1: DataView (string), Key 2: Code (number), Value: Set<UID>
  const map: Record<string, Record<number, Set<string>>> = {};

  persons.forEach((person) => {
    // 1. Filter: Person muss existieren und aktiv sein
    const isDeleted = person._deleted.value;
    const isArchived = person.person_data.archived.value;
    const isDisqualified = person.person_data.disqualified.value;

    if (isDeleted || isArchived || isDisqualified) {
      return;
    }

    const uid = person.person_uid;

    // 2. Alle Assignments der Person durchgehen
    person.person_data.assignments.forEach((assignment) => {
      // WICHTIG: Hier nutzen wir jetzt den 'type' (entspricht dataView)
      const viewType = assignment.type; // z.B. 'main'

      if (Array.isArray(assignment.values)) {
        assignment.values.forEach((code) => {
          // 1. Ebene: DataView initialisieren
          if (!map[viewType]) {
            map[viewType] = {};
          }

          // 2. Ebene: Code initialisieren
          if (!map[viewType][code]) {
            map[viewType][code] = new Set();
          }

          // UID hinzufügen
          map[viewType][code].add(uid);
        });
      }
    });
  });

  return map;
};

export const getAssignmentsWithStats = (
  history: AssignmentHistoryType[],
  persons: PersonType[],
  ignoredKeys: Set<string> = new Set(),
  structure = ASSIGNMENTS_STRUCTURE
) => {
  // A. VORBEREITUNG: Verfügbarkeit mappen (jetzt verschachtelt nach View)
  // ---------------------------------------------------------
  const eligibleMapByView = getEligiblePersonsPerDataViewAndCode(persons);

  // B. HISTORIE AGGREGIEREN
  // ---------------------------------------------------------
  const weeksByDataView: Record<string, Set<string>> = {};
  const countsByDataView: Record<string, Record<number, number>> = {};

  history.forEach((entry) => {
    const key = entry.assignment?.key;
    if (key && ignoredKeys.has(key)) return;

    const code = entry.assignment?.code;
    const week = entry.weekOf;
    const dataView = entry.assignment?.dataView || 'main';

    if (typeof code !== 'number' || !week) return;

    if (!weeksByDataView[dataView]) {
      weeksByDataView[dataView] = new Set();
      countsByDataView[dataView] = {};
    }

    weeksByDataView[dataView].add(week);
    const currentCount = countsByDataView[dataView][code] || 0;
    countsByDataView[dataView][code] = currentCount + 1;
  });

  // C. ERGEBNIS ZUSAMMENBAUEN
  // ---------------------------------------------------------
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: Record<string, any> = {};
  const foundDataViews = Object.keys(weeksByDataView);

  foundDataViews.forEach((dataViewKey) => {
    const uniqueWeeks = weeksByDataView[dataViewKey];
    const totalWeeks = uniqueWeeks.size > 0 ? uniqueWeeks.size : 1;
    const historyCounts = countsByDataView[dataViewKey];

    // Hier holen wir uns die Eligibility-Map speziell für DIESEN View (z.B. 'main')
    // Fallback auf leeres Objekt, falls für diesen View niemand eingeteilt werden darf
    const viewEligibleMap = eligibleMapByView[dataViewKey] || {};

    // --- VIEW AGGREGATION INITIALISIERUNG ---
    let viewTotalHistoryCount = 0;
    const viewEligiblePersons = new Set<string>();

    const sections = structure.map((section) => {
      // --- SECTION AGGREGATION INITIALISIERUNG ---
      let sectionTotalHistoryCount = 0;
      const sectionEligiblePersons = new Set<string>();

      const enrichedItems = section.items.map((item) => {
        const itemCode = item.code;

        // 1. History Stats
        const itemHistoryCount = historyCounts[itemCode] || 0;
        const averagePerWeek = itemHistoryCount / totalWeeks;

        // 2. Eligible Stats (Jetzt korrekt aus dem View-Map)
        const eligibleSet = viewEligibleMap[itemCode] || new Set();
        const eligibleCount = eligibleSet.size;

        // --- SECTION AGGREGATION ---
        sectionTotalHistoryCount += itemHistoryCount;
        eligibleSet.forEach((uid) => sectionEligiblePersons.add(uid));

        return {
          ...item,
          count_per_week: averagePerWeek,
          total_history_count: itemHistoryCount,
          eligible_count: eligibleCount,
        };
      });

      // --- VIEW AGGREGATION ---
      viewTotalHistoryCount += sectionTotalHistoryCount;
      sectionEligiblePersons.forEach((uid) => viewEligiblePersons.add(uid));

      // Header-Werte für die Section
      const headerAvgPerWeek = sectionTotalHistoryCount / totalWeeks;
      const headerEligibleCount = sectionEligiblePersons.size;

      return {
        ...section,
        items: enrichedItems,
        header_count_per_week: headerAvgPerWeek,
        header_eligible_count: headerEligibleCount,
        header_total_history_count: sectionTotalHistoryCount,
      };
    });

    // --- VIEW WERTE BERECHNEN ---
    const viewAvgPerWeek = viewTotalHistoryCount / totalWeeks;
    const viewEligibleCount = viewEligiblePersons.size;

    result[dataViewKey] = {
      sections: sections,
      view_count_per_week: viewAvgPerWeek,
      view_eligible_count: viewEligibleCount,
      view_total_history_count: viewTotalHistoryCount,
    };
  });

  return result;
};

// --- SORTIER FUNKTION (Bleibt identisch zur vorherigen Version) ---
type StatsResult = ReturnType<typeof getAssignmentsWithStats>;

export const sortAssignmentsByEligibility = (
  stats: StatsResult
): StatsResult => {
  const sortedResult: StatsResult = {};
  const dataViews = Object.keys(stats);

  // 1. Dataviews sortieren
  dataViews.sort((keyA, keyB) => {
    const countA = stats[keyA]?.view_eligible_count || 0;
    const countB = stats[keyB]?.view_eligible_count || 0;
    return countA - countB;
  });

  dataViews.forEach((dataViewKey) => {
    const viewData = stats[dataViewKey];
    const originalSections = viewData.sections;

    // 2. Items sortieren
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sectionsWithSortedItems = originalSections.map((section: any) => ({
      ...section,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: [...section.items].sort((a: any, b: any) => {
        return (a.eligible_count || 0) - (b.eligible_count || 0);
      }),
    }));

    // 3. Sections sortieren
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sectionsWithSortedItems.sort((a: any, b: any) => {
      return (a.header_eligible_count || 0) - (b.header_eligible_count || 0);
    });

    sortedResult[dataViewKey] = {
      ...viewData,
      sections: sectionsWithSortedItems,
    };
  });

  return sortedResult;
};
