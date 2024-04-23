// to minimize the size of the worker file, we recreate all its needed functions in this file

export const apiSendCongregationBackup = async ({ apiHost, congID, visitorID, userUID, reqPayload }) => {
  const res = await fetch(`${apiHost}api/congregations/${congID}/backup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      appclient: 'organized',
      appversion: import.meta.env.PACKAGE_VERSION,
      visitorid: visitorID,
      uid: userUID,
    },
    body: JSON.stringify(reqPayload),
  });

  const data = await res.json();

  return data;
};

export const apiSendUserBackup = async ({ apiHost, visitorID, userID, reqPayload }) => {
  const res = await fetch(`${apiHost}api/sws-pocket/${userID}/backup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      appclient: 'organized',
      appversion: import.meta.env.PACKAGE_VERSION,
      visitorid: visitorID,
    },
    body: JSON.stringify(reqPayload),
  });

  const data = await res.json();

  return data;
};

export const apiFetchCongregationLastBackup = async ({ apiHost, visitorID, userUID, congID }) => {
  const res = await fetch(`${apiHost}api/congregations/${congID}/backup/last`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      appclient: 'organized',
      appversion: import.meta.env.PACKAGE_VERSION,
      visitorid: visitorID,
      uid: userUID,
    },
  });

  const data = await res.json();

  return data;
};

export const dbExportDataOnline = async ({ cong_role }) => {
  const data = { test: [] };

  if (cong_role) data.test = [];

  return data;
};
