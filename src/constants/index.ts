import {
  de,
  enUS,
  es,
  et,
  fi,
  fr,
  hu,
  hy,
  it,
  ja,
  mn,
  nl,
  pl,
  pt,
  ptBR,
  ro,
  ru,
  sl,
  sv,
  tr,
  uk,
  vi,
  zhCN,
} from 'date-fns/locale';
import { AppRoleType, LanguageItem } from '@definition/app';
import { AssignmentCode } from '@definition/assignment';
import { FullnameOption } from '@definition/settings';
import { Week } from '@definition/week_type';

export const LANGUAGE_LIST: LanguageItem[] = [
  {
    code: 'x',
    locale: 'de-DE',
    name: 'Deutsch',
    source: true,
    threeLettersCode: 'deu',
    browserLangCode: ['de-DE', 'de'],
    fnsLocale: de,
  },
  {
    code: 'e',
    locale: 'en',
    name: 'English',
    source: true,
    threeLettersCode: 'eng',
    browserLangCode: ['en-US', 'en-GB', 'en'],
    fnsLocale: enUS,
  },
  {
    code: 's',
    locale: 'es-ES',
    name: 'Español',
    source: true,
    threeLettersCode: 'spa',
    browserLangCode: ['es-ES', 'es'],
    fnsLocale: es,
  },
  {
    code: 's',
    locale: 'es-SSP',
    name: 'Español (de España)',
    threeLettersCode: 'ssp',
    browserLangCode: ['es-ES', 'es'],
    fnsLocale: es,
  },
  {
    code: 'f',
    locale: 'fr-FR',
    name: 'Français',
    source: true,
    threeLettersCode: 'fra',
    browserLangCode: ['fr-FR', 'fr'],
    fnsLocale: fr,
  },
  {
    code: 'i',
    locale: 'it-IT',
    name: 'Italiano',
    source: true,
    threeLettersCode: 'ita',
    browserLangCode: ['it-IT', 'it'],
    fnsLocale: it,
  },
  {
    code: 'mg',
    locale: 'mg-MG',
    name: 'Malagasy',
    source: true,
    fullnameOption: FullnameOption.LAST_BEFORE_FIRST,
    threeLettersCode: 'mlg',
    browserLangCode: ['mg-MG', 'mg'],
  },
  {
    code: 'p',
    locale: 'pl-PL',
    name: 'Polski',
    source: true,
    threeLettersCode: 'pol',
    browserLangCode: ['pl-PL', 'pl'],
    fnsLocale: pl,
  },
  {
    code: 't',
    locale: 'pt-POR',
    name: 'Português (Brasil)',
    source: true,
    threeLettersCode: 'por',
    browserLangCode: ['pt-BR', 'pt'],
    fnsLocale: ptBR,
  },
  {
    code: 'u',
    locale: 'ru-RU',
    name: 'Русский',
    source: true,
    threeLettersCode: 'rus',
    browserLangCode: ['ru-RU', 'ru'],
    fnsLocale: ru,
  },
  {
    code: 'm',
    locale: 'ro-RO',
    name: 'Română',
    source: true,
    threeLettersCode: 'ron',
    browserLangCode: ['ro-RO', 'ro'],
    fnsLocale: ro,
  },
  {
    code: 'tg',
    locale: 'tl-PH',
    name: 'Tagalog',
    source: true,
    threeLettersCode: 'tgl',
    browserLangCode: ['tl-PH', 'tl'],
  },
  {
    code: 'tnd',
    locale: 'mg-TND',
    name: 'Tandroy',
    source: true,
    fullnameOption: FullnameOption.LAST_BEFORE_FIRST,
    threeLettersCode: 'tnd',
    browserLangCode: ['mg-MG', 'mg'],
  },
  {
    code: 'tnk',
    locale: 'mg-TNK',
    name: 'Tankarana',
    source: true,
    fullnameOption: FullnameOption.LAST_BEFORE_FIRST,
    threeLettersCode: 'tnk',
    browserLangCode: ['mg-MG', 'mg'],
  },
  {
    code: 'ttm',
    locale: 'mg-TTM',
    name: 'Tenin’ny Tanana Malagasy',
    source: true,
    fullnameOption: FullnameOption.LAST_BEFORE_FIRST,
    threeLettersCode: 'ttm',
    browserLangCode: ['mg-MG', 'mg'],
  },
  {
    code: 'tk',
    locale: 'tr-TR',
    name: 'Türkçe',
    source: true,
    threeLettersCode: 'tur',
    browserLangCode: ['tr-TR', 'tr'],
    fnsLocale: tr,
  },
  {
    code: 'tw',
    locale: 'tw-TW',
    name: 'Twi',
    source: true,
    threeLettersCode: 'twi',
    browserLangCode: ['tw-TW', 'tw'],
  },
  {
    code: 'vz',
    locale: 'mg-VZ',
    name: 'Vezo',
    source: true,
    fullnameOption: FullnameOption.LAST_BEFORE_FIRST,
    threeLettersCode: 'vez',
    browserLangCode: ['mg-MG', 'mg'],
  },
  {
    code: 'k',
    locale: 'uk-UA',
    name: 'Українська',
    source: true,
    threeLettersCode: 'ukr',
    browserLangCode: ['uk-UA', 'uk'],
    fnsLocale: uk,
  },
  {
    code: 'chs',
    locale: 'ch-CHS',
    name: '中文简体（普通话）',
    source: true,
    font: 'NotoSansSC',
    threeLettersCode: 'chs',
    browserLangCode: ['zh-CN', 'zh'],
    fnsLocale: zhCN,
  },
  {
    code: 'j',
    locale: 'ja-JP',
    name: '日本語',
    source: true,
    font: 'NotoSansJP',
    fullnameOption: FullnameOption.LAST_BEFORE_FIRST,
    threeLettersCode: 'jpn',
    browserLangCode: ['ja-JP', 'ja'],
    fnsLocale: ja,
  },
  {
    code: 'np',
    locale: 'ne-NP',
    name: 'नेपाली',
    source: true,
    font: 'NotoSans',
    threeLettersCode: 'nep',
    browserLangCode: ['ne-NP', 'ne'],
  },
  {
    code: 'z',
    locale: 'sv-SE',
    name: 'Svenska',
    source: true,
    threeLettersCode: 'swe',
    browserLangCode: ['sv-SE', 'sv'],
    fnsLocale: sv,
  },
  {
    code: 'cv',
    locale: 'ceb-PH',
    name: 'Cebuano',
    source: true,
    threeLettersCode: 'ceb',
    browserLangCode: ['ceb-PH', 'ceb'],
  },
  {
    code: 'kha',
    locale: 'mn-MN',
    name: 'Монгол',
    source: true,
    threeLettersCode: 'mon',
    browserLangCode: ['mn-MN', 'mn'],
    fnsLocale: mn,
  },
  {
    code: 'rea',
    locale: 'hy-AM',
    name: 'Հայերեն',
    source: true,
    threeLettersCode: 'hye',
    browserLangCode: ['hy-AM', 'hy'],
    fnsLocale: hy,
  },
  {
    code: 'h',
    locale: 'hu-HU',
    name: 'Magyar',
    source: true,
    threeLettersCode: 'hun',
    browserLangCode: ['hu-HU', 'hu'],
    fnsLocale: hu,
  },
  {
    code: 'tpo',
    locale: 'pt-TPO',
    name: 'Português (Portugal)',
    source: true,
    threeLettersCode: 'tpo',
    browserLangCode: ['pt-PT', 'pt'],
    fnsLocale: pt,
  },
  {
    code: 'fi',
    locale: 'fi-FI',
    name: 'Suomeksi',
    source: true,
    threeLettersCode: 'fin',
    browserLangCode: ['fi-FI', 'fi'],
    fnsLocale: fi,
  },
  {
    code: 'st',
    locale: 'et-EE',
    name: 'Eesti',
    source: true,
    threeLettersCode: 'est',
    browserLangCode: ['et-EE', 'et'],
    fnsLocale: et,
  },
  {
    code: 'il',
    locale: 'ilo-PH',
    name: 'Iloko',
    source: true,
    threeLettersCode: 'ilo',
    browserLangCode: ['ilo-PH', 'ilo'],
  },
  {
    code: 'sv',
    locale: 'sl-SI',
    name: 'Slovenščina',
    source: true,
    threeLettersCode: 'slv',
    browserLangCode: ['sl-SI', 'sl'],
    fnsLocale: sl,
  },
  {
    code: 'eli',
    locale: 'en-LR',
    name: 'Liberian English',
    source: true,
    threeLettersCode: 'lir',
    browserLangCode: ['en-LR', 'en'],
    fnsLocale: enUS,
  },
  {
    code: 'yw',
    locale: 'rw-RW',
    name: 'Ikinyarwanda',
    source: true,
    threeLettersCode: 'kin',
    browserLangCode: ['rw-RW', 'rw'],
  },
  {
    code: 'vt',
    locale: 'vi-VN',
    name: 'Việt',
    source: true,
    threeLettersCode: 'vie',
    browserLangCode: ['vi-VN', 'vi'],
    fnsLocale: vi,
  },
  {
    code: 'lse',
    locale: 'es-LSE',
    name: 'Lengua de signos española',
    source: true,
    threeLettersCode: 'lse',
    fnsLocale: es,
  },
  {
    code: 'o',
    locale: 'nl-NL',
    name: 'Nederlands',
    source: true,
    threeLettersCode: 'nld',
    browserLangCode: ['nl-NL', 'nl'],
    fnsLocale: nl,
  },
].sort((a, b) => a.code.localeCompare(b.code));

export const APP_READ_ONLY_ROLES: AppRoleType[] = [
  'view_schedules',
  'elder',
  'ms',
  'publisher',
  'group_overseers',
  'language_group_overseers',
];

export const APP_ROLES: AppRoleType[] = [
  'admin',
  'coordinator',
  'midweek_schedule',
  'weekend_schedule',
  'public_talk_schedule',
  'attendance_tracking',
  'secretary',
  'service_overseer',
  ...APP_READ_ONLY_ROLES,
];

export const VIP_ROLES: AppRoleType[] = [
  'admin',
  'coordinator',
  'midweek_schedule',
  'weekend_schedule',
  'public_talk_schedule',
  'secretary',
  'service_overseer',
  'elder',
  'group_overseers',
  'language_group_overseers',
];

export const POCKET_ROLES: AppRoleType[] = [
  'elder',
  'ms',
  'publisher',
  'view_schedules',
];

export const APP_ENVIRONMENT = import.meta.env.VITE_APP_MODE;

export const isTest = APP_ENVIRONMENT === 'TEST';

export const isStaging = APP_ENVIRONMENT === 'STAGING';

export const isDEV = isTest ? false : import.meta.env.DEV;

// ============================================
// TYPE DEFINITION
// ============================================

export type AssignmentConfigType = {
  code?: AssignmentCode;
  elderOnly?: boolean;
};

// ============================================
// SINGLE SOURCE OF TRUTH
// ============================================
// Alle Daten in Sektionen organisiert
// Schlüssel → Pfad + Konfiguration
// Typen und flache Konstanten werden daraus abgeleitet

const ASSIGNMENT_PATHS_SECTIONS = {
  MM_CHAIRMAN: {
    MM_Chairman_A: {
      path: 'midweek_meeting.chairman.main_hall',
      config: { code: AssignmentCode.MM_Chairman },
    },
    MM_Chairman_B: {
      path: 'midweek_meeting.chairman.aux_class_1',
      config: { code: AssignmentCode.MM_AuxiliaryCounselor },
    },
  },
  MM_PRAYER: {
    MM_OpeningPrayer: {
      path: 'midweek_meeting.opening_prayer',
      config: { code: AssignmentCode.MM_Prayer },
    },
    MM_ClosingPrayer: {
      path: 'midweek_meeting.closing_prayer',
      config: { code: AssignmentCode.MM_Prayer },
    },
  },
  MM_TGW: {
    MM_TGWTalk: {
      path: 'midweek_meeting.tgw_talk',
      config: { code: AssignmentCode.MM_TGWTalk },
    },
    MM_TGWGems: {
      path: 'midweek_meeting.tgw_gems',
      config: { code: AssignmentCode.MM_TGWGems },
    },
    MM_TGWBibleReading_A: {
      path: 'midweek_meeting.tgw_bible_reading.main_hall',
      config: { code: AssignmentCode.MM_BibleReading },
    },
    MM_TGWBibleReading_B: {
      path: 'midweek_meeting.tgw_bible_reading.aux_class_1',
      config: { code: AssignmentCode.MM_BibleReading },
    },
  },
  MM_AYF_PART: {
    MM_AYFPart1_Student_A: {
      path: 'midweek_meeting.ayf_part1.main_hall.student',
      config: {},
    },
    MM_AYFPart1_Assistant_A: {
      path: 'midweek_meeting.ayf_part1.main_hall.assistant',
      config: { code: AssignmentCode.MM_AssistantOnly },
    },
    MM_AYFPart1_Student_B: {
      path: 'midweek_meeting.ayf_part1.aux_class_1.student',
      config: {},
    },
    MM_AYFPart1_Assistant_B: {
      path: 'midweek_meeting.ayf_part1.aux_class_1.assistant',
      config: { code: AssignmentCode.MM_AssistantOnly },
    },

    MM_AYFPart2_Student_A: {
      path: 'midweek_meeting.ayf_part2.main_hall.student',
      config: {},
    },
    MM_AYFPart2_Assistant_A: {
      path: 'midweek_meeting.ayf_part2.main_hall.assistant',
      config: { code: AssignmentCode.MM_AssistantOnly },
    },
    MM_AYFPart2_Student_B: {
      path: 'midweek_meeting.ayf_part2.aux_class_1.student',
      config: {},
    },
    MM_AYFPart2_Assistant_B: {
      path: 'midweek_meeting.ayf_part2.aux_class_1.assistant',
      config: { code: AssignmentCode.MM_AssistantOnly },
    },

    MM_AYFPart3_Student_A: {
      path: 'midweek_meeting.ayf_part3.main_hall.student',
      config: {},
    },
    MM_AYFPart3_Assistant_A: {
      path: 'midweek_meeting.ayf_part3.main_hall.assistant',
      config: { code: AssignmentCode.MM_AssistantOnly },
    },
    MM_AYFPart3_Student_B: {
      path: 'midweek_meeting.ayf_part3.aux_class_1.student',
      config: {},
    },
    MM_AYFPart3_Assistant_B: {
      path: 'midweek_meeting.ayf_part3.aux_class_1.assistant',
      config: { code: AssignmentCode.MM_AssistantOnly },
    },

    MM_AYFPart4_Student_A: {
      path: 'midweek_meeting.ayf_part4.main_hall.student',
      config: {},
    },
    MM_AYFPart4_Assistant_A: {
      path: 'midweek_meeting.ayf_part4.main_hall.assistant',
      config: { code: AssignmentCode.MM_AssistantOnly },
    },
    MM_AYFPart4_Student_B: {
      path: 'midweek_meeting.ayf_part4.aux_class_1.student',
      config: {},
    },
    MM_AYFPart4_Assistant_B: {
      path: 'midweek_meeting.ayf_part4.aux_class_1.assistant',
      config: { code: AssignmentCode.MM_AssistantOnly },
    },
  },
  MM_LC: {
    MM_LCPart1: {
      path: 'midweek_meeting.lc_part1',
      config: { code: AssignmentCode.MM_LCPart },
    },
    MM_LCPart2: {
      path: 'midweek_meeting.lc_part2',
      config: { code: AssignmentCode.MM_LCPart },
    },
    MM_LCPart3: {
      path: 'midweek_meeting.lc_part3',
      config: { code: AssignmentCode.MM_LCPart },
    },
  },
  MM_CBS: {
    MM_LCCBSConductor: {
      path: 'midweek_meeting.lc_cbs.conductor',
      config: { code: AssignmentCode.MM_CBSConductor },
    },
    MM_LCCBSReader: {
      path: 'midweek_meeting.lc_cbs.reader',
      config: { code: AssignmentCode.MM_CBSReader },
    },
  },
  CO: {
    MM_CircuitOverseer: {
      path: 'midweek_meeting.circuit_overseer',
      config: {},
    },
    WM_CircuitOverseer: {
      path: 'weekend_meeting.circuit_overseer',
      config: {},
    },
  },
  WM_OPENING: {
    WM_Chairman: {
      path: 'weekend_meeting.chairman',
      config: { code: AssignmentCode.WM_Chairman },
    },
  },
  WM_TALK: {
    WM_Speaker_Part1: {
      path: 'weekend_meeting.speaker.part_1',
      config: { code: AssignmentCode.WM_Speaker },
    },
    WM_Speaker_Part2: {
      path: 'weekend_meeting.speaker.part_2',
      config: { code: AssignmentCode.WM_Speaker },
    },
    WM_SubstituteSpeaker: {
      path: 'weekend_meeting.speaker.substitute',
      config: { code: AssignmentCode.WM_Speaker },
    },
    WM_Speaker_Outgoing: {
      path: 'weekend_meeting.outgoing_talks',
      config: { code: AssignmentCode.WM_Speaker },
    },
  },
  WM_WT_STUDY: {
    WM_WTStudy_Conductor: {
      path: 'weekend_meeting.wt_study.conductor',
      config: { code: AssignmentCode.WM_WTStudyConductor },
    },
    WM_WTStudy_Reader: {
      path: 'weekend_meeting.wt_study.reader',
      config: { code: AssignmentCode.WM_WTStudyReader },
    },
  },
  WM_PRAYER: {
    WM_ClosingPrayer: {
      path: 'weekend_meeting.closing_prayer',
      config: { code: AssignmentCode.WM_Prayer },
    },
    WM_OpeningPrayer: {
      path: 'weekend_meeting.opening_prayer',
      config: { code: AssignmentCode.WM_Prayer },
    },
  },
} as const;

// ============================================
// HILFSFUNKTIONEN: Daten aus Sektionen extrahieren
// ============================================

/**
 * Erstellt ein flaches Objekt aus allen Sektionen
 * Extrahiert nur das 'path' Feld
 */
const extractPaths = <
  T extends Record<string, Record<string, { path: string }>>,
>(
  sections: T
) => {
  const result: Record<string, string> = {};
  Object.values(sections).forEach((section) => {
    Object.entries(section).forEach(([key, value]) => {
      result[key] = value.path;
    });
  });
  return result;
};

/**
 * Erstellt ein flaches Objekt aus allen Sektionen
 * Extrahiert nur das 'config' Feld
 */
const extractConfigs = <
  T extends Record<string, Record<string, { config: AssignmentConfigType }>>,
>(
  sections: T
) => {
  const result: Record<string, AssignmentConfigType> = {};
  Object.values(sections).forEach((section) => {
    Object.entries(section).forEach(([key, value]) => {
      result[key] = value.config;
    });
  });
  return result;
};

// ============================================
// ABGELEITETE KONSTANTEN (Flache Objekte)
// ============================================

/**
 * Die ursprüngliche flache Definition der Pfade
 * Wird vollständig aus den Sektionen abgeleitet
 */
export const ASSIGNMENT_PATH = extractPaths(ASSIGNMENT_PATHS_SECTIONS);

/**
 * Die Konfigurationen für alle Assignments
 * Wird vollständig aus den Sektionen abgeleitet
 * (Ersetzt das alte ASSIGNMENT_DEFAULTS)
 */
export const ASSIGNMENT_DEFAULTS = extractConfigs(ASSIGNMENT_PATHS_SECTIONS);

// ============================================
// ABGELEITETE TYPEN
// ============================================

/** Typ: Alle möglichen Keys (z.B. 'MM_Chairman_A' | 'WM_Chairman' | ...) */
export type AssignmentPathKey = keyof typeof ASSIGNMENT_PATH;
// Alle Keys als Array
export const ASSIGNMENT_PATH_KEYS = Object.keys(
  ASSIGNMENT_PATH
) as AssignmentPathKey[];

/** Typ: Alle möglichen Pfad-Werte */
//export type AssignmentPathValue = typeof ASSIGNMENT_PATH[AssignmentPathKey];

/** Typ: Alle möglichen Konfigurationen */
//export type AssignmentConfigValue = typeof ASSIGNMENT_DEFAULTS[AssignmentPathKey];

// ============================================
// SEKTIONSSPEZIFISCHE TYPEN
// ============================================

/* export type MidweekChairmanKeys =
  keyof typeof ASSIGNMENT_PATHS_SECTIONS.MIDWEEK_CHAIRMAN;
export type MidweekOpeningKeys =
  keyof typeof ASSIGNMENT_PATHS_SECTIONS.MIDWEEK_OPENING;
export type MidweekTGWKeys = keyof typeof ASSIGNMENT_PATHS_SECTIONS.MIDWEEK_TGW;
export type MidweekAYFPart1Keys =
  keyof typeof ASSIGNMENT_PATHS_SECTIONS.MIDWEEK_AYF_PART1;
export type MidweekAYFPart2Keys =
  keyof typeof ASSIGNMENT_PATHS_SECTIONS.MIDWEEK_AYF_PART2;
export type MidweekAYFPart3Keys =
  keyof typeof ASSIGNMENT_PATHS_SECTIONS.MIDWEEK_AYF_PART3;
export type MidweekAYFPart4Keys =
  keyof typeof ASSIGNMENT_PATHS_SECTIONS.MIDWEEK_AYF_PART4;
 */
/* export type MidweekAYFKeys =
  | MidweekAYFPart1Keys
  | MidweekAYFPart2Keys
  | MidweekAYFPart3Keys
  | MidweekAYFPart4Keys; */

/* export type MidweekLCKeys = keyof typeof ASSIGNMENT_PATHS_SECTIONS.MIDWEEK_LC;
export type MidweekCBSKeys = keyof typeof ASSIGNMENT_PATHS_SECTIONS.MIDWEEK_CBS;
export type MidweekClosingKeys =
  keyof typeof ASSIGNMENT_PATHS_SECTIONS.MIDWEEK_CLOSING;

export type WeekendOpeningKeys =
  keyof typeof ASSIGNMENT_PATHS_SECTIONS.WEEKEND_OPENING;
export type WeekendTalkKeys =
  keyof typeof ASSIGNMENT_PATHS_SECTIONS.WEEKEND_TALK;
export type WeekendWTStudyKeys =
  keyof typeof ASSIGNMENT_PATHS_SECTIONS.WEEKEND_WT_STUDY;
export type WeekendClosingKeys =
  keyof typeof ASSIGNMENT_PATHS_SECTIONS.WEEKEND_CLOSING; */

// Kombinierte Midweek/Weekend Keys
/* export type MidweekKeys =
  | MidweekChairmanKeys
  | MidweekOpeningKeys
  | MidweekTGWKeys
  | MidweekAYFKeys
  | MidweekLCKeys
  | MidweekCBSKeys
  | MidweekClosingKeys;

export type WeekendKeys =
  | WeekendOpeningKeys
  | WeekendTalkKeys
  | WeekendWTStudyKeys
  | WeekendClosingKeys; */

// ============================================
// PRAKTISCHE VERWENDUNGSBEISPIELE
// ============================================

// Pfad abrufen
/* const path: AssignmentPathValue = ASSIGNMENT_PATH['MM_TGWTalk'];

// Konfiguration abrufen
const config: AssignmentConfigValue = ASSIGNMENT_DEFAULTS['MM_TGWTalk'];

// Mit typsicherer Rückgabe
const getPath = (key: AssignmentPathKey): AssignmentPathValue => {
  return ASSIGNMENT_PATH[key];
};

const getConfig = (key: AssignmentPathKey): AssignmentConfigValue => {
  return ASSIGNMENT_DEFAULTS[key];
};

// Nur Midweek-Keys
const getMidweekPath = (key: MidweekKeys): AssignmentPathValue => {
  return ASSIGNMENT_PATH[key];
};

const getMidweekConfig = (key: MidweekKeys): AssignmentConfigValue => {
  return ASSIGNMENT_DEFAULTS[key];
};

// Direkter Zugriff auf vollständige Daten einer Sektion
const getMidweekTGWData = (key: MidweekTGWKeys) => {
  return ASSIGNMENT_PATHS_SECTIONS.MIDWEEK_TGW[key];
}; */
// ============================================
// SECTION-NAMES - ABGELEITET AUS ASSIGNMENT_PATHS_SECTIONS!
// ============================================

/**
 * Typsicher abgeleitetes Objekt aus ASSIGNMENT_PATHS_SECTIONS
 * KEINE Duplikate - Single Source of Truth!
 * Autocomplete: AssignmentSectionName.MIDWEEK_CHAIRMAN
 */
export const AssignmentSectionName = Object.keys(
  ASSIGNMENT_PATHS_SECTIONS
).reduce(
  (acc, key) => ({
    ...acc,
    [key]: key,
  }),
  {} as Record<
    keyof typeof ASSIGNMENT_PATHS_SECTIONS,
    keyof typeof ASSIGNMENT_PATHS_SECTIONS
  >
);

/**
 * Typ abgeleitet vom AssignmentSectionName Objekt
 */
export type SectionName = keyof typeof AssignmentSectionName;

/**
 * Array mit allen Sektionsnamen (für Iterationen)
 */
export const SECTION_NAMES: readonly SectionName[] = Object.keys(
  AssignmentSectionName
) as SectionName[];

const getSectionKeys = <K extends keyof typeof ASSIGNMENT_PATHS_SECTIONS>(
  ...sectionNames: K[]
): Set<AssignmentPathKey> => {
  return new Set(
    sectionNames.flatMap(
      (sectionName) =>
        Object.keys(
          ASSIGNMENT_PATHS_SECTIONS[sectionName]
        ) as AssignmentPathKey[]
    )
  );
};

// ============================================
// MAIN: Week-Spezifische Assignment-Keys (MIT SEKTIONEN)
// ============================================

/**
 * Map mit Week-Typen und ihren erlaubten Assignment-Keys
 * Verwendet getSectionKeys mit AssignmentSectionName für vollständige Typsicherheit
 */
export const WEEK_TYPE_ASSIGNMENT_PATH_KEYS = new Map<
  Week,
  Set<AssignmentPathKey>
>([
  // NORMAL: Alle Assignments erlaubt
  [Week.NORMAL, new Set(...ASSIGNMENT_PATH_KEYS)],

  // CO_VISIT: Alle außer CBS und WT Study Reader
  [
    Week.CO_VISIT,
    new Set(
      ASSIGNMENT_PATH_KEYS.filter(
        (key) =>
          ![
            'MM_LCCBSConductor',
            'MM_LCCBSReader',
            'WM_WTStudy_Reader',
          ].includes(key) && !key.endsWith('_B')
      )
    ),
  ],

  // ASSEMBLY: Keine Assignments (wird anderswo gemacht)
  [Week.ASSEMBLY, new Set<AssignmentPathKey>()],

  // CONVENTION: Keine Assignments (wird anderswo gemacht)
  [Week.CONVENTION, new Set<AssignmentPathKey>()],

  // MEMORIAL: Keine Assignments (wird anderswo gemacht)
  [Week.MEMORIAL, new Set<AssignmentPathKey>()],

  // SPECIAL_TALK: Alle Assignments erlaubt
  [Week.SPECIAL_TALK, new Set(...ASSIGNMENT_PATH_KEYS)],

  // TREASURES_PART: Chairman + TGW
  [
    Week.TREASURES_PART,
    getSectionKeys(
      AssignmentSectionName.MM_CHAIRMAN,
      AssignmentSectionName.MM_TGW
    ),
  ],

  // TREASURES_STUDENTS: Chairman + TGW + AYF
  [
    Week.TREASURES_STUDENTS,
    getSectionKeys(
      AssignmentSectionName.MM_CHAIRMAN,
      AssignmentSectionName.MM_TGW,
      AssignmentSectionName.MM_AYF_PART
    ),
  ],

  // STUDENTS_ASSIGNMENTS: Chairman + AYF only
  [
    Week.STUDENTS_ASSIGNMENTS,
    getSectionKeys(
      AssignmentSectionName.MM_CHAIRMAN,
      AssignmentSectionName.MM_AYF_PART
    ),
  ],

  // STUDENTS_LIVING: Chairman + AYF + Living
  [
    Week.STUDENTS_LIVING,
    getSectionKeys(
      AssignmentSectionName.MM_CHAIRMAN,
      AssignmentSectionName.MM_AYF_PART,
      AssignmentSectionName.MM_LC
    ),
  ],

  // LIVING_PART: Chairman + Living
  [
    Week.LIVING_PART,
    getSectionKeys(
      AssignmentSectionName.MM_CHAIRMAN,
      AssignmentSectionName.MM_LC
    ),
  ],

  // PUBLIC_TALK: Chairman + Speaker only
  [
    Week.PUBLIC_TALK,
    getSectionKeys(
      AssignmentSectionName.WM_TALK,
      AssignmentSectionName.WM_OPENING
    ),
  ],

  // WATCHTOWER_STUDY: WT Study only
  [Week.WATCHTOWER_STUDY, getSectionKeys(AssignmentSectionName.WM_WT_STUDY)],

  // SPECIAL_TALK_ONLY: Chairman + Speaker only
  [
    Week.SPECIAL_TALK_ONLY,
    getSectionKeys(
      AssignmentSectionName.WM_TALK,
      AssignmentSectionName.WM_OPENING
    ),
  ],

  // NO_MEETING: Keine Assignments
  [Week.NO_MEETING, new Set<AssignmentPathKey>()],
]);

/* export const ASSIGNMENT_PATH = {
  MM_Chairman_A: 'midweek_meeting.chairman.main_hall',
  MM_Chairman_B: 'midweek_meeting.chairman.aux_class_1',
  MM_OpeningPrayer: 'midweek_meeting.opening_prayer',
  MM_TGWTalk: 'midweek_meeting.tgw_talk',
  MM_TGWGems: 'midweek_meeting.tgw_gems',
  MM_TGWBibleReading_A: 'midweek_meeting.tgw_bible_reading.main_hall',
  MM_TGWBibleReading_B: 'midweek_meeting.tgw_bible_reading.aux_class_1',
  MM_AYFPart1_Student_A: 'midweek_meeting.ayf_part1.main_hall.student',
  MM_AYFPart1_Assistant_A: 'midweek_meeting.ayf_part1.main_hall.assistant',
  MM_AYFPart1_Student_B: 'midweek_meeting.ayf_part1.aux_class_1.student',
  MM_AYFPart1_Assistant_B: 'midweek_meeting.ayf_part1.aux_class_1.assistant',
  MM_AYFPart2_Student_A: 'midweek_meeting.ayf_part2.main_hall.student',
  MM_AYFPart2_Assistant_A: 'midweek_meeting.ayf_part2.main_hall.assistant',
  MM_AYFPart2_Student_B: 'midweek_meeting.ayf_part2.aux_class_1.student',
  MM_AYFPart2_Assistant_B: 'midweek_meeting.ayf_part2.aux_class_1.assistant',
  MM_AYFPart3_Student_A: 'midweek_meeting.ayf_part3.main_hall.student',
  MM_AYFPart3_Assistant_A: 'midweek_meeting.ayf_part3.main_hall.assistant',
  MM_AYFPart3_Student_B: 'midweek_meeting.ayf_part3.aux_class_1.student',
  MM_AYFPart3_Assistant_B: 'midweek_meeting.ayf_part3.aux_class_1.assistant',
  MM_AYFPart4_Student_A: 'midweek_meeting.ayf_part4.main_hall.student',
  MM_AYFPart4_Assistant_A: 'midweek_meeting.ayf_part4.main_hall.assistant',
  MM_AYFPart4_Student_B: 'midweek_meeting.ayf_part4.aux_class_1.student',
  MM_AYFPart4_Assistant_B: 'midweek_meeting.ayf_part4.aux_class_1.assistant',
  MM_LCPart1: 'midweek_meeting.lc_part1',
  MM_LCPart2: 'midweek_meeting.lc_part2',
  MM_LCPart3: 'midweek_meeting.lc_part3',
  MM_LCCBSConductor: 'midweek_meeting.lc_cbs.conductor',
  MM_LCCBSReader: 'midweek_meeting.lc_cbs.reader',
  MM_ClosingPrayer: 'midweek_meeting.closing_prayer',
  MM_CircuitOverseer: 'midweek_meeting.circuit_overseer',
  WM_Chairman: 'weekend_meeting.chairman',
  WM_OpeningPrayer: 'weekend_meeting.opening_prayer',
  WM_Speaker_Part1: 'weekend_meeting.speaker.part_1',
  WM_Speaker_Part2: 'weekend_meeting.speaker.part_2',
  WM_WTStudy_Conductor: 'weekend_meeting.wt_study.conductor',
  WM_WTStudy_Reader: 'weekend_meeting.wt_study.reader',
  WM_ClosingPrayer: 'weekend_meeting.closing_prayer',
  WM_CircuitOverseer: 'weekend_meeting.circuit_overseer',
  WM_SubstituteSpeaker: 'weekend_meeting.speaker.substitute',
  WM_Speaker_Outgoing: 'weekend_meeting.outgoing_talks',
}; */

/* export type AssignmentConfigType = {
  code: AssignmentCode;
  elderOnly?: boolean;
};
 */
// Corresponding Assignmentcodes to Assignment_Keys
/* export const ASSIGNMENT_DEFAULTS: Record<string, AssignmentConfigType> = {
  // --- CHAIRMAN ---
  MM_Chairman_A: { code: AssignmentCode.MM_Chairman },
  MM_Chairman_B: { code: AssignmentCode.MM_AuxiliaryCounselor },

  // --- PRAYER ---
  MM_OpeningPrayer: { code: AssignmentCode.MM_Prayer },
  MM_ClosingPrayer: { code: AssignmentCode.MM_Prayer },

  // --- TREASURES ---
  MM_TGWTalk: { code: AssignmentCode.MM_TGWTalk },
  MM_TGWGems: { code: AssignmentCode.MM_TGWGems },
  MM_TGWBibleReading_A: { code: AssignmentCode.MM_BibleReading },
  MM_TGWBibleReading_B: { code: AssignmentCode.MM_BibleReading },

  // --- LIVING AS CHRISTIANS ---
  MM_LCPart1: { code: AssignmentCode.MM_LCPart },
  MM_LCPart2: { code: AssignmentCode.MM_LCPart },
  MM_LCPart3: { code: AssignmentCode.MM_LCPart },

  // --- CBS ---
  MM_LCCBSConductor: { code: AssignmentCode.MM_CBSConductor },
  MM_LCCBSReader: { code: AssignmentCode.MM_CBSReader },

  // --- WEEKEND ---
  WM_Chairman: { code: AssignmentCode.WM_Chairman },
  WM_OpeningPrayer: { code: AssignmentCode.WM_Prayer },
  WM_Speaker_Part1: { code: AssignmentCode.WM_Speaker },
  WM_Speaker_Part2: { code: AssignmentCode.WM_Speaker },
  WM_ClosingPrayer: { code: AssignmentCode.WM_Prayer },
  WM_WTStudy_Conductor: { code: AssignmentCode.WM_WTStudyConductor },
  WM_WTStudy_Reader: { code: AssignmentCode.WM_WTStudyReader },
};
 */
export const BROTHER_ASSIGNMENT = [
  AssignmentCode.MM_Chairman,
  AssignmentCode.MM_AuxiliaryCounselor,
  AssignmentCode.MM_Prayer,
  AssignmentCode.MM_TGWTalk,
  AssignmentCode.MM_TGWGems,
  AssignmentCode.MM_LCPart,
  AssignmentCode.MM_CBSConductor,
  AssignmentCode.MM_CBSReader,
  AssignmentCode.WM_Chairman,
  AssignmentCode.WM_Prayer,
  AssignmentCode.WM_Speaker,
  AssignmentCode.WM_SpeakerSymposium,
  AssignmentCode.WM_WTStudyConductor,
  AssignmentCode.WM_WTStudyReader,
];

export const STUDENT_ASSIGNMENT = [
  AssignmentCode.MM_StartingConversation,
  AssignmentCode.MM_FollowingUp,
  AssignmentCode.MM_MakingDisciples,
  AssignmentCode.MM_ExplainingBeliefs,
];

export const ASSISTANT_ASSIGNMENT = [
  ...STUDENT_ASSIGNMENT,
  AssignmentCode.MM_AssistantOnly,
];

export const STORAGE_KEY = {
  source_import: 'organized_jw_import_next_sync',
};

export const WEEK_TYPE_WITH_MEETING = [
  Week.NORMAL,
  Week.CO_VISIT,
  Week.TREASURES_PART,
  Week.TREASURES_STUDENTS,
  Week.STUDENTS_ASSIGNMENTS,
  Week.STUDENTS_LIVING,
  Week.LIVING_PART,
  Week.SPECIAL_TALK,
  Week.PUBLIC_TALK,
  Week.WATCHTOWER_STUDY,
  Week.SPECIAL_TALK_ONLY,
];

export const WEEK_TYPE_NO_MEETING = [
  Week.ASSEMBLY,
  Week.CONVENTION,
  Week.NO_MEETING,
  Week.MEMORIAL,
];

export const WEEK_TYPE_LANGUAGE_GROUPS = [
  Week.TREASURES_PART,
  Week.TREASURES_STUDENTS,
  Week.STUDENTS_ASSIGNMENTS,
  Week.STUDENTS_LIVING,
  Week.LIVING_PART,
  Week.PUBLIC_TALK,
  Week.SPECIAL_TALK_ONLY,
  Week.WATCHTOWER_STUDY,
];

export const MIDWEEK_FULL = [Week.NORMAL, Week.CO_VISIT];

export const MIDWEEK_WITH_TREASURES = [
  Week.NORMAL,
  Week.CO_VISIT,
  Week.TREASURES_PART,
  Week.TREASURES_STUDENTS,
  Week.STUDENTS_ASSIGNMENTS,
  Week.STUDENTS_LIVING,
];

export const MIDWEEK_WITH_TREASURES_TALKS = [
  Week.NORMAL,
  Week.CO_VISIT,
  Week.TREASURES_PART,
  Week.TREASURES_STUDENTS,
];

export const MIDWEEK_WITH_STUDENTS = [
  Week.NORMAL,
  Week.CO_VISIT,
  Week.TREASURES_STUDENTS,
  Week.STUDENTS_ASSIGNMENTS,
  Week.STUDENTS_LIVING,
];

export const MIDWEEK_WITH_STUDENTS_LANGUAGE_GROUP = [
  Week.TREASURES_STUDENTS,
  Week.STUDENTS_ASSIGNMENTS,
  Week.STUDENTS_LIVING,
];

export const MIDWEEK_WITH_LIVING = [
  Week.NORMAL,
  Week.CO_VISIT,
  Week.STUDENTS_LIVING,
  Week.LIVING_PART,
];

export const MIDWEEK_WITH_CBS = [
  Week.NORMAL,
  Week.STUDENTS_LIVING,
  Week.LIVING_PART,
];

export const WEEKEND_FULL = [Week.NORMAL, Week.CO_VISIT, Week.SPECIAL_TALK];

export const WEEKEND_WITH_TALKS = [
  Week.NORMAL,
  Week.CO_VISIT,
  Week.PUBLIC_TALK,
  Week.SPECIAL_TALK,
  Week.SPECIAL_TALK_ONLY,
];

export const WEEKEND_WITH_TALKS_NOCO = [
  Week.NORMAL,
  Week.PUBLIC_TALK,
  Week.SPECIAL_TALK,
  Week.SPECIAL_TALK_ONLY,
];

export const WEEKEND_WITH_TALKS_ONLY = [
  Week.PUBLIC_TALK,
  Week.SPECIAL_TALK_ONLY,
];

export const WEEKEND_WITH_STANDARD_TALK = [Week.NORMAL, Week.PUBLIC_TALK];

export const WEEKEND_WITH_SPECIAL_TALK = [
  Week.SPECIAL_TALK,
  Week.SPECIAL_TALK_ONLY,
];

export const WEEKEND_WITH_WTSTUDY = [
  Week.NORMAL,
  Week.CO_VISIT,
  Week.SPECIAL_TALK,
  Week.WATCHTOWER_STUDY,
];

export const TIMER_KEY = 'organized_timer';

export const ASSIGNMENTS_STRUCTURE = [
  {
    id: 'midweekMeeting',
    items: [
      { code: AssignmentCode.MM_Chairman },
      { code: AssignmentCode.MM_Prayer },
      { code: AssignmentCode.MM_AuxiliaryCounselor },
    ],
  },
  {
    id: 'treasuresPart',
    items: [
      { code: AssignmentCode.MM_TGWTalk },
      { code: AssignmentCode.MM_TGWGems },
      { code: AssignmentCode.MM_BibleReading },
    ],
  },
  {
    id: 'applyFieldMinistryPart',
    items: [
      { code: AssignmentCode.MM_Discussion },
      { code: AssignmentCode.MM_StartingConversation },
      { code: AssignmentCode.MM_FollowingUp },
      { code: AssignmentCode.MM_MakingDisciples },
      { code: AssignmentCode.MM_ExplainingBeliefs },
      { code: AssignmentCode.MM_Talk },
      {
        code: AssignmentCode.MM_AssistantOnly,
        borderTop: true,
      },
    ],
  },
  {
    id: 'livingPart',
    items: [
      { code: AssignmentCode.MM_LCPart },
      { code: AssignmentCode.MM_CBSConductor },
      { code: AssignmentCode.MM_CBSReader },
    ],
  },
  {
    id: 'weekendMeeting',
    items: [
      { code: AssignmentCode.WM_Chairman },
      { code: AssignmentCode.WM_Prayer },
      { code: AssignmentCode.WM_Speaker },
      { code: AssignmentCode.WM_SpeakerSymposium },
      { code: AssignmentCode.WM_WTStudyConductor },
      { code: AssignmentCode.WM_WTStudyReader },
    ],
  },
  {
    id: 'ministry',
    items: [{ code: AssignmentCode.MINISTRY_HOURS_CREDIT }],
  },
];

const getCodes = (...ids: string[]): Set<AssignmentCode> => {
  const codeSet = new Set<AssignmentCode>();

  ASSIGNMENTS_STRUCTURE.filter((section) => ids.includes(section.id)).forEach(
    (section) => {
      section.items.forEach((item) => {
        codeSet.add(item.code);
      });
    }
  );

  return codeSet;
};
const ALL_ASSIGNMENTCODES = new Set(
  Object.values(AssignmentCode).filter(
    (v): v is AssignmentCode => typeof v === 'number'
  )
);

export const WEEK_TYPE_ASSIGNMENT_CODES = new Map<Week, Set<AssignmentCode>>([
  [Week.NORMAL, ALL_ASSIGNMENTCODES],
  [
    Week.CO_VISIT,
    new Set(
      [...ALL_ASSIGNMENTCODES].filter(
        (c) =>
          ![
            AssignmentCode.MM_CBSConductor,
            AssignmentCode.MM_CBSReader,
            AssignmentCode.WM_WTStudyReader,
          ].includes(c)
      )
    ),
  ],

  [Week.ASSEMBLY, new Set<AssignmentCode>()],

  [Week.CONVENTION, new Set<AssignmentCode>()],

  [Week.MEMORIAL, new Set<AssignmentCode>()],

  [Week.SPECIAL_TALK, ALL_ASSIGNMENTCODES],

  [
    Week.TREASURES_PART,
    new Set([AssignmentCode.MM_Chairman, ...getCodes('treasuresPart')]),
  ],
  [
    Week.TREASURES_STUDENTS,
    new Set([
      AssignmentCode.MM_Chairman,
      ...getCodes('treasuresPart', 'applyFieldMinistryPart'),
    ]),
  ],
  [
    Week.STUDENTS_ASSIGNMENTS,
    new Set([
      AssignmentCode.MM_Chairman,
      ...getCodes('applyFieldMinistryPart'),
    ]),
  ],
  [
    Week.STUDENTS_LIVING,
    new Set([
      AssignmentCode.MM_Chairman,
      ...getCodes('applyFieldMinistryPart', 'livingPart'),
    ]),
  ],
  [
    Week.LIVING_PART,
    new Set([AssignmentCode.MM_Chairman, ...getCodes('livingPart')]),
  ],
  [
    Week.PUBLIC_TALK,
    new Set([AssignmentCode.WM_Chairman, AssignmentCode.WM_Speaker]),
  ],
  [
    Week.WATCHTOWER_STUDY,
    new Set([
      AssignmentCode.WM_WTStudyConductor,
      AssignmentCode.WM_WTStudyReader,
    ]),
  ],
  [
    Week.SPECIAL_TALK_ONLY,
    new Set([AssignmentCode.WM_Chairman, AssignmentCode.WM_Speaker]),
  ],
  [Week.NO_MEETING, new Set<AssignmentCode>()],
]);
