import { getAuth } from 'firebase/auth';
import { getProfile } from './common';

export const apiFetchCountries = async () => {
  const { apiHost, appLang, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/congregations/countries`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          uid: user.uid,
          visitorid: visitorID,
          language: appLang.toUpperCase(),
        },
      });
      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiFetchCongregations = async (country, name) => {
  const { appLang, apiHost, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/congregations/list-by-country`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          uid: user.uid,
          visitorid: visitorID,
          language: appLang.toUpperCase(),
          country,
          name,
        },
      });
      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiCreateCongregation = async (country_code, cong_name, cong_number, role, fullname) => {
  const { apiHost, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/congregations`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
          uid: user.uid,
        },
        body: JSON.stringify({ country_code, cong_name, cong_number, app_requestor: role, fullname }),
      });
      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiUpdateCongregation = async (cong_id, country_code, cong_name, cong_number) => {
  const { apiHost, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/congregations/${cong_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          uid: user.uid,
          visitorid: visitorID,
        },
        body: JSON.stringify({ country_code, cong_name, cong_number }),
      });
      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiFetchCongregationLastBackup = async () => {
  const { apiHost, visitorID, congID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/congregations/${congID}/backup/last`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
          uid: user.uid,
        },
      });

      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiSendCongregationBackup = async (reqPayload) => {
  const { apiHost, visitorID, congID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/congregations/${congID}/backup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
          uid: user.uid,
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

export const apiRestoreCongregationBackup = async () => {
  const { apiHost, visitorID, congID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/congregations/${congID}/backup`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
          uid: user.uid,
        },
      });

      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiSendUserFieldServiceReports = async (reqPayload) => {
  const { apiHost, visitorID, congID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/congregations/${congID}/field-service-reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
          uid: user.uid,
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

export const apiUnpostUserFieldServiceReports = async (month) => {
  const { apiHost, visitorID, congID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/congregations/${congID}/field-service-reports`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
          uid: user.uid,
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

export const apiGetPendingFieldServiceReports = async () => {
  const { apiHost, visitorID, congID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/congregations/${congID}/field-service-reports`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
          uid: user.uid,
        },
      });

      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiApprovePendingFieldServiceReports = async (user_local_uid, month) => {
  const { apiHost, visitorID, congID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/congregations/${congID}/field-service-reports/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
          uid: user.uid,
        },
        body: JSON.stringify({ user_local_uid, month }),
      });

      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiDisapprovePendingFieldServiceReports = async (user_local_uid, month) => {
  const { apiHost, visitorID, congID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/congregations/${congID}/field-service-reports/disapprove`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
          uid: user.uid,
        },
        body: JSON.stringify({ user_local_uid, month }),
      });

      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};
