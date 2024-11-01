import { getProfile } from './common';

export const fetchSourceMaterial = async () => {
  const { sourceLang, apiHost } = await getProfile();

  const res = await fetch(`${apiHost}api/v2/public/source-material/${sourceLang}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      appclient: 'cpe',
      appversion: import.meta.env.PACKAGE_VERSION,
    },
  });
  if (res.status === 200) {
    const data = await res.json();
    return data;
  }
};
