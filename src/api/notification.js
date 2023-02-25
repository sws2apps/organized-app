import { getProfile } from './common';
import { dbGetAppSettings } from '../indexedDb/dbAppSettings';

export const fetchNotifications = async () => {
  try {
    const { apiHost, isOnline } = await getProfile();
    const settings = await dbGetAppSettings();
    if (isOnline && apiHost !== '') {
      const res = await fetch(`${apiHost}api/users/announcement-v2`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          cong_role: settings.cong_role,
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
