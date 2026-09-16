import { store } from '@states/index';
import {
  appFontState,
  appLangState,
  appLocaleState,
  appThemeNameState,
  colorSchemeState,
} from '@states/app';
import { ColorSchemeType } from '@definition/app';
import { COLOR_SCHEMES, LANGUAGE_LIST } from '@constants/index';
import i18n, { refreshLocalesResources } from '@services/i18n';
import { getTranslation } from '@services/i18n/translation';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { dbWeekTypeUpdate } from '@services/dexie/weekType';
import { dbAssignmentUpdate } from '@services/dexie/assignment';
import { dbPublicTalkUpdate } from '@services/dexie/public_talk';
import { dbSongUpdate } from '@services/dexie/songs';
import { schedulesBuildHistoryList } from '@services/app/schedules';
import { setAssignmentsHistory } from '@services/states/schedules';
import { determineAppLocale } from '@services/app';

export const isAppLanguage = (value: string) => {
  return LANGUAGE_LIST.some((record) => record.threeLettersCode === value);
};

export const isColorScheme = (value: string): value is ColorSchemeType => {
  return COLOR_SCHEMES.includes(value as ColorSchemeType);
};

let languageApplyId = 0;

export const appLanguageApply = async (lang: string) => {
  const applyId = ++languageApplyId;

  const language = LANGUAGE_LIST.find(
    (record) => record.threeLettersCode === lang
  );

  localStorage.setItem('ui_lang', lang);

  store.set(appFontState, language?.font || 'Inter');
  store.set(appLangState, lang);

  await refreshLocalesResources();
  await dbWeekTypeUpdate();
  await dbAssignmentUpdate();
  await dbPublicTalkUpdate();
  await dbSongUpdate();

  if (applyId !== languageApplyId) return false;

  await i18n.changeLanguage(lang);

  if (applyId !== languageApplyId) return false;

  document.documentElement.setAttribute(
    'lang',
    getTranslation({ key: 'tr_iso' })
  );

  document.documentElement.setAttribute('dir', language?.direction || 'ltr');

  store.set(appLocaleState, determineAppLocale(lang));

  setAssignmentsHistory(schedulesBuildHistoryList());

  return true;
};

export const appColorSchemeApply = (color: ColorSchemeType) => {
  store.set(colorSchemeState, color);

  const theme = store.get(appThemeNameState);

  document.documentElement.dataset.theme = `${color}-${theme}`;

  const themeColor = getComputedStyle(
    document.documentElement
  ).getPropertyValue('--accent-100');

  document
    .querySelector("meta[name='theme-color']")
    ?.setAttribute('content', themeColor);
};

export const accountAppearanceSave = async (
  key: 'app_language' | 'color_scheme',
  value: string,
  updatedAt = new Date().toISOString()
) => {
  await dbAppSettingsUpdate({
    [`user_settings.${key}`]: { value, updatedAt },
  });
};
