import { promiseGetRecoil } from 'recoil-outside';
import { getTranslation, handleAppChangeLanguage } from '@services/i18n/translation';
import { appLangState } from '@states/app';
import { userSignOut } from '@services/firebase/auth';
import { disconnectCongAccount, displaySnackNotification, setRootModalOpen } from '@services/recoil/app';
import { dbWeekTypeUpdate } from '@services/dexie/weekType';
import { dbAssignmentUpdate } from '@services/dexie/assignment';
import { dbAppDelete } from '@services/dexie/app';
import { publicTalksBuildList } from '@services/i18n/public_talks';
import { setPublicTalks } from '@services/recoil/publicTalks';

export const loadApp = async () => {
  const appLang = await promiseGetRecoil(appLangState);
  handleAppChangeLanguage(appLang);

  // load public talks
  const talks = await publicTalksBuildList(appLang);
  await setPublicTalks(talks);
};

export const runUpdater = async () => {
  await dbWeekTypeUpdate();
  await dbAssignmentUpdate();
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
  localStorage.removeItem('email');
  window.location.href = './';
};
