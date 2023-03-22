import { getI18n } from 'react-i18next';
import { format } from 'date-fns';
import { promiseSetRecoil } from 'recoil-outside';
import { initAppDb } from '../indexedDb/dbUtility';
import { dbGetNotifications } from '../indexedDb/dbNotifications';
import {
  classCountState,
  congNameState,
  congNumberState,
  congRoleState,
  meetingDayState,
  meetingTimeState,
  openingPrayerAutoAssignState,
  pocketLocalIDState,
  usernameState,
} from '../states/congregation';
import {
  appLangState,
  appNotificationsState,
  avatarUrlState,
  sourceLangState,
  userIDState,
  userLocalUidState,
} from '../states/main';
import backupWorkerInstance from '../workers/backupWorker';
import { scheduleUseFullnameState } from '../states/schedule';
import appDb from '../indexedDb/mainDb';
import { Setting } from '../classes/Setting';
import { Sources } from '../classes/Sources';

export const loadApp = async () => {
  try {
    const I18n = getI18n();

    await initAppDb();
    await Sources.removeOutdatedRecords();

    let {
      username,
      local_uid,
      source_lang,
      cong_number,
      cong_name,
      class_count,
      cong_role,
      meeting_day,
      meeting_time,
      user_avatar,
      autoBackup,
      autoBackup_interval,
      schedule_useFullname,
      account_type,
      opening_prayer_autoAssign,
    } = Setting;

    backupWorkerInstance.setBackupInterval(autoBackup_interval);
    backupWorkerInstance.setIsEnabled(autoBackup);

    const app_lang = localStorage.getItem('app_lang') || 'e';

    if (account_type === 'vip') {
      await Sources.checkCurrentWeek();
    }

    if (local_uid && local_uid !== '') {
      await promiseSetRecoil(userLocalUidState, local_uid);
    }

    if (user_avatar) {
      if (typeof user_avatar === 'object') {
        const blob = new Blob([user_avatar]);
        const imgSrc = URL.createObjectURL(blob);
        await promiseSetRecoil(avatarUrlState, imgSrc);
      }
    }

    await promiseSetRecoil(usernameState, username || '');
    await promiseSetRecoil(congNameState, cong_name || '');
    await promiseSetRecoil(congNumberState, cong_number || '');
    await promiseSetRecoil(congRoleState, cong_role || []);
    await promiseSetRecoil(classCountState, class_count || 1);
    await promiseSetRecoil(meetingDayState, meeting_day || 3);
    await promiseSetRecoil(meetingTimeState, meeting_time || new Date(Date.now()));
    await promiseSetRecoil(appLangState, app_lang);
    await promiseSetRecoil(sourceLangState, source_lang || app_lang);
    await promiseSetRecoil(scheduleUseFullnameState, schedule_useFullname || false);
    await promiseSetRecoil(openingPrayerAutoAssignState, opening_prayer_autoAssign || false);

    if (source_lang === undefined) await Setting.update({ source_lang: app_lang });

    I18n.changeLanguage(app_lang);

    const notifications = await dbGetNotifications();
    await promiseSetRecoil(appNotificationsState, notifications);
  } catch (err) {
    throw new Error(err);
  }
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
  if (assType === 101 || (assType >= 140 && assType < 170)) {
    return getI18n().t('initialCall', { ns: 'source' });
  }

  if (assType === 102 || (assType >= 170 && assType < 200)) {
    return getI18n().t('returnVisit', { ns: 'source' });
  }

  if (assType === 103) {
    return getI18n().t('bibleStudy', { ns: 'source' });
  }

  if (assType === 104) {
    return getI18n().t('talk', { ns: 'source' });
  }

  if (assType === 108) {
    return getI18n().t('memorialInvite', { ns: 'source' });
  }
};

export const getCurrentWeekDate = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monDay = new Date(today.setDate(diff));
  return monDay;
};

export const saveProfilePic = async (url, provider) => {
  try {
    if (url && url !== '' && url !== null) {
      if (provider !== 'microsoft.com' && provider !== 'yahoo.com') {
        const imageReceived = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          canvas.width = downloadedImg.width;
          canvas.height = downloadedImg.height;
          canvas.innerText = downloadedImg.alt;

          context.drawImage(downloadedImg, 0, 0);

          canvas.toBlob((done) => savePic(done));
        };

        const downloadedImg = new Image();
        downloadedImg.crossOrigin = 'Anonymous';
        downloadedImg.src = url;
        downloadedImg.addEventListener('load', imageReceived, false);

        const savePic = async (profileBlob) => {
          const profileBuffer = await profileBlob.arrayBuffer();
          await Setting.update({ user_avatar: profileBuffer });
          const imgSrc = URL.createObjectURL(profileBlob);
          await promiseSetRecoil(avatarUrlState, imgSrc);
        };

        return;
      }
    }

    await promiseSetRecoil(avatarUrlState, undefined);
  } catch (err) {}
};

export const getErrorMessage = (msg) => {
  const { t } = getI18n();

  switch (msg) {
    case 'DEVICE_REMOVED':
      return t('deviceRemoved', { ns: 'ui' });
    case 'INPUT_INVALID':
      return t('inputInvalid', { ns: 'ui' });
    case 'POCKET_NOT_FOUND':
      return t('pocketNotFound', { ns: 'ui' });
    case 'INTERNAL_ERROR':
      return t('internalError', { ns: 'ui' });
    default:
      return msg;
  }
};

export const getCurrentExistingWeekDate = async () => {
  const schedules = await appDb.sched_MM.toArray();

  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  let monDay = new Date(today.setDate(diff));

  let currentWeek = format(monDay, 'MM/dd/yyyy');
  let isExist = false;

  if (schedules.length > 0) {
    do {
      const fDate = format(monDay, 'MM/dd/yyyy');
      const schedule = schedules.find((data) => data.weekOf === fDate);
      if (schedule) {
        currentWeek = fDate;
        isExist = true;
      }
      monDay.setDate(monDay.getDate() + 7);
    } while (isExist === false);
  }

  return currentWeek;
};

export const updateUserSettings = async (data) => {
  const obj = {
    cong_number: data.cong_number,
    cong_name: data.cong_name,
    cong_role: data.cong_role,
    username: data.username,
    pocket_members: data.pocket_members,
    pocket_local_id: data.pocket_local_id,
    user_id: data.id,
    account_type: 'pocket',
  };

  await Setting.update(obj);

  await promiseSetRecoil(usernameState, data.username);
  await promiseSetRecoil(congNameState, data.cong_name);
  await promiseSetRecoil(congNumberState, data.cong_number);
  await promiseSetRecoil(userIDState, data.id);
  await promiseSetRecoil(pocketLocalIDState, data.pocket_local_id.person_uid);
};
