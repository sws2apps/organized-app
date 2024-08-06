import { AssignmentCode } from '@definition/assignment';
import { FullnameOption } from '@definition/settings';

export const LANGUAGE_LIST = [
  { code: 'x', locale: 'de-DE', name: 'Deutsch' },
  { code: 'e', locale: 'en', name: 'English' },
  { code: 's', locale: 'es-ES', name: 'español' },
  { code: 's', locale: 'es-SSP', name: 'español (de España)' },
  { code: 'f', locale: 'fr-FR', name: 'Français' },
  { code: 'i', locale: 'it-IT', name: 'Italiano' },
  {
    code: 'mg',
    locale: 'mg-MG',
    name: 'Malagasy',
    fullnameOption: FullnameOption.LAST_BEFORE_FIRST,
  },
  { code: 'p', locale: 'pl-PL', name: 'Polski' },
  { code: 't', locale: 'pt-BR', name: 'Português (Brasil)' },
  { code: 'u', locale: 'ru-RU', name: 'русский' },
  { code: 'm', locale: 'ro-RO', name: 'Română' },
  { code: 'tg', locale: 'tl-PH', name: 'Tagalog' },
  {
    code: 'tnd',
    locale: 'mg-TND',
    name: 'Tandroy',
    fullnameOption: FullnameOption.LAST_BEFORE_FIRST,
  },
  {
    code: 'tnk',
    locale: 'mg-TNK',
    name: 'Tankarana',
    fullnameOption: FullnameOption.LAST_BEFORE_FIRST,
  },
  {
    code: 'ttm',
    locale: 'mg-TTM',
    name: 'Tenin’ny Tanana Malagasy',
    fullnameOption: FullnameOption.LAST_BEFORE_FIRST,
  },
  { code: 'tk', locale: 'tr-TR', name: 'Türkçe' },
  { code: 'tw', locale: 'tw-TW', name: 'Twi' },
  {
    code: 'vz',
    locale: 'mg-VZ',
    name: 'Vezo',
    fullnameOption: FullnameOption.LAST_BEFORE_FIRST,
  },
  { code: 'k', locale: 'uk-UA', name: 'Українська' },
  {
    code: 'chs',
    locale: 'ch-CHS',
    name: '中文简体（普通话）',
    font: 'NotoSans',
  },
  {
    code: 'j',
    locale: 'ja-JP',
    name: '日本語',
    font: 'NotoSansJP',
    fullnameOption: FullnameOption.LAST_BEFORE_FIRST,
  },
  { code: 'np', locale: 'ne-NP', name: 'नेपाली', font: 'NotoSans' },
  { code: 'z', locale: 'sv-SE', name: 'Svenska' },
  { code: 'cv', locale: 'ceb-PH', name: 'Cebuano' },
  { code: 'kha', locale: 'mn-MN', name: 'монгол' },
  { code: 'rea', locale: 'hy-AM', name: 'Հայերեն' },
  { code: 'h', locale: 'hy-HU', name: 'magyar' },
  { code: 'tpo', locale: 'pt-PT', name: 'Português (Portugal)' },
].sort((a, b) => a.code.localeCompare(b.code));

export const APP_ROLES = [
  'admin',
  'coordinator',
  'public_talk_coordinator',
  'lmmo',
  'secretary',
  'elder',
  'ms',
  'publisher',
  'view_meeting_schedule',
];

export const VIP_ROLES = [
  'admin',
  'coordinator',
  'public_talk_coordinator',
  'lmmo',
  'secretary',
];

export const POCKET_ROLES = [
  'elder',
  'ms',
  'publisher',
  'view_meeting_schedule',
];

export const isDemo = import.meta.env.VITE_APP_MODE === 'DEMO';

export const isDEV = isDemo ? false : import.meta.env.DEV;

export const isQA = import.meta.env.VITE_APP_MODE === 'QA';

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
  WM_Chairman: 'weekend_meeting.chairman',
  WM_OpeningPrayer: 'weekend_meeting.opening_prayer',
  WM_Speaker_Part1: 'weekend_meeting.speaker.part_1',
  WM_Speaker_Part2: 'weekend_meeting.speaker.part_2',
  WM_WTStudy_Conductor: 'weekend_meeting.wt_study.conductor',
  WM_WTStudy_Reader: 'weekend_meeting.wt_study.reader',
  WM_ClosingPrayer: 'weekend_meeting.closing_prayer',
  WM_CircuitOverseer: 'weekend_meeting.circuit_overseer',
  WM_SubstituteSpeaker: 'weekend_meeting.speaker.substitute',
};

export const BROTHER_ASSIGNMENT = [
  AssignmentCode.MM_Chairman,
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

export const MONTHS = [
  'tr_january',
  'tr_february',
  'tr_march',
  'tr_april',
  'tr_may',
  'tr_june',
  'tr_july',
  'tr_august',
  'tr_september',
  'tr_october',
  'tr_november',
  'tr_december',
];
