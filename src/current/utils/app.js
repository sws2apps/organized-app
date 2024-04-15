import { getI18n } from 'react-i18next';
import dateFormat from 'dateformat';
import { promiseSetRecoil } from 'recoil-outside';
import { initAppDb } from '../indexedDb/dbUtility';
import { dbGetNotifications } from '../indexedDb/dbNotifications';
import {
  classCountState,
  congIDState,
  congNameState,
  congNumberState,
  congRoleState,
  midweekMeetingDayState,
  meetingTimeState,
  openingPrayerMMAutoAssignState,
  usernameState,
  openingPrayerWMAutoAssignState,
  weekendMeetingDayState,
  midweekMeetingExactDateState,
  weekendMeetingSubstituteSpeakerState,
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
import appDb from '../../shared/indexedDb/mainDb';
import { Setting } from '../classes/Setting';
import { Sources } from '../classes/Sources';
import { publicTalksState } from '../states/sourceMaterial';
import { S34s } from '../classes/S34s';

export const loadApp = async () => {
  try {
    const I18n = getI18n();

    await initAppDb();

    let {
      username,
      user_local_uid,
      source_lang,
      cong_number,
      cong_name,
      class_count,
      cong_role,
      midweek_meeting_day,
      meeting_time,
      user_avatar,
      autoBackup,
      autoBackup_interval,
      schedule_useFullname,
      account_type,
      opening_prayer_MM_autoAssign,
      opening_prayer_WM_autoAssign,
      weekend_meeting_day,
      midweek_meeting_useExactDate,
      weekend_meeting_useSubstituteSpeaker,
    } = Setting;

    backupWorkerInstance.setBackupInterval(autoBackup_interval);
    backupWorkerInstance.setIsEnabled(autoBackup);

    const app_lang = localStorage.getItem('app_lang') || 'e';

    const isMeetingEditor =
      cong_role.includes('lmmo') ||
      cong_role.includes('lmmo-backup') ||
      cong_role.includes('coordinator') ||
      cong_role.includes('public_talk_coordinator');

    if (account_type === 'vip' && isMeetingEditor) {
      await Sources.checkCurrentWeek();
    }

    if (user_local_uid && user_local_uid !== '') {
      await promiseSetRecoil(userLocalUidState, user_local_uid);
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
    await promiseSetRecoil(midweekMeetingDayState, midweek_meeting_day || 3);
    await promiseSetRecoil(meetingTimeState, meeting_time || new Date(Date.now()));
    await promiseSetRecoil(appLangState, app_lang);
    await promiseSetRecoil(sourceLangState, source_lang || app_lang);
    await promiseSetRecoil(scheduleUseFullnameState, schedule_useFullname || false);
    await promiseSetRecoil(openingPrayerMMAutoAssignState, opening_prayer_MM_autoAssign || false);
    await promiseSetRecoil(openingPrayerWMAutoAssignState, opening_prayer_WM_autoAssign || false);
    await promiseSetRecoil(weekendMeetingDayState, weekend_meeting_day || 6);
    await promiseSetRecoil(midweekMeetingExactDateState, midweek_meeting_useExactDate || false);
    await promiseSetRecoil(weekendMeetingSubstituteSpeakerState, weekend_meeting_useSubstituteSpeaker || false);

    if (source_lang === undefined) await Setting.update({ source_lang: app_lang });

    I18n.changeLanguage(app_lang);

    const notifications = await dbGetNotifications();
    await promiseSetRecoil(appNotificationsState, notifications);
    await promiseSetRecoil(publicTalksState, S34s.getLocal());
  } catch (err) {
    throw new Error(err);
  }
};

export const sortHistoricalDateDesc = (data) => {
  data.sort((a, b) => {
    const dateA = new Date(
      new Date(a.startDate).getFullYear(),
      new Date(a.startDate).getMonth(),
      new Date(a.startDate).getDate()
    );
    const dateB = new Date(
      new Date(b.startDate).getFullYear(),
      new Date(b.startDate).getMonth(),
      new Date(b.startDate).getDate()
    );

    if (dateA === dateB) return 0;

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
  const schedules = await appDb.sched.toArray();

  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  let monDay = new Date(today.setDate(diff));

  let currentWeek = dateFormat(monDay, 'yyyy/mm/dd');
  let isExist = false;

  if (schedules.length > 0) {
    do {
      const fDate = dateFormat(monDay, 'yyyy/mm/dd');
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
    user_members_delegate: data.user_members_delegate,
    user_local_uid: data.user_local_uid,
    account_type: 'pocket',
  };

  await Setting.update(obj);

  await promiseSetRecoil(usernameState, data.username);
  await promiseSetRecoil(congNameState, data.cong_name);
  await promiseSetRecoil(congNumberState, data.cong_number);
  await promiseSetRecoil(userIDState, data.id);
  await promiseSetRecoil(userLocalUidState, data.user_local_uid);
  await promiseSetRecoil(congRoleState, data.cong_role);
  await promiseSetRecoil(congIDState, data.cong_id);

  backupWorkerInstance.setUserRole(data.cong_role);
  backupWorkerInstance.setAccountType('pocket');
  backupWorkerInstance.setUserID(data.id);
  backupWorkerInstance.setCongID(data.cong_id);
  backupWorkerInstance.setIsCongAccountConnected(true);
};

export const computeYearsDiff = (date) => {
  const userDate = new Date(date);
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  const yearsDiff = ((now - userDate) / oneDay / 365).toFixed(2);

  return +yearsDiff;
};

export const addMonths = (date, value) => {
  const startDate = new Date(date);
  const result = startDate.setMonth(startDate.getMonth() + value);

  return new Date(result);
};

export const addWeeks = (date, value) => {
  const startDate = new Date(date);
  const result = startDate.setDate(startDate.getDate() + value * 7);

  return new Date(result);
};

export const monthDiff = (startDate, endDate) => {
  startDate = new Date(startDate);
  endDate = new Date(endDate);

  return endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear());
};

export const reportsFieldSum = (array, field, initial = 0) => {
  return array.reduce(
    (accumulator, currentValue) =>
      typeof currentValue[field] === 'string' ? accumulator : accumulator + currentValue[field],
    initial
  );
};

export const getMonthName = (date) => {
  const year = +date.split('/')[0];
  const month = +date.split('/')[1] - 1;

  const monthName = Setting.monthNames()[month];

  return `${monthName} ${year}`;
};
