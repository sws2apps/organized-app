import {
  APFormOutgoing,
  CongregationUpdatesResponseType,
  User2FAResponseType,
  UserSessionsResponseType,
  ValidateMeResponseType,
} from '@definition/api';
import { apiDefault } from './common';
import { APRecordType } from '@definition/ministry';

export const apiUserLogout = async () => {
  const { apiHost, appVersion: appversion, idToken } = await apiDefault();

  await fetch(`${apiHost}api/v3/users/logout`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
      appclient: 'organized',
      appversion,
    },
  });
};

export const apiRequestPasswordlesssLink = async (email: string) => {
  const { apiHost, appVersion: appversion, appLang } = await apiDefault();

  const res = await fetch(`${apiHost}api/v3/user-passwordless-login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      appclient: 'organized',
      appversion,
      applanguage: appLang,
    },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiUpdatePasswordlessInfo = async () => {
  const { apiHost, appVersion: appversion, idToken } = await apiDefault();

  const tmpEmail = localStorage.getItem('emailForSignIn');

  const res = await fetch(`${apiHost}api/v3/user-passwordless-verify`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
      appclient: 'organized',
      appversion,
    },
    body: JSON.stringify({ email: tmpEmail }),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiSendAuthorization = async () => {
  const { apiHost, appVersion: appversion, idToken } = await apiDefault();

  const res = await fetch(`${apiHost}api/v3/user-login`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
      appclient: 'organized',
      appversion,
    },
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiHandleVerifyOTP = async (userOTP: string) => {
  const { apiHost, appVersion: appversion, idToken } = await apiDefault();

  const res = await fetch(`${apiHost}api/v3/mfa/verify-token`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
      appclient: 'organized',
      appversion,
    },
    body: JSON.stringify({ token: userOTP }),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiValidateMe = async (): Promise<ValidateMeResponseType> => {
  const { apiHost, appVersion: appversion, idToken } = await apiDefault();

  const res = await fetch(`${apiHost}api/v3/users/validate-me`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
      appclient: 'organized',
      appversion,
    },
  });

  const data = await res.json();

  return { status: res.status, result: data };
};

export const apiGetUser2FA = async (): Promise<User2FAResponseType> => {
  const {
    apiHost,
    appVersion: appversion,
    userID,
    idToken,
  } = await apiDefault();

  const res = await fetch(`${apiHost}api/v3/users/${userID}/2fa`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
      appclient: 'organized',
      appversion,
    },
  });

  const data = await res.json();

  return { status: res.status, result: data };
};

export const apiDisableUser2FA = async () => {
  const {
    apiHost,
    appVersion: appversion,
    userID,
    idToken,
  } = await apiDefault();

  const res = await fetch(`${apiHost}api/v3/users/${userID}/2fa/disable`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
      appclient: 'organized',
      appversion,
    },
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiRevokeVIPSession = async (id: string) => {
  const {
    apiHost,
    appVersion: appversion,
    userID,
    idToken,
  } = await apiDefault();

  const res = await fetch(`${apiHost}api/v3/users/${userID}/sessions`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
      appclient: 'organized',
      appversion,
    },
    body: JSON.stringify({ identifier: id }),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiGetUserSessions =
  async (): Promise<UserSessionsResponseType> => {
    const {
      apiHost,
      appVersion: appversion,
      userID,
      idToken,
    } = await apiDefault();

    const res = await fetch(`${apiHost}api/v3/users/${userID}/sessions`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
        appclient: 'organized',
        appversion,
      },
    });

    const data = await res.json();

    return {
      status: res.status,
      result: data.message ? { message: data.message } : { sessions: data },
    };
  };

export const apiUserFieldServiceReportPost = async (report: object) => {
  const {
    apiHost,
    appVersion: appversion,
    userID,
    idToken,
  } = await apiDefault();

  const res = await fetch(
    `${apiHost}api/v3/users/${userID}/field-service-reports`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
        appclient: 'organized',
        appversion,
      },
      body: JSON.stringify({ report }),
    }
  );

  if (res.ok && res.status === 200) {
    const data = await res.json();

    return {
      status: res.status,
      message: data.message as string,
    };
  }

  if (res.status !== 200) {
    const data = await res.json();

    throw new Error(data.message);
  }
};

export const apiUserSubmitApplication = async (application: APFormOutgoing) => {
  const {
    apiHost,
    appVersion: appversion,
    userID,
    idToken,
  } = await apiDefault();

  const res = await fetch(`${apiHost}api/v3/users/${userID}/applications`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
      appclient: 'organized',
      appversion,
    },
    body: JSON.stringify({ application }),
  });

  if (res.ok && res.status === 200) {
    const data = await res.json();

    return {
      status: res.status,
      message: data.message as string,
    };
  }

  if (res.status !== 200) {
    const data = await res.json();

    throw new Error(data.message);
  }
};

export const apiUserGetApplications = async (): Promise<APRecordType[]> => {
  const {
    apiHost,
    appVersion: appversion,
    userID,
    idToken,
  } = await apiDefault();

  if (!userID) return [];

  const res = await fetch(`${apiHost}api/v3/users/${userID}/applications`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
      appclient: 'organized',
      appversion,
    },
  });

  if (res.ok && res.status === 200) {
    const data = await res.json();

    return data;
  }

  if (res.status !== 200) {
    const data = await res.json();

    throw new Error(data.message);
  }
};

export const apiUserGetUpdates =
  async (): Promise<CongregationUpdatesResponseType> => {
    const {
      apiHost,
      appVersion: appversion,
      userID,
      idToken,
    } = await apiDefault();

    const res = await fetch(
      `${apiHost}api/v3/users/${userID}/updates-routine`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
          appclient: 'organized',
          appversion,
        },
      }
    );

    const data = await res.json();

    return { status: res.status, result: data };
  };

export const apiUserPostFeedback = async (subject: string, message: string) => {
  const {
    apiHost,
    appVersion: appversion,
    userID,
    idToken,
  } = await apiDefault();

  const res = await fetch(`${apiHost}api/v3/users/${userID}/feedback`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
      appclient: 'organized',
      appversion,
    },
    body: JSON.stringify({ subject, message }),
  });

  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }
};

export const apiUserDelete = async () => {
  const {
    apiHost,
    appVersion: appversion,
    userID,
    idToken,
  } = await apiDefault();

  const res = await fetch(`${apiHost}api/v3/users/${userID}/erase`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
      appclient: 'organized',
      appversion,
    },
  });

  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }
};

export const apiUserJoinCongregation = async ({
  cong_number,
  country_code,
  firstname,
  lastname,
}: {
  country_code: string;
  cong_number: string;
  firstname: string;
  lastname: string;
}) => {
  try {
    const {
      apiHost,
      appVersion: appversion,
      userID,
      idToken,
    } = await apiDefault();

    const res = await fetch(
      `${apiHost}api/v3/users/${userID}/join-congregation`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
          appclient: 'organized',
          appversion,
        },
        body: JSON.stringify({
          cong_number,
          country_code,
          firstname,
          lastname,
        }),
      }
    );

    const data = await res.json();

    if (res.status !== 200) {
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
