import { BackupDataType } from './backupType';

export const apiGetCongregationBackup = async ({
  apiHost,
  userID,
  idToken,
}: {
  apiHost: string;
  userID: string;
  idToken: string;
}) => {
  const res = await fetch(`${apiHost}api/v3/users/${userID}/backup`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Authorization: `Bearer ${idToken}`,
      appclient: 'organized',
      appversion: import.meta.env.PACKAGE_VERSION,
    },
  });

  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }

  return data as BackupDataType;
};

export const apiSendCongregationBackup = async ({
  apiHost,
  userID,
  reqPayload,
  lastBackup,
  idToken,
}: {
  apiHost: string;
  userID: string;
  reqPayload: object;
  lastBackup: string;
  idToken: string;
}) => {
  const res = await fetch(`${apiHost}api/v3/users/${userID}/backup`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Authorization: `Bearer ${idToken}`,
      appclient: 'organized',
      appversion: import.meta.env.PACKAGE_VERSION,
      lastbackup: lastBackup,
    },
    body: JSON.stringify({ cong_backup: reqPayload }),
  });

  const data = await res.json();

  return data;
};

export const apiGetPocketBackup = async ({ apiHost }: { apiHost: string }) => {
  const res = await fetch(`${apiHost}api/v3/pockets/backup`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      appclient: 'organized',
      appversion: import.meta.env.PACKAGE_VERSION,
    },
  });

  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }

  return data as BackupDataType;
};

export const apiSendPocketBackup = async ({
  apiHost,
  reqPayload,
  lastBackup,
}) => {
  const res = await fetch(`${apiHost}api/v3/pockets/backup`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      appclient: 'organized',
      appversion: import.meta.env.PACKAGE_VERSION,
      lastbackup: lastBackup,
    },
    body: JSON.stringify({ cong_backup: reqPayload }),
  });

  const data = await res.json();

  return data;
};
