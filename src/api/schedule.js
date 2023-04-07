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
            visitorid: visitorID,
          },
        });
      }

      if (
        (Setting.account_type === 'vip' &&
          Setting.cong_role.length === 1 &&
          Setting.cong_role.includes('view_meeting_schedule')) ||
        Setting.cong_role.includes('secretary')
      ) {
        const auth = await getAuth();
        const user = auth.currentUser;

        res = await fetch(`${apiHost}api/congregations/${congID}/meeting-schedule`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            uid: user.uid,
            visitorid: visitorID,
          },
        });
      }

      const { cong_schedule, cong_sourceMaterial, class_count, source_lang, co_name, co_displayName } =
        await res.json();
      await Sources.updatePocketSource(cong_sourceMaterial);
      await Schedules.updatePocketSchedule(cong_schedule);

      await Setting.update({ class_count, source_lang, co_name, co_displayName });

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
