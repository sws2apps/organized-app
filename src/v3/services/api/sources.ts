import { apiDefault } from './common';

export const apiFetchSources = async () => {
  const {
    apiHost,
    appVersion: appversion,
    isOnline,
    JWLang,
  } = await apiDefault();

  if (isOnline && apiHost !== '') {
    const res = await fetch(
      `${apiHost}api/v3/public/source-material/${JWLang}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'organized',
          appversion,
        },
      }
    );

    const data = await res.json();

    return { status: res.status, data };
  }
};
