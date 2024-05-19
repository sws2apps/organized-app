import { GetUser2FAResponseType, GetUserSessionsType, ValidateMeResponseType } from '@definition/api';
import { apiDefault } from './common';

export const apiUserLogout = async () => {
  const { apiHost, appVersion: appversion, idToken } = await apiDefault();

  await fetch(`${apiHost}api/users/logout`, {
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

  const res = await fetch(`${apiHost}user-passwordless-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', appclient: 'organized', appversion, applanguage: appLang },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiUpdatePasswordlessInfo = async () => {
  const { apiHost, appVersion: appversion, idToken } = await apiDefault();

  const tmpEmail = localStorage.getItem('emailForSignIn');

  const res = await fetch(`${apiHost}user-passwordless-verify`, {
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

  const res = await fetch(`${apiHost}user-login`, {
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

  const res = await fetch(`${apiHost}api/mfa/verify-token`, {
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

  const res = await fetch(`${apiHost}api/users/validate-me`, {
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

export const apiGetUser2FA = async (): Promise<GetUser2FAResponseType> => {
  const { apiHost, appVersion: appversion, userID, idToken } = await apiDefault();

  const res = await fetch(`${apiHost}api/users/${userID}/2fa`, {
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
  const { apiHost, appVersion: appversion, userID, idToken } = await apiDefault();

  const res = await fetch(`${apiHost}api/users/${userID}/2fa/disable`, {
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
  const { apiHost, appVersion: appversion, userID, idToken } = await apiDefault();

  const res = await fetch(`${apiHost}api/users/${userID}/sessions`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
      appclient: 'organized',
      appversion,
    },
    body: JSON.stringify({ session: id }),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiGetUserSessions = async (): Promise<GetUserSessionsType> => {
  const { apiHost, appVersion: appversion, userID, idToken } = await apiDefault();

  const res = await fetch(`${apiHost}api/users/${userID}/sessions`, {
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

  return { status: res.status, result: data.message ? { message: data.message } : { sessions: data } };
};
