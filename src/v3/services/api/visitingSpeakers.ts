import { getVisitingSpeakersCongregations } from '@services/app/visitingSpeakers';
import { apiDefault } from './common';

export const apiApproveCongregationSpeakersRequest = async (cong_id) => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid, congID } = await apiDefault();

  const res = await fetch(`${apiHost}api/congregations/meeting/${congID}/request-speakers/approve`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', appclient: 'organized', appversion, visitorid, uid, cong_id },
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiDisapproveCongregationSpeakersRequest = async (cong_id) => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid, congID } = await apiDefault();

  const res = await fetch(`${apiHost}api/congregations/meeting/${congID}/request-speakers/disapprove`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', appclient: 'organized', appversion, visitorid, uid, cong_id },
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiGetCongregationSpeakersRequests = async () => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid, congID } = await apiDefault();

  const res = await fetch(`${apiHost}api/congregations/meeting/${congID}/request-speakers`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', appclient: 'organized', appversion, visitorid, uid },
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiUploadVisitingSpeakers = async (speakers) => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, congID, userUID: uid } = await apiDefault();

  const res = await fetch(`${apiHost}api/congregations/meeting/${congID}/visiting-speakers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', appclient: 'organized', appversion, visitorid, uid },
    body: JSON.stringify({ speakers }),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiGetCongregationSpeakersList = async (congs) => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, congID, userUID: uid } = await apiDefault();

  if (!congs) {
    const tmpList = await getVisitingSpeakersCongregations();
    if (tmpList.length === 0) {
      congs = [];
    } else {
      congs = tmpList.join(';');
    }
  }

  if (congs) {
    congs = [congs];
  }

  const res = await fetch(`${apiHost}api/congregations/meeting/${congID}/visiting-speakers`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      appclient: 'organized',
      appversion,
      visitorid,
      uid,
      congs: JSON.stringify(congs),
    },
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiGetApprovedVisitingSpeakersAccess = async () => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, congID, userUID: uid } = await apiDefault();

  const res = await fetch(`${apiHost}api/congregations/meeting/${congID}/visiting-speakers-access`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', appclient: 'organized', appversion, visitorid, uid },
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiUpdateVisitingSpeakersAccess = async (congs) => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, congID, userUID: uid } = await apiDefault();

  const res = await fetch(`${apiHost}api/congregations/meeting/${congID}/visiting-speakers-access`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', appclient: 'organized', appversion, visitorid, uid },
    body: JSON.stringify({ congs }),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiRequestAccessCongregationSpeakers = async (cong_id) => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, congID, userUID: uid } = await apiDefault();

  const res = await fetch(`${apiHost}api/congregations/meeting/${congID}/request-speakers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', appclient: 'organized', appversion, visitorid, uid },
    body: JSON.stringify({ cong_id }),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiFindCongregationSpeakers = async (name) => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, congID, userUID: uid } = await apiDefault();

  const res = await fetch(`${apiHost}api/congregations/meeting/${congID}/visiting-speakers-congregations`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', appclient: 'organized', appversion, visitorid, uid, name: name },
  });

  const data = await res.json();

  return { status: res.status, data };
};
