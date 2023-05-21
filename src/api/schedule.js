import { promiseGetRecoil, promiseSetRecoil } from 'recoil-outside';
import { getProfile } from './common';
import {
  isFetchingScheduleState,
  refreshMyAssignmentsState,
  rootModalOpenState,
  sourceLangState,
} from '../states/main';
import { classCountState } from '../states/congregation';
import { Schedules } from '../classes/Schedules';
import { Sources } from '../classes/Sources';
import { Setting } from '../classes/Setting';
import { getAuth } from 'firebase/auth';
import { refreshCurrentWeekState } from '../states/schedule';

export const apiFetchSchedule = async () => {
  try {
    await promiseSetRecoil(rootModalOpenState, true);

    const { apiHost, congID, isOnline, visitorID } = await getProfile();

    if (isOnline && apiHost !== '' && visitorID !== '') {
      await promiseSetRecoil(isFetchingScheduleState, true);

      let res;

      if (Setting.account_type === 'pocket') {
        res = await fetch(`${apiHost}api/sws-pocket/meeting-schedule`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            appclient: 'cpe',
            appversion: import.meta.env.PACKAGE_VERSION,
            visitorid: visitorID,
          },
        });
      }

      const lmmoRole = Setting.cong_role.includes('lmmo') || Setting.cong_role.includes('lmmo-backup');
      const secretaryRole = Setting.cong_role.includes('secretary');
      const viewMeetingScheduleRole =
        Setting.account_type === 'vip' &&
        Setting.cong_role.length === 1 &&
        Setting.cong_role.includes('view_meeting_schedule');

      if (viewMeetingScheduleRole || (secretaryRole && !lmmoRole)) {
        const auth = await getAuth();
        const user = auth.currentUser;

        res = await fetch(`${apiHost}api/congregations/${congID}/meeting-schedule`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            appclient: 'cpe',
            appversion: import.meta.env.PACKAGE_VERSION,
            uid: user.uid,
            visitorid: visitorID,
          },
        });
      }

      const { cong_schedule, cong_sourceMaterial, cong_settings } = await res.json();

      await Sources.updatePocketSource(cong_sourceMaterial);
      await Schedules.updatePocketSchedule(cong_schedule);

      const { class_count, source_lang, co_name, co_displayName, opening_prayer_autoAssign } = cong_settings;

      await Setting.update({ class_count, source_lang, co_name, co_displayName, opening_prayer_autoAssign });

      Schedules.buildHistory();

      await promiseSetRecoil(classCountState, class_count);
      await promiseSetRecoil(sourceLangState, source_lang);
      await promiseSetRecoil(isFetchingScheduleState, false);
      const prevRefresh = await promiseGetRecoil(refreshMyAssignmentsState);
      await promiseSetRecoil(refreshMyAssignmentsState, !prevRefresh);

      const pocketRefresh = await promiseGetRecoil(refreshCurrentWeekState);
      await promiseSetRecoil(refreshCurrentWeekState, !pocketRefresh);
    }

    await promiseSetRecoil(rootModalOpenState, false);
  } catch {
    await promiseSetRecoil(rootModalOpenState, false);
  }
};
