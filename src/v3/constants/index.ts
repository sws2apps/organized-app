import { FullnameOption } from '@definition/settings';

export const LANGUAGE_LIST = [
  { code: 'x', locale: 'de-DE', name: 'Deutsch' },
  { code: 'e', locale: 'en', name: 'English' },
  { code: 's', locale: 'es-ES', name: 'español' },
  { code: 's', locale: 'es-SSP', name: 'español (de España)' },
  { code: 'f', locale: 'fr-FR', name: 'Français' },
  { code: 'i', locale: 'it-IT', name: 'Italiano' },
  { code: 'mg', locale: 'mg-MG', name: 'Malagasy', fullnameOption: FullnameOption.LAST_BEFORE_FIRST },
  { code: 'p', locale: 'pl-PL', name: 'Polski' },
  { code: 't', locale: 'pt-BR', name: 'Português (Brasil)' },
  { code: 'u', locale: 'ru-RU', name: 'русский' },
  { code: 'm', locale: 'ro-RO', name: 'Română' },
  { code: 'tg', locale: 'tl-PH', name: 'Tagalog' },
  { code: 'tnd', locale: 'mg-TND', name: 'Tandroy', fullnameOption: FullnameOption.LAST_BEFORE_FIRST },
  { code: 'tnk', locale: 'mg-TNK', name: 'Tankarana', fullnameOption: FullnameOption.LAST_BEFORE_FIRST },
  { code: 'ttm', locale: 'mg-TTM', name: 'Tenin’ny Tanana Malagasy', fullnameOption: FullnameOption.LAST_BEFORE_FIRST },
  { code: 'tk', locale: 'tr-TR', name: 'Türkçe' },
  { code: 'tw', locale: 'tw-TW', name: 'Twi' },
  { code: 'vz', locale: 'mg-VZ', name: 'Vezo', fullnameOption: FullnameOption.LAST_BEFORE_FIRST },
  { code: 'k', locale: 'uk-UA', name: 'Українська' },
  { code: 'chs', locale: 'ch-CHS', name: '中文简体（普通话）', font: 'NotoSans' },
  { code: 'j', locale: 'ja-JP', name: '日本語', font: 'NotoSansJP', fullnameOption: FullnameOption.LAST_BEFORE_FIRST },
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

export const VIP_ROLES = ['admin', 'coordinator', 'public_talk_coordinator', 'lmmo', 'secretary'];

export const POCKET_ROLES = ['elder', 'ms', 'publisher', 'view_meeting_schedule'];

export const isDemo = import.meta.env.VITE_APP_MODE === 'DEMO';

export const isDEV = isDemo ? false : import.meta.env.DEV;

export const isQA = import.meta.env.VITE_APP_MODE === 'QA';

export const songsList = Array.from({ length: 158 }, (_, i) => i + 1);
