import { getProfile } from './common';
import { Setting } from '../classes/Setting';

export const fetchNotifications = async () => {
  try {
    const { apiHost, isOnline } = await getProfile();

    if (isOnline && apiHost !== '') {
      const res = await fetch(`${apiHost}api/v2/users/announcement-v2`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          cong_role: JSON.stringify(Setting.cong_role),
        },
      });

      const data = await res.json();

      return { status: res.status, data };
    }

    return [];
  } catch (err) {
    throw new Error(err);
  }
};
