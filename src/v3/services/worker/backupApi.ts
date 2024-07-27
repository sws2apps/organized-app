export const apiGetCongregationBackup = async ({
  apiHost,
  congID,
  idToken,
}) => {
  const res = await fetch(`${apiHost}api/v3/congregations/${congID}/backup`, {
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

  return data;
};

export const apiSendCongregationBackup = async ({
  apiHost,
  congID,
  reqPayload,
  lastBackup,
  idToken,
}) => {
  const res = await fetch(`${apiHost}api/v3/congregations/${congID}/backup`, {
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
