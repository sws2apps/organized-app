import { promiseGetRecoil } from 'recoil-outside';
import { accountTypeState } from '@states/settings';
import { apiDefault } from './common';

export const apiFetchSchedule = async () => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, congID, isOnline, userUID: uid } = await apiDefault();

  if (isOnline && apiHost !== '' && visitorid !== '') {
    const accountType = await promiseGetRecoil(accountTypeState);

    let res;

    if (accountType === 'pocket') {
      res = await fetch(`${apiHost}api/sws-pocket/meeting-schedule`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', appclient: 'organized', appversion, visitorid },
      });
    }

    if (accountType === 'vip') {
      res = await fetch(`${apiHost}api/congregations/${congID}/meeting-schedule`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', appclient: 'organized', appversion, uid, visitorid },
      });
    }

    const data = await res.json();

    return { status: res.status, data };
  }
};
