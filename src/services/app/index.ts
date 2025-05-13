import { store } from '@states/index';
import {
  getTranslation,
  handleAppChangeLanguage,
} from '@services/i18n/translation';
import { appLangState } from '@states/app';
import { userSignOut } from '@services/firebase/auth';
import {
  disconnectCongAccount,
  displaySnackNotification,
  setRootModalOpen,
} from '@services/states/app';
import { dbWeekTypeUpdate } from '@services/dexie/weekType';
import { dbAssignmentUpdate } from '@services/dexie/assignment';
import { dbAppDelete } from '@services/dexie/app';
import { publicTalksBuildList } from '@services/i18n/public_talks';
import { setPublicTalks } from '@services/states/publicTalks';
import { songsBuildList } from '@services/i18n/songs';
import { setSongs } from '@services/states/songs';
import { schedulesBuildHistoryList } from './schedules';
import { setAssignmentsHistory } from '@services/states/schedules';
import {
  dbSchedAuxClassUpdate,
  dbSchedUpdateOutgoingTalksFields,
} from '@services/dexie/schedules';
import { JWLangState } from '@states/settings';
import { LANGUAGE_LIST } from '@constants/index';
import { dbMetadataDefault } from '@services/dexie/metadata';
import {
  dbAppSettingsGet,
  dbAppSettingsUpdateWithoutNotice,
  dbConvertAutoAssignPrayers,
} from '@services/dexie/settings';
import { dbRemoveDuplicateReports } from '@services/dexie/cong_field_service_reports';
import { LanguageItem } from '@definition/app';

export const loadApp = () => {
  const appLang = store.get(appLangState);
  const jwLang = store.get(JWLangState);

  const sourceLang =
    LANGUAGE_LIST.find((record) => record.code.toUpperCase() === jwLang)
      ?.threeLettersCode || 'eng';

  handleAppChangeLanguage(appLang);

  // load songs
  const songs = songsBuildList(sourceLang);
  setSongs(songs);

  // load public talks
  const talks = publicTalksBuildList(sourceLang);
  setPublicTalks(talks);

  // load assignment history
  const history = schedulesBuildHistoryList();
  setAssignmentsHistory(history);
};

export const runUpdater = async () => {
  await dbWeekTypeUpdate();
  await dbAssignmentUpdate();
  await dbSchedAuxClassUpdate();
  await dbRemoveDuplicateReports();
  await dbMetadataDefault();
  await dbConvertAutoAssignPrayers();
  await dbSchedUpdateOutgoingTalksFields();
};

export const userLogoutSuccess = async () => {
  await userSignOut();
  disconnectCongAccount();
  displaySnackNotification({
    header: getTranslation({ key: 'tr_errorTitle' }),
    message: getTranslation({ key: 'logoutSuccess' }),
    severity: 'success',
  });
};

export const handleDeleteDatabase = async () => {
  setRootModalOpen(true);
  await dbAppDelete();
  await userSignOut();

  const freezeKeys = ['userConsent', 'organized_whatsnew', 'theme', 'app_font'];

  const storageKeys = Object.keys(localStorage).filter(
    (key) => !freezeKeys.includes(key)
  );

  for (const key of storageKeys) {
    localStorage.removeItem(key);
  }

  window.location.href = './';
};

export const checkPwaUpdate = () => {
  if ('serviceWorker' in navigator) {
    const swUrl = `${import.meta.env.BASE_URL}service-worker.js`;
    navigator.serviceWorker.register(swUrl).then((reg) => {
      reg.update();
    });
  }
};

export const getUserDataView = <T extends { type: string }>(
  data: T[],
  dataView: string
) => {
  return data.find((record) => record.type === dataView);
};

const convertBrowserLanguage = () => {
  let found: LanguageItem | undefined;

  const languages = navigator.languages;

  for (const language of languages) {
    found = LANGUAGE_LIST.find((record) =>
      record.browserLangCode?.some(
        (lang) => lang.toLowerCase() === language.toLowerCase()
      )
    );

    if (found) break;
  }

  return found;
};

const setSourceLanguageDefault = async (lang: string) => {
  const settings = await dbAppSettingsGet();

  const sourceLanguages = structuredClone(
    settings.cong_settings.source_material.language
  );

  const main = sourceLanguages.find((record) => record.type === 'main');
  main.value = lang.toUpperCase();
  main.updatedAt = new Date().toISOString();

  await dbAppSettingsUpdateWithoutNotice({
    'cong_settings.source_material.language': sourceLanguages,
  });
};

export const getAppLang = () => {
  let appLang = localStorage?.getItem('ui_lang');

  if (!appLang) {
    const browserLang = convertBrowserLanguage();

    if (browserLang) {
      appLang = browserLang.threeLettersCode;

      // settings source language
      setSourceLanguageDefault(browserLang.code);
    }

    if (!browserLang) {
      appLang = 'eng';
    }

    localStorage?.setItem('ui_lang', appLang);
  }

  return appLang;
};
