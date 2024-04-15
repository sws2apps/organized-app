import { getAuth } from '@firebase/auth';
import { getProfile } from './common';

export const fetchSourceMaterial = async () => {
  const { sourceLang, apiHost } = await getProfile();

  const res = await fetch(`${apiHost}api/public/source-material/${sourceLang}`, {
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

export const apiFetchPublicTalks = async () => {
  const { apiHost, visitorID, congID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/congregations/meeting/${congID}/public-talks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
          uid: user.uid,
        },
      });

      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};
