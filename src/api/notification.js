import { dbSaveNotifications } from '../indexedDb/dbNotifications';
import { getProfile } from './common';

export const fetchNotifications = async () => {
  try {
    const { apiHost, isOnline } = await getProfile();

    if (isOnline && apiHost !== '') {
      const res = await fetch(`${apiHost}api/users/announcement`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          app: 'lmm-oa',
        },
      });

      const data = await res.json();
      await dbSaveNotifications(data);
    }
  } catch {}
};
