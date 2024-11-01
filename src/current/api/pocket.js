import { getProfile } from './common';

export const apiFetchUserLastBackup = async () => {
  const { apiHost, userID, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/v2/sws-pocket/${userID}/backup/last`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
        },
      });

      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiSendUserBackup = async (reqPayload) => {
  const { apiHost, visitorID, userID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/v2/sws-pocket/${userID}/backup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
        },
        body: JSON.stringify(reqPayload),
      });

      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiRestoreUserBackup = async () => {
  const { apiHost, userID, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/v2/sws-pocket/${userID}/backup`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
        },
      });

      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiSendPocketFieldServiceReports = async (reqPayload) => {
  const { apiHost, userID, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/v2/sws-pocket/${userID}/field-service-reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
        },
        body: JSON.stringify(reqPayload),
      });

      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiUnpostPocketFieldServiceReports = async (month) => {
  const { apiHost, userID, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/v2/sws-pocket/${userID}/field-service-reports`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
        },
        body: JSON.stringify({ month }),
      });

      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};
