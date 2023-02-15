import { getProfile } from './common';

export const fetchNotifications = async () => {
  try {
    const { apiHost, isOnline } = await getProfile();
    if (isOnline && apiHost !== '') {
      const res = await fetch(`${apiHost}api/users/announcement-v2`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          app: 'lmmo',
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
