import { NotificationDbRecordType } from '@definition/notification';
import { apiDefault } from './common';

export const apiFetchNotifications = async () => {
  const { appLang } = await apiDefault();

  const isLive = location.hostname === 'organized-app.com';

  const url = isLive
    ? 'https://notifications.organized-app.com'
    : 'https://dev-notifications.organized-app.com';

  const res = await fetch(`${url}/${appLang}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await res.json();

  if (res.status !== 200 && res.status !== 304) {
    throw new Error(data.message);
  }

  return data as NotificationDbRecordType[];
};
