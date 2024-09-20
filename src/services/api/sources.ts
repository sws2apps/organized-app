import { apiDefault } from './common';

export const apiFetchSources = async () => {
  const {
    apiHost,
    appVersion: appversion,
    isOnline,
    JWLang,
  } = await apiDefault();

  if (isOnline && apiHost !== '') {
    const url =
      import.meta.env.VITE_SOURCE_MATERIALS_API ||
      'https://source-materials.organized-app.com';

    const res = await fetch(`${url}/api/${JWLang}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        appclient: 'organized',
        appversion,
      },
    });

    const data = await res.json();

    return { status: res.status, data };
  }
};
