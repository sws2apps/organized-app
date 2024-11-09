import { apiDefault } from './common';

export const apiRequestPasswordlesssLink = async (email) => {
  const { apiHost, appversion, applanguage } = await apiDefault();

  const res = await fetch(`${apiHost}api/v3/user-passwordless-login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      appclient: 'organized',
      appversion,
      applanguage,
    },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }

  return data;
};

export const apiUpdatePasswordlessInfo = async () => {
  const { apiHost, appversion, idToken } = await apiDefault();

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

  if (res.status !== 200) {
    throw new Error(data.message);
  }

  return data;
};

export const apiSendAuthorization = async () => {
  const { apiHost, appversion, idToken } = await apiDefault();

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

  if (res.status !== 200) {
    throw new Error(data.message);
  }

  return data;
};

export const apiHandleVerifyOTP = async (userOTP) => {
  const { apiHost, appversion, idToken } = await apiDefault();

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

  if (res.status !== 200) {
    throw new Error(data.message);
  }

  return data;
};

export const apiSetCongregationMasterKey = async (key) => {
  const { apiHost, appversion, idToken, congID } = await apiDefault();

  const res = await fetch(
    `${apiHost}api/v3/congregations/admin/${congID}/master-key`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
        appclient: 'organized',
        appversion,
      },
      body: JSON.stringify({ cong_master_key: key }),
    }
  );

  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }

  return data;
};

export const apiSetCongregationAccessCode = async (access_code) => {
  const { apiHost, appversion, idToken, congID } = await apiDefault();

  const res = await fetch(
    `${apiHost}api/v3/congregations/admin/${congID}/access-code`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
        appclient: 'organized',
        appversion,
      },
      body: JSON.stringify({ cong_access_code: access_code }),
    }
  );

  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }

  return data;
};
