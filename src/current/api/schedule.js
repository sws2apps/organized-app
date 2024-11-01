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
        res = await fetch(`${apiHost}api/v2/sws-pocket/meeting-schedule`, {
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
      const coordinatorRole = Setting.cong_role.includes('coordinator');
      const publicTalkCoordinatorRole = Setting.cong_role.includes('public_talk_coordinator');
      const elderRole = Setting.cong_role.includes('elder');
      const msRole = Setting.cong_role.includes('ms');
      const meetingEditorFull =
        Setting.account_type === 'vip' && lmmoRole && coordinatorRole && publicTalkCoordinatorRole;
      const publisherRole =
        Setting.account_type === 'vip' &&
        !lmmoRole &&
        !secretaryRole &&
        !coordinatorRole &&
        !publicTalkCoordinatorRole &&
        (Setting.cong_role.includes('publisher') || msRole || elderRole);
      const viewMeetingScheduleRole =
        Setting.account_type === 'vip' &&
        !lmmoRole &&
        !secretaryRole &&
        !coordinatorRole &&
        !publicTalkCoordinatorRole &&
        Setting.cong_role.includes('view_meeting_schedule');

      if (viewMeetingScheduleRole || (!meetingEditorFull && Setting.account_type === 'vip') || publisherRole) {
        const auth = await getAuth();
        const user = auth.currentUser;

        res = await fetch(`${apiHost}api/v2/congregations/${congID}/meeting-schedule`, {
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

      if (res.ok) {
        const { cong_schedule, cong_sourceMaterial, cong_settings } = await res.json();

        await Sources.updatePocketSource(cong_sourceMaterial);
        await Schedules.updatePocketSchedule(cong_schedule);
        const { class_count, source_lang, co_name, co_displayName, opening_prayer_MM_autoAssign } = cong_settings;

        await Setting.update({ class_count, source_lang, co_name, co_displayName, opening_prayer_MM_autoAssign });

        Schedules.buildHistory();

        await promiseSetRecoil(classCountState, class_count);
        await promiseSetRecoil(sourceLangState, source_lang);
        await promiseSetRecoil(isFetchingScheduleState, false);
        const prevRefresh = await promiseGetRecoil(refreshMyAssignmentsState);
        await promiseSetRecoil(refreshMyAssignmentsState, !prevRefresh);

        const pocketRefresh = await promiseGetRecoil(refreshCurrentWeekState);
        await promiseSetRecoil(refreshCurrentWeekState, !pocketRefresh);
      }
    }

    await promiseSetRecoil(rootModalOpenState, false);
  } catch {
    await promiseSetRecoil(rootModalOpenState, false);
  }
};
