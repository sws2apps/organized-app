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

export const apiFetchSchedule = async () => {
  await promiseSetRecoil(rootModalOpenState, true);

  const { apiHost, isOnline, visitorID } = await getProfile();

  if (isOnline && apiHost !== '' && visitorID !== '') {
    await promiseSetRecoil(isFetchingScheduleState, true);
    const res = await fetch(`${apiHost}api/sws-pocket/meeting-schedule`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        visitorid: visitorID,
      },
    });

    const { cong_schedule, cong_sourceMaterial, class_count, source_lang, co_name, co_displayName } = await res.json();
    await Sources.updatePocketSource(cong_sourceMaterial);
    await Schedules.updatePocketSchedule(cong_schedule);

    await Setting.update({ class_count, source_lang, co_name, co_displayName });

    Schedules.buildHistory();

    await promiseSetRecoil(classCountState, class_count);
    await promiseSetRecoil(sourceLangState, source_lang);
    await promiseSetRecoil(isFetchingScheduleState, false);
    const prevRefresh = await promiseGetRecoil(refreshMyAssignmentsState);
    await promiseSetRecoil(refreshMyAssignmentsState, !prevRefresh);
  }

  await promiseSetRecoil(rootModalOpenState, false);
};
