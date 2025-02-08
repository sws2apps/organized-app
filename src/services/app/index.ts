import { promiseGetRecoil } from 'recoil-outside';
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
} from '@services/recoil/app';
import { dbWeekTypeUpdate } from '@services/dexie/weekType';
import { dbAssignmentUpdate } from '@services/dexie/assignment';
import { dbAppDelete } from '@services/dexie/app';
import { publicTalksBuildList } from '@services/i18n/public_talks';
import { setPublicTalks } from '@services/recoil/publicTalks';
import { songsBuildList } from '@services/i18n/songs';
import { setSongs } from '@services/recoil/songs';
import { schedulesBuildHistoryList } from './schedules';
import { setAssignmentsHistory } from '@services/recoil/schedules';
import { dbSchedAuxClassUpdate } from '@services/dexie/schedules';
import { dbRemoveDuplicateReports } from '@services/dexie/cong_field_service_reports';
import { JWLangState } from '@states/settings';
import { LANGUAGE_LIST } from '@constants/index';
import { dbMetadataDefault } from '@services/dexie/metadata';

export const loadApp = async () => {
  const appLang = await promiseGetRecoil(appLangState);
  const jwLang = await promiseGetRecoil(JWLangState);

  const sourceLang =
    LANGUAGE_LIST.find((record) => record.code.toUpperCase() === jwLang)
      ?.threeLettersCode || 'eng';

  handleAppChangeLanguage(appLang);

  // load songs
  const songs = songsBuildList(sourceLang);
  await setSongs(songs);

  // load public talks
  const talks = publicTalksBuildList(sourceLang);
  await setPublicTalks(talks);

  // load assignment history
  const history = await schedulesBuildHistoryList();
  await setAssignmentsHistory(history);
};

export const runUpdater = async () => {
  await dbWeekTypeUpdate();
  await dbAssignmentUpdate();
  await dbSchedAuxClassUpdate();
  await dbRemoveDuplicateReports();
  await dbMetadataDefault();
};

export const userLogoutSuccess = async () => {
  await userSignOut();
  await disconnectCongAccount();
  await displaySnackNotification({
    header: getTranslation({ key: 'tr_errorTitle' }),
    message: getTranslation({ key: 'logoutSuccess' }),
    severity: 'success',
  });
};

export const handleDeleteDatabase = async () => {
  setRootModalOpen(true);
  await dbAppDelete();
  await userSignOut();

  const freezeKeys = [
    'userConsent',
    'organized_whatsnew',
    'theme',
    'ui_lang',
    'app_font',
  ];

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

export const getAppLang = () => {
  let appLang = localStorage?.getItem('ui_lang') || 'eng';

  if (appLang === 'en') {
    appLang = 'eng';
    localStorage?.setItem('ui_lang', 'eng');
  }

  if (appLang.includes('-')) {
    appLang =
      LANGUAGE_LIST.find((record) => record.locale === appLang)
        ?.threeLettersCode || 'eng';

    localStorage?.setItem('ui_lang', appLang);
  }

  return appLang;
};
