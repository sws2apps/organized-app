export const SETTINGS_TAB_IDS = [
  'general',
  'meetings',
  'ministry',
  'user-accounts',
  'privacy',
  'app-config',
  'import-export',
] as const;

export type SettingsTabId = (typeof SETTINGS_TAB_IDS)[number];

export const DEFAULT_SETTINGS_TAB: SettingsTabId = 'general';

const LANGUAGE_GROUP_TAB_PREFIX = 'language-group-';

export type LanguageGroupTabId = `${typeof LANGUAGE_GROUP_TAB_PREFIX}${string}`;

export type TabId = SettingsTabId | LanguageGroupTabId;

export const languageGroupTab = (groupId: string): LanguageGroupTabId =>
  `${LANGUAGE_GROUP_TAB_PREFIX}${groupId}`;

export const isLanguageGroupTab = (tab: string): tab is LanguageGroupTabId =>
  tab.startsWith(LANGUAGE_GROUP_TAB_PREFIX) &&
  tab.length > LANGUAGE_GROUP_TAB_PREFIX.length;

export const languageGroupIdFromTab = (tab: LanguageGroupTabId) =>
  tab.slice(LANGUAGE_GROUP_TAB_PREFIX.length);

export const isSettingsTab = (tab: string): tab is TabId =>
  isLanguageGroupTab(tab) ||
  (SETTINGS_TAB_IDS as readonly string[]).includes(tab);
