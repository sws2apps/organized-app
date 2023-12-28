export const LANGUAGE_LIST = [
  { code: 'x', locale: 'de-DE', name: 'Deutsch', isUI: true, isSource: true, hasEPUB: true },
  { code: 'e', locale: 'en', name: 'English', isUI: true, isSource: true, hasEPUB: true },
  { code: 'mg', locale: 'mg-MG', name: 'Malagasy', isUI: true, isSource: true, hasEPUB: true },
  { code: 't', locale: 'pt-BR', name: 'Português (Brasil)', isUI: true, isSource: true, hasEPUB: false },
  { code: 'tnd', locale: 'mg-TND', name: 'Tandroy', isUI: false, isSource: true, hasEPUB: true },
  { code: 'tnk', locale: 'mg-TNK', name: 'Tankarana', isUI: false, isSource: true, hasEPUB: true },
  { code: 'ttm', locale: 'mg-TTM', name: 'Tenin’ny Tanana Malagasy', isUI: true, isSource: true, hasEPUB: false },
  { code: 'vz', locale: 'mg-VZ', name: 'Vezo', isUI: false, isSource: true, hasEPUB: true },
  { code: 'k', locale: 'uk-UA', name: 'Українська', isUI: true, isSource: true, hasEPUB: true },
];

export const CPE_ROLES = [
  'admin',
  'coordinator',
  'public_talk_coordinator',
  'lmmo',
  'lmmo-backup',
  'secretary',
  'elder',
  'ms',
  'publisher',
  'view_meeting_schedule',
];

export const VIP_ROLES = ['coordinator', 'public_talk_coordinator', 'lmmo', 'lmmo-backup', 'secretary'];

export const POCKET_ROLES = ['elder', 'ms', 'publisher', 'view_meeting_schedule'];
