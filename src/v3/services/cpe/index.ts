import { promiseGetRecoil } from 'recoil-outside';
import { checkCurrentWeek, removeSourcesOutdatedRecords } from '@services/dexie/sources';
import { accountTypeState, isMeetingEditorRoleState, settingsState } from '@states/settings';
import { getTranslation, handleAppChangeLanguage } from '@services/i18n/translation';
import { appLangState } from '@states/app';
import { userSignOut } from '@services/firebase/auth';
import {
  disconnectCongAccount,
  displaySnackNotification,
  setCongAccountConnected,
  setCongID,
  setRootModalOpen,
  setUserID,
} from '@services/recoil/app';
import { updateAssignmentType, updateWeekType } from './updater';
import { handleUpdateSetting } from '@services/dexie/settings';
import { deleteAppDb } from '@services/dexie/app';
import worker from '@services/worker/backupWorker';
import { SettingsType } from '@definition/app';

export const loadApp = async () => {
  const isMeetingEditor = await promiseGetRecoil(isMeetingEditorRoleState);
  const accountType = await promiseGetRecoil(accountTypeState);
  const appLang = await promiseGetRecoil(appLangState);

  await removeSourcesOutdatedRecords();

  if (accountType === 'vip' && isMeetingEditor) {
    await checkCurrentWeek();
  }

  handleAppChangeLanguage(appLang);
};

export const runUpdater = async () => {
  await updateWeekType();
  await updateAssignmentType();
};

export const userLogoutSuccess = async () => {
  await userSignOut();
  await disconnectCongAccount();
  await displaySnackNotification({
    message: getTranslation({ key: 'logoutSuccess' }),
  });
};

export const updateUserInfoAfterLogin = async (data) => {
  const { id, cong_id, cong_name, cong_role, cong_number, user_members_delegate, user_local_uid } = data;

  await setCongID(cong_id);
  await setCongAccountConnected(true);

  // save congregation update if any
  const obj = <
    {
      firstname?: string;
      lastname?: string;
      cong_name: string;
      cong_number: string;
      user_members_delegate: [];
      user_local_uid?: string;
      cong_role: [];
      account_type: string;
    }
  >{};

  const settings: SettingsType = await promiseGetRecoil(settingsState);

  if (settings.firstname.updatedAt < data.firstname.updatedAt) {
    obj.firstname = data.firstname;
  }

  if (settings.lastname.updatedAt < data.lastname.updatedAt) {
    obj.lastname = data.lastname;
  }

  obj.cong_name = cong_name;
  obj.cong_number = cong_number;
  obj.user_members_delegate = user_members_delegate;

  if (user_local_uid && user_local_uid !== null) {
    obj.user_local_uid = user_local_uid;
  }

  obj.cong_role = cong_role;
  obj.account_type = 'vip';

  await handleUpdateSetting(obj);

  await setUserID(id);

  worker.postMessage({ field: 'userRole', value: cong_role });
  worker.postMessage({ field: 'userID', value: id });
  worker.postMessage({ field: 'congID', value: cong_id });
  worker.postMessage({ field: 'isCongAccountConnected', value: true });
  worker.postMessage({ field: 'accountType', value: 'vip' });
};

export const handleDeleteDatabase = async () => {
  setRootModalOpen(true);
  await deleteAppDb();
  await userSignOut();
  localStorage.removeItem('email');
  window.location.href = './';
};

export const addRecentPerson = (id) => {
  const recentPersons = localStorage.getItem('recentPersons') ? JSON.parse(localStorage.getItem('recentPersons')) : [];
  const isExistRecent = recentPersons.find((person) => person === id) ? true : false;

  if (!isExistRecent) {
    recentPersons.push(id);
    localStorage.setItem('recentPersons', JSON.stringify(recentPersons));
  }
};
