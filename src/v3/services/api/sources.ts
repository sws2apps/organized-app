import { apiDefault } from './common';

export const apiFetchSources = async () => {
  const { apiHost, appVersion: appversion, isOnline, JWLang } = await apiDefault();

  if (isOnline && apiHost !== '') {
    const res = await fetch(`${apiHost}api/public/source-material/${JWLang}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', appclient: 'cpe', appversion },
    });

    const data = await res.json();

    return { status: res.status, data };
  }
};

export const apiFetchPublicTalks = async () => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid, congID } = await apiDefault();

  const res = await fetch(`${apiHost}api/congregations/meeting/${congID}/public-talks`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', appclient: 'cpe', appversion, visitorid, uid },
  });

  const data = await res.json();

  return { status: res.status, data };
};
