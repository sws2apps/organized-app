import { promiseGetRecoil } from 'recoil-outside';
import { accountTypeState } from '@states/settings';
import { apiDefault } from './common';

export const apiFetchSchedule = async () => {
  const {
    apiHost,
    appVersion: appversion,
    congID,
    isOnline,
    userUID: uid,
  } = await apiDefault();

  if (isOnline && apiHost !== '') {
    const accountType = await promiseGetRecoil(accountTypeState);

    let res;

    if (accountType === 'pocket') {
      res = await fetch(`${apiHost}api/v3/sws-pocket/meeting-schedule`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'organized',
          appversion,
        },
      });
    }

    if (accountType === 'vip') {
      res = await fetch(
        `${apiHost}api/v3/congregations/${congID}/meeting-schedule`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            appclient: 'organized',
            appversion,
            uid,
          },
        }
      );
    }

    const data = await res.json();

    return { status: res.status, data };
  }
};
