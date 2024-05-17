export const apiGetCongregationBackup = async ({ apiHost, congID, visitorID, userUID }) => {
  const res = await fetch(`${apiHost}api/congregations/${congID}/backup`, {
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

export const apiSendCongregationBackup = async ({ apiHost, congID, visitorID, userUID, reqPayload, lastBackup }) => {
  const res = await fetch(`${apiHost}api/congregations/${congID}/backup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      appclient: 'organized',
      appversion: import.meta.env.PACKAGE_VERSION,
      visitorid: visitorID,
      uid: userUID,
      lastbackup: lastBackup,
    },
    body: JSON.stringify({ cong_backup: reqPayload }),
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
