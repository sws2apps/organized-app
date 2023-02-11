import { getI18n } from 'react-i18next';
import { promiseGetRecoil, promiseSetRecoil } from 'recoil-outside';
import { dbGetAppSettings, dbUpdateAppSettings } from '../indexedDb/dbAppSettings';
import { checkSrcUpdate, dbGetListWeekType, dbGetYearList } from '../indexedDb/dbSourceMaterial';
import { dbGetListAssType, dbHistoryAssignment } from '../indexedDb/dbAssignment';
import { dbGetStudentsMini } from '../indexedDb/dbPersons';
import { initAppDb } from '../indexedDb/dbUtility';
import { dbGetNotifications } from '../indexedDb/dbNotifications';
import {
  classCountState,
  congNameState,
  congNumberState,
  meetingDayState,
  meetingTimeState,
  usernameState,
} from '../states/congregation';
import {
  appLangState,
  appNotificationsState,
  avatarUrlState,
  isOnlineState,
  sourceLangState,
  userLocalUidState,
} from '../states/main';
import { assTypeListState, weekTypeListState, yearsListState } from '../states/sourceMaterial';
import { allStudentsState, filteredStudentsState, studentsAssignmentHistoryState } from '../states/persons';

export const loadApp = async () => {
  const I18n = getI18n();

  await initAppDb();
  let {
    username,
    local_uid,
    source_lang,
    cong_number,
    cong_name,
    class_count,
    meeting_day,
    meeting_time,
    user_avatar,
  } = await dbGetAppSettings();

  const app_lang = localStorage.getItem('app_lang') || 'e';

  await checkSrcUpdate();

  if (local_uid && local_uid !== '') {
    await promiseSetRecoil(userLocalUidState, local_uid);
  }

  const isOnline = await promiseGetRecoil(isOnlineState);

  if (user_avatar) {
    if (typeof user_avatar === 'string' && isOnline) {
      await promiseSetRecoil(avatarUrlState, user_avatar);
    }

    if (typeof user_avatar === 'object') {
      const blob = new Blob([user_avatar]);
      const imgSrc = URL.createObjectURL(blob);
      await promiseSetRecoil(avatarUrlState, imgSrc);
    }
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
      if (provider === 'yahoo.com') {
        await dbUpdateAppSettings({ user_avatar: url });
        await promiseSetRecoil(avatarUrlState, url);

        return;
      }

      if (provider !== 'microsoft.com') {
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
          await dbUpdateAppSettings({ user_avatar: profileBuffer });
          const imgSrc = URL.createObjectURL(profileBlob);
          await promiseSetRecoil(avatarUrlState, imgSrc);
        };

        return;
      }
    }

    await promiseSetRecoil(avatarUrlState, undefined);
  } catch (err) {}
};
