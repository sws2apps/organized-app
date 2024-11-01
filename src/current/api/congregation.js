import { getAuth } from 'firebase/auth';
import { getProfile } from './common';
import { VisitingSpeakers } from '../classes/VisitingSpeakers';

export const apiFetchCountries = async () => {
  const { apiHost, appLang, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/v2/congregations/countries`, {
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
    if (apiHost === '' || visitorID === '') {
      return { data: [] };
    }

    const auth = await getAuth();
    const user = auth.currentUser;

    const res = await fetch(`${apiHost}api/v2/congregations/list-by-country`, {
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
  } catch (err) {
    throw new Error(err);
  }
};

export const apiCreateCongregation = async (country_code, cong_name, cong_number, role, fullname) => {
  const { appLang, apiHost, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/v2/congregations`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
          uid: user.uid,
          language: appLang.toUpperCase(),
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

      const res = await fetch(`${apiHost}api/v2/congregations/${cong_id}`, {
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

      const res = await fetch(`${apiHost}api/v2/congregations/${congID}/backup/last`, {
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

      const res = await fetch(`${apiHost}api/v2/congregations/${congID}/backup`, {
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

      const res = await fetch(`${apiHost}api/v2/congregations/${congID}/backup`, {
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

      const res = await fetch(`${apiHost}api/v2/congregations/secretary/${congID}/field-service-reports`, {
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

      const res = await fetch(`${apiHost}api/v2/congregations/secretary/${congID}/field-service-reports`, {
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

      const res = await fetch(`${apiHost}api/v2/congregations/secretary/${congID}/field-service-reports`, {
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

      const res = await fetch(`${apiHost}api/v2/congregations/secretary/${congID}/field-service-reports/approve`, {
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

      const res = await fetch(`${apiHost}api/v2/congregations/secretary/${congID}/field-service-reports/disapprove`, {
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

export const apiUploadVisitingSpeakers = async (speakers) => {
  const { apiHost, visitorID, congID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/v2/congregations/meeting/${congID}/visiting-speakers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
          uid: user.uid,
        },
        body: JSON.stringify({ speakers }),
      });

      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiFindCongregationSpeakers = async (name) => {
  const { apiHost, visitorID, congID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/v2/congregations/meeting/${congID}/visiting-speakers-congregations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
          uid: user.uid,
          name: name,
        },
      });

      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiRequestAccessCongregationSpeakers = async (cong_id) => {
  const { apiHost, visitorID, congID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/v2/congregations/meeting/${congID}/request-speakers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
          uid: user.uid,
        },
        body: JSON.stringify({ cong_id }),
      });

      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiGetCongregationSpeakersRequests = async () => {
  const { apiHost, visitorID, congID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/v2/congregations/meeting/${congID}/request-speakers`, {
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

export const apiGetCongregationSpeakersRequestsStatus = async () => {
  const { apiHost, visitorID, congID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const tmpList = VisitingSpeakers.getRemoteCongregations();
      const congs = tmpList.join(';');

      const res = await fetch(`${apiHost}api/v2/congregations/meeting/${congID}/request-speakers-status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
          uid: user.uid,
          congs,
        },
      });

      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiApproveCongregationSpeakersRequest = async (cong_id) => {
  const { apiHost, visitorID, congID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/v2/congregations/meeting/${congID}/request-speakers/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
          uid: user.uid,
          cong_id,
        },
      });

      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiDisapproveCongregationSpeakersRequest = async (cong_id) => {
  const { apiHost, visitorID, congID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/v2/congregations/meeting/${congID}/request-speakers/disapprove`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
          uid: user.uid,
          cong_id,
        },
      });

      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiGetCongregationSpeakersList = async (congs) => {
  const { apiHost, visitorID, congID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      if (!congs) {
        const tmpList = VisitingSpeakers.visitingSpeakersCongregations();
        congs = tmpList.join(';');
      }

      if (congs) {
        congs = [congs];
      }

      const res = await fetch(`${apiHost}api/v2/congregations/meeting/${congID}/visiting-speakers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
          uid: user.uid,
          congs,
        },
      });

      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiGetApprovedVisitingSpeakersAccess = async () => {
  const { apiHost, visitorID, congID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/v2/congregations/meeting/${congID}/visiting-speakers-access`, {
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

export const apiUpdateVisitingSpeakersAccess = async (congs) => {
  const { apiHost, visitorID, congID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/v2/congregations/meeting/${congID}/visiting-speakers-access`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
          uid: user.uid,
        },
        body: JSON.stringify({ congs }),
      });

      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};
