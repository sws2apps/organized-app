import { promiseGetRecoil } from 'recoil-outside';
import { checkCurrentWeek, removeSourcesOutdatedRecords } from '@services/dexie/sources';
import { accountTypeState, isMeetingEditorRoleState } from '@states/settings';
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
import { resetPersons } from '@services/dexie/persons';
import { mergeUserFieldServiceReportsFromBackup } from '@services/dexie/userFieldSericeReports';
import { deleteAppDb } from '@services/dexie/app';
import backupWorkerInstance from '@services/worker/backupWorker';

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

  await setCongAccountConnected(true);
  await setCongID(cong_id);

  // save congregation update if any
  const obj = {};
  obj.firstname = data.firstname;
  obj.lastname = data.lastname;
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

  // update persons if exists
  if (data.cong_persons) {
    await resetPersons(data.cong_persons);
  }

  // update user field service reports if exists
  if (data.user_fieldServiceReports) {
    await mergeUserFieldServiceReportsFromBackup(data.user_fieldServiceReports);
  }

  backupWorkerInstance.setUserRole(cong_role);
  backupWorkerInstance.setCongID(cong_id);
  backupWorkerInstance.setIsCongAccountConnected(true);
  backupWorkerInstance.setAccountType('vip');
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
