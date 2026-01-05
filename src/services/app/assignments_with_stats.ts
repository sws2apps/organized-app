import { ASSIGNMENTS_STRUCTURE } from '@constants/index';
import { AssignmentHistoryType } from '@definition/schedules';
import { PersonType } from '@definition/person';
import {
  AssignmentCode,
  MM_ASSIGNMENT_CODES,
  WM_ASSIGNMENT_CODES,
} from '@definition/assignment';
import { STUDENT_TASK_CODES } from '@constants/assignmentConflicts';
import { SettingsType } from '@definition/settings';
import { SourceWeekType } from '@definition/sources';
//import { AssignmentCode } from '@definition/assignment';

// 1. Ableiten wie vorher
type StructureType = typeof ASSIGNMENTS_STRUCTURE;
type SectionType = StructureType[number];
type ItemType = SectionType['items'][number];

// assignments_with_stats.ts

/**
 * Erstellt eine Map für den schnellen Zugriff auf den "Eligible Count" (Knappheit).
 * Key: AssignmentCode
 * Value: eligible_count (Anzahl der Personen, die das können)
 * * Wenn 'dataView' angegeben ist, wird nur dieser View beachtet.
 */
export const buildEligibilityCountMap = (
  persons: PersonType[],
  dataView: string
): Map<number, number> => {
  const map = new Map<number, number>();

  for (const person of persons) {
    const isDeleted = person._deleted.value;
    const isArchived = person.person_data.archived.value;
    const isDisqualified = person.person_data.disqualified.value;

    if (isDeleted || isArchived || isDisqualified) {
      continue;
    }

    // Durchlaufe alle Zuweisungen der Person
    person.person_data.assignments.forEach((assignment) => {
      const viewType = assignment.type; // z.B. 'main'

      if (Array.isArray(assignment.values)) {
        assignment.values.forEach((code) => {
          // Nur wenn der DataView übereinstimmt
          if (viewType === dataView) {
            map.set(code, (map.get(code) || 0) + 1);
          }
        });
      }
    });
  }

  return map;
};

// 2. KORREKTUR: Benutze 'type' + '&' statt 'interface' + 'extends'

// Item + Stats
export type EnrichedAssignmentItem = ItemType & {
  count_per_week: number;
  total_history_count: number;
  eligible_count: number;
};

// Section + Stats
// Wir nehmen den SectionType, entfernen 'items' und fügen unser neues 'items' + Stats hinzu
export type EnrichedAssignmentSection = Omit<SectionType, 'items'> & {
  items: EnrichedAssignmentItem[];
  header_count_per_week: number;
  header_eligible_count: number;
  header_total_history_count: number;
};

// DataView Stats (kann Interface bleiben, da es nichts Dynamisches erweitert)
export interface DataViewStats {
  sections: EnrichedAssignmentSection[];
  view_count_per_week: number;
  view_eligible_count: number;
  view_total_history_count: number;
}

// Result
export type AssignmentsWithStatsResult = Record<string, DataViewStats>;

export const getEligiblePersonsPerDataViewAndCode = (persons: PersonType[]) => {
  // Key 1: DataView (string), Key 2: Code (number), Value: Set<UID>
  const map: Record<string, Record<number, Set<string>>> = {};

  // Code für Assistent festlegen (129)
  const ASSISTANT_CODE = AssignmentCode.MM_AssistantOnly;

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
      const viewType = assignment.type; // z.B. 'main'

      if (Array.isArray(assignment.values)) {
        assignment.values.forEach((code) => {
          // A) Helper Funktion zum Hinzufügen in die Map
          const addToMap = (targetCode: number) => {
            if (!map[viewType]) {
              map[viewType] = {};
            }
            if (!map[viewType][targetCode]) {
              map[viewType][targetCode] = new Set();
            }
            map[viewType][targetCode].add(uid);
          };

          // B) Den eigentlichen Code hinzufügen (z.B. Bibellesung)
          addToMap(code);

          // C) SPEZIAL-LOGIK: Implizite Assistenten-Berechtigung
          // Wenn der Code zu den Schüleraufgaben gehört (z.B. Lesung, Vortrag),
          // dann kann die Person automatisch auch Assistent sein.
          if (STUDENT_TASK_CODES.includes(code)) {
            // Wir fügen die Person zusätzlich zum Assistenten-Topf hinzu
            addToMap(ASSISTANT_CODE);
          }
        });
      }
    });
  });

  return map;
};

/* export const getAssignmentsWithStats = (
  history: AssignmentHistoryType[],
  persons: PersonType[],
  ignoredKeysByDataView: Record<string, string[]> = {},
  structure = ASSIGNMENTS_STRUCTURE
): AssignmentsWithStatsResult => {
  // 1. Performance-Optimierung:
  // Wir wandeln die Arrays in Sets um, damit der Zugriff O(1) ist.
  const ignoredSetsByView: Record<string, Set<string>> = {};

  Object.keys(ignoredKeysByDataView).forEach((viewName) => {
    ignoredSetsByView[viewName] = new Set(ignoredKeysByDataView[viewName]);
  });
  // A. VORBEREITUNG: Verfügbarkeit mappen (jetzt verschachtelt nach View)
  // ---------------------------------------------------------
  const eligibleMapByView = getEligiblePersonsPerDataViewAndCode(persons);

  // B. HISTORIE AGGREGIEREN
  // ---------------------------------------------------------
  const weeksByDataView: Record<string, Set<string>> = {};
  const countsByDataView: Record<string, Record<number, number>> = {};

  history.forEach((entry) => {
    //const key = entry.assignment?.key;
    // if (key && ignoredKeys.has(key)) return;

    const code = entry.assignment?.code;
    const key = entry.assignment?.key;
    const week = entry.weekOf;
    const dataView = entry.assignment?.dataView || 'main';

    if (typeof code !== 'number' || !week) return;

    if (!weeksByDataView[dataView]) {
      weeksByDataView[dataView] = new Set();
      countsByDataView[dataView] = {};
    }

    weeksByDataView[dataView].add(week);

    // --- NEU: DATAVIEW-SPEZIFISCHE FILTERUNG ---

    // 1. Haben wir eine Ignore-Liste für DIESE DataView?
    const ignoreSet = ignoredSetsByView[dataView];

    // 2. Wenn ja, steht der aktuelle Key auf der Liste?
    if (key && ignoreSet && ignoreSet.has(key)) {
      return; // Nicht zählen!
    }
    // -------------------------------------------

    const currentCount = countsByDataView[dataView][code] || 0;
    countsByDataView[dataView][code] = currentCount + 1;
  });

  // C. ERGEBNIS ZUSAMMENBAUEN
  // ---------------------------------------------------------
  const result: AssignmentsWithStatsResult = {};
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

    const sections = structure.map((section): EnrichedAssignmentSection => {
      // --- SECTION AGGREGATION INITIALISIERUNG ---
      let sectionTotalHistoryCount = 0;
      const sectionEligiblePersons = new Set<string>();

      const enrichedItems = section.items.map(
        (item): EnrichedAssignmentItem => {
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
        }
      );

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
}; */

export const getAssignmentsWithStats = (
  sourceWeeks: SourceWeekType[],
  settings: SettingsType,
  dataView: string
): Map<number, number> => {
  const stats = new Map<number, number>();

  // Konstanten für Ausnahmen
  const EXCLUDED_CODES = [
    AssignmentCode.MINISTRY_HOURS_CREDIT, // 300
    AssignmentCode.MM_AssistantOnly, // 129
  ];

  // 0. Vorbereitung: Einstellungen laden
  // ------------------------------------

  // Sprache für AYF-Codes ermitteln
  const langSettingsList =
    settings.cong_settings.source_material?.language || [];

  const languageSetting = langSettingsList.find((e) => e.type === dataView);

  const langKey = languageSetting
    ? languageSetting.value
    : langSettingsList.find((e) => e.type === 'main')?.value || 'E';

  // Midweek Settings
  const mmSettings = settings.cong_settings.midweek_meeting.find(
    (e) => e.type === dataView
  );
  const classCount = mmSettings?.class_count.value ?? 1;
  const mmOpenPrayerLinked =
    mmSettings?.opening_prayer_linked_assignment.value !== '';
  const mmClosePrayerLinked =
    mmSettings?.closing_prayer_linked_assignment.value !== '';

  // Weekend Settings
  const wmSettings = settings.cong_settings.weekend_meeting.find(
    (e) => e.type === dataView
  );
  const weOpenPrayerAuto =
    wmSettings?.opening_prayer_auto_assigned.value === true;

  // Sammler für AYF und LC Zählungen aus der Source
  const ayfCounts = new Map<number, number>();
  let lcPartCount = 0;
  let validWeeksCount = 0;

  // 1. & 2. Source analysieren (AYF & LC)
  // -------------------------------------
  sourceWeeks.forEach((week) => {
    // Prüfen, ob die Woche für diese DataView überhaupt relevant ist
    // (z.B. Kongresswoche könnte das Meeting ausfallen lassen)
    const isDataViewValid = week.midweek_meeting.event_name.some(
      (e) => e.type === dataView && e.value.trim() === ''
    );
    const isMainValid = week.midweek_meeting.event_name.some(
      (e) => e.type === 'main' && e.value.trim() === ''
    );

    const isMMValid = isDataViewValid && isMainValid;

    if (!isMMValid) return;

    validWeeksCount++;

    const mm = week.midweek_meeting;

    // --- LOGIK 1: AYF Parts (applyFieldMinistryPart) ---
    const ayfParts = [mm.ayf_part1, mm.ayf_part2, mm.ayf_part3, mm.ayf_part4];

    ayfParts.forEach((part) => {
      // Existiert der Part und hat er einen Code für die Sprache?
      if (part && part.type && part.type[langKey]) {
        const code = part.type[langKey];
        // Sicherstellen, dass es eine Zahl ist
        if (typeof code === 'number') {
          ayfCounts.set(code, (ayfCounts.get(code) || 0) + 1);
        }
      }
    });

    //MARK: CORRECTION NEEDED IN CASE OF OVERRIDE FOR LC PARTS
    const lcTitles = [
      mm.lc_part1?.title?.[langKey]?.default,
      mm.lc_part2?.title?.[langKey]?.default,
      mm.lc_part3?.title?.find((t) => t.type === dataView)?.value || '',
    ];

    for (const lcTitle of lcTitles) {
      if (lcTitle && lcTitle.trim() !== '') {
        lcPartCount++;
      }
    }
  });

  // Falls sourceWeeks leer ist, verhindern wir Division durch 0
  const divisor = validWeeksCount > 0 ? validWeeksCount : 1;

  // 3. Alle relevanten Codes durchgehen und Werte setzen
  // ----------------------------------------------------

  // Wir holen uns ALLE numerischen Codes aus dem Enum
  const allCodes = Object.values(AssignmentCode).filter(
    (v) => typeof v === 'number'
  ) as number[];

  allCodes.forEach((code) => {
    // A) Ausnahmen überspringen
    if (EXCLUDED_CODES.includes(code)) return;

    let frequency = 0;

    // B) AYF Codes (Aus Source)
    if (ayfCounts.has(code)) {
      frequency = ayfCounts.get(code)! / divisor;

      // LOGIK 5: Class Count Multiplier für AYF
      if (classCount === 2) {
        frequency = frequency * 2;
      }
    }
    // C) LC Part (Aus Source)
    else if (code === AssignmentCode.MM_LCPart) {
      frequency = lcPartCount / divisor;
    }
    // D) Gebete (Logik 3 & 4)
    else if (code === AssignmentCode.MM_Prayer) {
      // LOGIK 3: Midweek Prayer
      let count = 2; // Standard: Anfang und Ende
      if (mmOpenPrayerLinked) count--;
      if (mmClosePrayerLinked) count--;
      frequency = count; // Das ist pro Meeting, also auch pro Woche
    } else if (code === AssignmentCode.WM_Prayer) {
      // LOGIK 4: Weekend Prayer
      // Standard 1, aber 0 wenn auto_assigned
      frequency = weOpenPrayerAuto ? 0 : 1;
    }
    // E) Standard für alle anderen (Chairman, BibleReading, Talk, etc.)
    else {
      // Standard ist 1
      frequency = 1;

      // LOGIK 5: Class Count Multiplier für Bible Reading
      if (code === AssignmentCode.MM_BibleReading && classCount === 2) {
        frequency = 2;
      }
    }

    // Wert speichern
    stats.set(code, frequency);
  });

  return stats;
};

/**
 * Berechnet den zeitlichen Abstand zur Zielwoche für eine GRUPPE von Codes.
 * Gibt den *kleinsten* Abstand zurück (d.h. wann wurde ZULETZT irgendwas aus der Gruppe gemacht).
 * Rückgabe: Millisekunden (Infinity, wenn nie gemacht).
 */
export const getMinDistanceForCodes = (
  history: AssignmentHistoryType[],
  personUid: string,
  targetDateStr: string,
  codesToCheck: number[] | 'ANY' // Array von Codes oder 'ANY' für globale Suche
): number => {
  const targetTime = new Date(targetDateStr).getTime();
  let minDiff = Infinity;

  for (const entry of history) {
    // 1. Person Check
    if (entry.assignment.person !== personUid) continue;

    const entryCode = entry.assignment.code;

    // --- NEU: Assistenten IMMER ignorieren ---
    // Egal ob wir nach 'ANY' oder spezifischen Codes suchen:
    // Assistenten-Einsätze sollen den zeitlichen Abstand für Hauptaufgaben nicht beeinflussen.
    if (entryCode === AssignmentCode.MM_AssistantOnly) {
      continue;
    }

    // 2. Check: Ist der Code relevant?
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
 * Baut eine Lookup-Map für die Häufigkeit (count_per_week) jedes Codes.
 * Das macht den Zugriff später schneller als immer durch 'stats' zu loopen.
 */

/**
 * Berechnet den "Opportunity Score" (Chancen-Wert).
 * Formel pro Aufgabe: (Häufigkeit pro Woche) / (Anzahl berechtigter Personen)
 * * Kleiner Score = Person ist "arm" an Möglichkeiten (Spezialist).
 * Großer Score = Person ist "reich" an Möglichkeiten (Generalist).
 */
// services/app/assignment_selection.ts
export const calculateOpportunityScore = (
  person: PersonType,
  freqMap: Map<number, number>,
  eligibilityCountMap: Map<number, number>,
  dataView: string,
  targetTaskCode?: number
): {
  specificScore: number;
  mm_globalScore: number;
  wm_globalScore: number;
  total_globalScore: number; // Optional: Falls du doch mal beide brauchst
} => {
  let mm_globalScore = 0;
  let wm_globalScore = 0;
  let specificScore = 0;

  // Assignments der Person für die aktuelle DataView finden
  const assignments = person.person_data.assignments.find(
    (a) => a.type === dataView
  );

  if (assignments && Array.isArray(assignments.values)) {
    for (const code of assignments.values) {
      // 1. Daten holen (Fail-Fast, wenn Daten fehlen)
      const frequency = freqMap.get(code);
      const eligibleCount = eligibilityCountMap.get(code);

      // Nur weitermachen, wenn wir gültige Zahlen haben
      if (!frequency || !eligibleCount) continue;

      // Wert dieser einzelnen Aufgabe berechnen
      const taskValue = frequency / eligibleCount;

      if (MM_ASSIGNMENT_CODES.includes(code)) {
        mm_globalScore += taskValue;
      } else if (WM_ASSIGNMENT_CODES.includes(code)) {
        wm_globalScore += taskValue;
      }

      // 3. Spezifischer Score (Target)
      if (targetTaskCode !== undefined && code === targetTaskCode) {
        specificScore = taskValue;
      }
    }
  }

  return {
    specificScore,
    mm_globalScore,
    wm_globalScore,
    total_globalScore: mm_globalScore + wm_globalScore,
  };
};
/**
 * Erstellt ein Dictionary: "Vorname Nachname" -> Opportunity Score
 */

// services/app/assignment_selection.ts

/* export const sortCandidatesMultiLevel = (
  candidates: PersonType[],
  task: AssignmentTask,
  history: AssignmentHistoryType[],
  freqMap: Map<number, number>,
  eligibilityCountMap: Map<number, number>,
  // NEU: Die Maps aus der Structure
  codeToSectionId: Map<number, string>,
  sectionIdToCodes: Map<string, number[]>
): PersonType[] => {
  // 1. Vorbereitung: Codes der aktuellen Sektion ermitteln
  const currentSectionId = codeToSectionId.get(task.code);

  // Alle Codes dieser Sektion holen. Fallback: Nur der aktuelle Code.
  const codesForSectionCheck = currentSectionId
    ? sectionIdToCodes.get(currentSectionId) || [task.code]
    : [task.code];

  // 2. Cache aufbauen (Performance)
  const metaCache = new Map<
    string,
    { sectionDist: number; globalDist: number; oppScore: number }
  >();

  candidates.forEach((p) => {
    metaCache.set(p.person_uid, {
      sectionDist: getMinDistanceForCodes(
        history,
        p.person_uid,
        task.targetDate,
        codesForSectionCheck
      ),

      // HIER ÜBERGEBEN WIR JETZT BEIDE MAPS
      oppScore: calculateOpportunityScore(
        p,
        freqMap,
        eligibilityCountMap,
        'main'
      ), // 'main' ggf. dynamisch

      globalDist: getMinDistanceForCodes(
        history,
        p.person_uid,
        task.targetDate,
        'ANY'
      ),
    });
  });

  // 3. Sortieren (Logik bleibt identisch zum vorherigen Vorschlag)
  return [...candidates].sort((a, b) => {
    const metaA = metaCache.get(a.person_uid)!;
    const metaB = metaCache.get(b.person_uid)!;

    // Level 1: Section Distance (Größerer Abstand gewinnt)
    if (metaA.sectionDist !== metaB.sectionDist) {
      if (metaA.sectionDist === Infinity) return -1;
      if (metaB.sectionDist === Infinity) return 1;
      return metaB.sectionDist - metaA.sectionDist;
    }

    // Level 2: Opportunity Score (Kleinerer Score gewinnt)
    if (Math.abs(metaA.oppScore - metaB.oppScore) > 0.0001) {
      return metaA.oppScore - metaB.oppScore;
    }

    // Level 3: Global Distance (Größerer Abstand gewinnt)
    if (metaA.globalDist !== metaB.globalDist) {
      if (metaA.globalDist === Infinity) return -1;
      if (metaB.globalDist === Infinity) return 1;
      return metaB.globalDist - metaA.globalDist;
    }

    return a.person_data.person_lastname.value.localeCompare(
      b.person_data.person_lastname.value
    );
  });
};
 */
/**
 * Sortiert Personen basierend auf dem zeitlichen Abstand ihres Einsatzes zur Zielwoche.
 * Berücksichtigt Vergangenheit UND Zukunft.
 *
 * Logik:
 * 1. Berechnet für jeden Einsatz der Person die Differenz zur Zielwoche (Math.abs).
 * 2. Merkt sich den *kleinsten* Abstand (den "gefährlichsten" Einsatz).
 * 3. Sortiert absteigend: Personen mit großem Abstand (oder gar keinem Einsatz) kommen nach oben.
 */
export const getPersonsSortedByDistance = (
  history: AssignmentHistoryType[],
  persons: PersonType[],
  code: AssignmentCode,
  targetWeek: string // Format "YYYY/MM/DD"
): PersonType[] => {
  // Wir wandeln das Ziel-Datum in einen Timestamp um, um rechnen zu können
  const targetTime = new Date(targetWeek).getTime();

  // Map: PersonUID -> Kleinster gefundener Abstand in Millisekunden
  // Wir initialisieren nicht gefundene Personen später quasi mit "Infinity"
  const minDistanceMap = new Map<string, number>();

  history.forEach((entry) => {
    // Nur Einträge beachten, die exakt unseren Code betreffen
    if (entry.assignment.code === code) {
      const uid = entry.assignment.person;

      // Wann war/ist dieser Einsatz?
      const entryTime = new Date(entry.weekOf).getTime();

      // Berechne den absoluten Abstand (egal ob Vergangenheit oder Zukunft)
      const diff = Math.abs(entryTime - targetTime);

      // Wir wollen wissen: Wie nah ist der *nächste* Konflikt?
      // Also speichern wir immer den *kleinsten* Abstand, den wir finden.
      const currentStoredDiff = minDistanceMap.get(uid);

      if (currentStoredDiff === undefined || diff < currentStoredDiff) {
        minDistanceMap.set(uid, diff);
      }
    }
  });

  // Sortieren
  return [...persons].sort((personA, personB) => {
    const uidA = personA.person_uid;
    const uidB = personB.person_uid;

    // Hole die Abstände. Wenn kein Eintrag in der Map ist, hat die Person
    // die Aufgabe noch nie (oder nicht im erfassten Zeitraum) gemacht.
    // Infinity ist größer als jede Zahl -> Höchste Priorität.
    const distA = minDistanceMap.get(uidA) ?? Infinity;
    const distB = minDistanceMap.get(uidB) ?? Infinity;

    // FALL A: Beide haben die Aufgabe noch nie gemacht (Infinity)
    // -> Alphabetisch sortieren für stabile Listen
    if (distA === Infinity && distB === Infinity) {
      const nameA = personA.person_data.person_lastname.value;
      const nameB = personB.person_data.person_lastname.value;
      return nameA.localeCompare(nameB);
    }

    // FALL B: Wir wollen absteigend sortieren.
    // Je größer der Abstand, desto besser ist der Kandidat.
    // (Infinity - 1000) -> positiv -> A kommt zuerst
    // (500 - 5000) -> negativ -> B kommt zuerst
    return distB - distA;
  });
};
