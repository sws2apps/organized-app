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
  hi,
  bg,
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
  {
    code: 'lsb',
    locale: 'pt-LSB',
    name: 'Língua brasileira de sinais (Libras)',
    source: true,
    threeLettersCode: 'lsb',
    browserLangCode: ['pt-BR', 'pt'],
    fnsLocale: ptBR,
  },
  {
    code: 'hi',
    locale: 'hi-IN',
    name: 'हिंदी',
    source: true,
    font: 'NotoSans',
    threeLettersCode: 'hin',
    browserLangCode: ['hi-IN', 'hi'],
    fnsLocale: hi,
  },
  {
    code: 'th',
    locale: 'ty-PF',
    name: 'Tahiti',
    source: true,
    threeLettersCode: 'tah',
  },
  {
    code: 'BL',
    locale: 'bg-BG',
    name: 'български',
    source: true,
    threeLettersCode: 'bul',
    fnsLocale: bg,
    browserLangCode: ['bg-BG', 'bg'],
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

export const ASSIGNMENT_PATH = {
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
};

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
