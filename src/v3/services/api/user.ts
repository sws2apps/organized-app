import { apiDefault } from './common';

export const apiUserLogout = async () => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid } = await apiDefault();

  await fetch(`${apiHost}api/users/logout`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', appclient: 'cpe', appversion, visitorid, uid: uid },
  });
};

export const apiPocketSignup = async (code) => {
  const { apiHost, appVersion: appversion, visitorID: visitorid } = await apiDefault();

  const res = await fetch(`${apiHost}api/sws-pocket/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', appclient: 'cpe', appversion },
    body: JSON.stringify({ visitorid, otp_code: code.toUpperCase() }),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiRequestPasswordlesssLink = async (email: string, uid?: string) => {
  const { apiHost, appVersion: appversion, appLang } = await apiDefault();

  const res = await fetch(`${apiHost}user-passwordless-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', appclient: 'cpe', appversion, applanguage: appLang },
    body: JSON.stringify({ email, uid }),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiUpdatePasswordlessInfo = async (uid) => {
  const { apiHost, appVersion: appversion, visitorID: visitorid } = await apiDefault();

  const tmpEmail = localStorage.getItem('emailForSignIn');

  const res = await fetch(`${apiHost}user-passwordless-verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', appclient: 'cpe', appversion, uid },
    body: JSON.stringify({ email: tmpEmail, visitorid }),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiSendAuthorization = async () => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid } = await apiDefault();

  const res = await fetch(`${apiHost}user-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', appclient: 'cpe', appversion, uid },
    body: JSON.stringify({ visitorid }),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiHandleVerifyOTP = async (userOTP) => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid } = await apiDefault();

  const res = await fetch(`${apiHost}api/mfa/verify-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', appclient: 'cpe', appversion, visitorid, uid },
    body: JSON.stringify({ token: userOTP }),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiValidateMe = async () => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid } = await apiDefault();

  const res = await fetch(`${apiHost}api/users/validate-me`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', appclient: 'cpe', appversion, visitorid, uid },
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiUpdateUserFullname = async (fullname) => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid, userID } = await apiDefault();

  const res = await fetch(`${apiHost}api/users/${userID}/fullname`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', appclient: 'cpe', appversion, visitorid, uid },
    body: JSON.stringify({ fullname }),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiGetUser2FA = async () => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid, userID } = await apiDefault();

  const res = await fetch(`${apiHost}api/users/${userID}/2fa`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', appclient: 'cpe', appversion, visitorid, uid },
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiDisableUser2FA = async () => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid, userID } = await apiDefault();

  const res = await fetch(`${apiHost}api/users/${userID}/2fa/disable`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', appclient: 'cpe', appversion, visitorid, uid },
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiRevokeVIPSession = async (id) => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid, userID } = await apiDefault();

  const res = await fetch(`${apiHost}api/users/${userID}/sessions`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', appclient: 'cpe', appversion, visitorid, uid },
    body: JSON.stringify({ session: id }),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiGetUserSessions = async () => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid, userID } = await apiDefault();

  const res = await fetch(`${apiHost}api/users/${userID}/sessions`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', appclient: 'cpe', appversion, visitorid, uid },
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiDeletePocketDevice = async (pocket_visitorid) => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userID } = await apiDefault();

  const res = await fetch(`${apiHost}api/sws-pocket/${userID}/devices`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', appclient: 'cpe', appversion, visitorid },
    body: JSON.stringify({ pocket_visitorid }),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiFetchPocketSessions = async () => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userID } = await apiDefault();

  const res = await fetch(`${apiHost}api/sws-pocket/${userID}/devices`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', appclient: 'cpe', appversion, visitorid },
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiFetchUserLastBackup = async () => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userID } = await apiDefault();

  const res = await fetch(`${apiHost}api/sws-pocket/${userID}/backup/last`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', appclient: 'cpe', appversion, visitorid },
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiSendUserBackup = async (reqPayload) => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userID } = await apiDefault();

  const res = await fetch(`${apiHost}api/sws-pocket/${userID}/backup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', appclient: 'cpe', appversion, visitorid },
    body: JSON.stringify(reqPayload),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiRestoreUserBackup = async () => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userID } = await apiDefault();

  const res = await fetch(`${apiHost}api/sws-pocket/${userID}/backup`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', appclient: 'cpe', appversion, visitorid },
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiPocketValidate = async () => {
  const { apiHost, appVersion: appversion, visitorID: visitorid } = await apiDefault();

  const res = await fetch(`${apiHost}api/sws-pocket/validate-me`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', appclient: 'cpe', appversion, visitorid },
  });

  const data = await res.json();

  return { status: res.status, data };
};
