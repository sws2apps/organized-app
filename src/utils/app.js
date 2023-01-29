import { getI18n } from 'react-i18next';
import { promiseGetRecoil, promiseSetRecoil } from 'recoil-outside';
import { dbGetAppSettings, dbUpdateAppSettings } from '../indexedDb/dbAppSettings';
import { checkSrcUpdate, dbGetListWeekType, dbGetYearList } from '../indexedDb/dbSourceMaterial';
import { dbGetListAssType, dbHistoryAssignment } from '../indexedDb/dbAssignment';
import { dbGetStudentsMini } from '../indexedDb/dbPersons';
import { initAppDb, isDbExist } from '../indexedDb/dbUtility';
import { dbGetNotifications, dbSaveNotifications } from '../indexedDb/dbNotifications';
import {
  classCountState,
  congIDState,
  congNameState,
  congNumberState,
  isAdminCongState,
  meetingDayState,
  meetingTimeState,
  pocketMembersState,
  usernameState,
} from '../states/congregation';
import {
  apiHostState,
  appLangState,
  appNotificationsState,
  isOnlineState,
  qrCodePathState,
  secretTokenPathState,
  sourceLangState,
  userEmailState,
  userIDState,
  userLocalUidState,
  userPasswordState,
  visitorIDState,
} from '../states/main';
import { assTypeListState, weekTypeListState, yearsListState } from '../states/sourceMaterial';
import { allStudentsState, filteredStudentsState, studentsAssignmentHistoryState } from '../states/persons';
import { appMessageState, appSeverityState, appSnackOpenState } from '../states/notification';
import { encryptString } from './swsEncryption';

export const loadApp = async () => {
  const I18n = getI18n();

  await initAppDb();
  let { username, local_uid, source_lang, cong_number, cong_name, class_count, meeting_day, meeting_time } =
    await dbGetAppSettings();

  const app_lang = localStorage.getItem('app_lang') || 'e';

  await checkSrcUpdate();

  if (local_uid && local_uid !== '') {
    await promiseSetRecoil(userLocalUidState, local_uid);
  }

  await promiseSetRecoil(usernameState, username || '');
  await promiseSetRecoil(congNameState, cong_name || '');
  await promiseSetRecoil(congNumberState, cong_number || '');
  await promiseSetRecoil(classCountState, class_count || 1);
  await promiseSetRecoil(meetingDayState, meeting_day || 3);
  await promiseSetRecoil(meetingTimeState, meeting_time || new Date(Date.now()));
  await promiseSetRecoil(appLangState, app_lang);
  await promiseSetRecoil(sourceLangState, source_lang || app_lang);

  if (source_lang === undefined) await dbUpdateAppSettings({ source_lang: app_lang });

  I18n.changeLanguage(app_lang);

  const weekTypeList = await dbGetListWeekType();
  await promiseSetRecoil(weekTypeListState, weekTypeList);

  const assTypeList = await dbGetListAssType();
  await promiseSetRecoil(assTypeListState, assTypeList);

  const data = await dbGetStudentsMini();
  await promiseSetRecoil(allStudentsState, data);
  await promiseSetRecoil(filteredStudentsState, data);

  const history = await dbHistoryAssignment();
  await promiseSetRecoil(studentsAssignmentHistoryState, history);

  const years = await dbGetYearList();
  await promiseSetRecoil(yearsListState, years);

  const notifications = await dbGetNotifications();
  await promiseSetRecoil(appNotificationsState, notifications);
};

export const fetchNotifications = async () => {
  try {
    const isOnline = await promiseGetRecoil(isOnlineState);
    const apiHost = await promiseGetRecoil(apiHostState);

    if (isOnline && apiHost !== '') {
      const res = await fetch(`${apiHost}api/users/announcement`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          app: 'lmm-oa',
        },
      });

      const data = await res.json();
      await dbSaveNotifications(data);
    }
  } catch {}
};

export const sortHistoricalDateDesc = (data) => {
  data.sort((a, b) => {
    if (a.startDate === b.startDate) return 0;
    const dateA = a.startDate.split('/')[2] + '/' + a.startDate.split('/')[0] + '/' + a.startDate.split('/')[1];
    const dateB = b.startDate.split('/')[2] + '/' + b.startDate.split('/')[0] + '/' + b.startDate.split('/')[1];
    return dateA > dateB ? 1 : -1;
  });

  return data;
};

export const formatDateForCompare = (date) => {
  return new Date(date);
};

export const getAssignmentName = (assType) => {
  if (assType === 101) {
    return getI18n().t('initialCall');
  }

  if (assType === 102) {
    return getI18n().t('returnVisit');
  }

  if (assType === 103) {
    return getI18n().t('bibleStudy');
  }

  if (assType === 104) {
    return getI18n().t('talk');
  }

  if (assType === 108) {
    return getI18n().t('memorialInvite');
  }
};

export const getCurrentWeekDate = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monDay = new Date(today.setDate(diff));
  return monDay;
};

export const apiHandleVerifyOTP = async (userOTP, isSetup) => {
  try {
    const apiHost = await promiseGetRecoil(apiHostState);
    const visitorID = await promiseGetRecoil(visitorIDState);
    const userEmail = await promiseGetRecoil(userEmailState);
    const userPwd = await promiseGetRecoil(userPasswordState);

    if (userOTP.length === 6) {
      const reqPayload = { token: userOTP };

      if (apiHost !== '') {
        const res = await fetch(`${apiHost}api/mfa/verify-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            visitorid: visitorID,
            email: userEmail,
          },
          body: JSON.stringify(reqPayload),
        });

        const data = await res.json();
        if (res.status === 200) {
          const { id, cong_id, cong_name, cong_role, cong_number, pocket_members } = data;

          if (cong_name.length > 0) {
            if (cong_role.length > 0) {
              await promiseSetRecoil(congIDState, cong_id);

              if (!isSetup) {
                const settings = await dbGetAppSettings();
                if (settings.isCongUpdated2 === undefined) {
                  return { updateCongregation: true };
                }
              }

              if (cong_role.includes('admin')) {
                await promiseSetRecoil(isAdminCongState, true);
              }

              // role approved
              if (cong_role.includes('lmmo') || cong_role.includes('lmmo-backup')) {
                const isMainDb = await isDbExist('lmm_oa');
                if (!isMainDb) {
                  await initAppDb();
                }

                // encrypt email & pwd
                const encPwd = await encryptString(userPwd, JSON.stringify({ email: userEmail, pwd: userPwd }));

                // save congregation update if any
                let obj = {};
                obj.username = data.username;
                obj.cong_name = cong_name;
                obj.cong_number = cong_number;
                obj.userPass = encPwd;
                obj.isLoggedOut = false;
                obj.pocket_members = pocket_members;
                await dbUpdateAppSettings(obj);

                await promiseSetRecoil(userIDState, id);
                await promiseSetRecoil(pocketMembersState, pocket_members);

                await loadApp();

                return { success: true };
              }

              return { unauthorized: true };
            }
            return { unauthorized: true };
          }

          return { createCongregation: true };
        } else {
          if (data.message) {
            await promiseSetRecoil(appMessageState, data.message);
            await promiseSetRecoil(appSeverityState, 'warning');
            await promiseSetRecoil(appSnackOpenState, true);
            return {};
          }

          if (!isSetup && data.secret) {
            await promiseSetRecoil(secretTokenPathState, data.secret);
            await promiseSetRecoil(qrCodePathState, data.qrCode);
            return { reenroll: true };
          }
        }
      }
    }
  } catch (err) {
    await promiseSetRecoil(appMessageState, err.message);
    await promiseSetRecoil(appSeverityState, 'error');
    await promiseSetRecoil(appSnackOpenState, true);
    return {};
  }
};
