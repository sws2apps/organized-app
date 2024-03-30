import { apiDefault } from './common';

export const apiFetchCountries = async () => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid, JWLang } = await apiDefault();

  const res = await fetch(`${apiHost}api/congregations/countries`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      appclient: 'organized',
      appversion,
      uid,
      visitorid,
      language: JWLang.toUpperCase(),
    },
  });
  const data = await res.json();

  return { status: res.status, data };
};

export const apiFetchCongregations = async (country, name) => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid, JWLang } = await apiDefault();

  if (apiHost === '' || visitorid === '') {
    return { data: [] };
  }

  const res = await fetch(`${apiHost}api/congregations/list-by-country`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      appclient: 'organized',
      appversion,
      uid,
      visitorid,
      language: JWLang.toUpperCase(),
      country,
      name,
    },
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiCreateCongregation = async (country_code, cong_name, cong_number, firstname, lastname) => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid, JWLang } = await apiDefault();

  const res = await fetch(`${apiHost}api/congregations`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      appclient: 'organized',
      appversion,
      visitorid,
      uid,
      language: JWLang.toUpperCase(),
    },
    body: JSON.stringify({ country_code, cong_name, cong_number, firstname, lastname }),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiFetchCongregationUsers = async () => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid, congID } = await apiDefault();

  const res = await fetch(`${apiHost}api/congregations/admin/${congID}/members`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', appclient: 'organized', appversion, visitorid, uid },
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiSearchVIPUser = async (search) => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid, congID } = await apiDefault();

  const res = await fetch(`${apiHost}api/congregations/admin/${congID}/members/find?search=${search}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', appclient: 'organized', appversion, visitorid, uid },
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiCreateVIPUser = async (id) => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid, congID } = await apiDefault();

  const res = await fetch(`${apiHost}api/congregations/admin/${congID}/members`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', appclient: 'organized', appversion, visitorid, uid },
    body: JSON.stringify({ user_id: id }),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiCreatePocketUser = async (person_name, person_uid) => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid, congID } = await apiDefault();

  const res = await fetch(`${apiHost}api/congregations/admin/${congID}/pockets`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', appclient: 'organized', appversion, visitorid, uid },
    body: JSON.stringify({ username: person_name, user_local_uid: person_uid }),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiGeneratePocketCode = async (id) => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid, congID } = await apiDefault();

  const res = await fetch(`${apiHost}api/congregations/admin/${congID}/pockets/${id}/code`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', appclient: 'organized', appversion, visitorid, uid },
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiDeletePocketCode = async (id) => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid, congID } = await apiDefault();

  const res = await fetch(`${apiHost}api/congregations/admin/${congID}/pockets/${id}/code`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', appclient: 'organized', appversion, visitorid, uid },
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiDeletePocketDevice = async (id, pocket_visitorid) => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid, congID } = await apiDefault();

  const res = await fetch(`${apiHost}api/congregations/admin/${congID}/pockets/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', appclient: 'organized', appversion, visitorid, uid },
    body: JSON.stringify({ pocket_visitorid }),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiRevokeVIPUserSession = async (id, session_visitorid) => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid } = await apiDefault();

  const res = await fetch(`${apiHost}api/users/${id}/sessions`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', appclient: 'organized', appversion, visitorid, uid },
    body: JSON.stringify({ session: session_visitorid }),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiSaveVIPUser = async (id, user_role, user_members_delegate, user_local_uid) => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid, congID } = await apiDefault();

  const res = await fetch(`${apiHost}api/congregations/admin/${congID}/members/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', appclient: 'organized', appversion, visitorid, uid },
    body: JSON.stringify({ user_role, user_members_delegate, user_local_uid }),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiSavePocketUser = async (id, user_role, user_members_delegate, user_local_uid) => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid, congID } = await apiDefault();

  const res = await fetch(`${apiHost}api/congregations/admin/${congID}/pockets/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', appclient: 'organized', appversion, visitorid, uid },
    body: JSON.stringify({ user_role, user_members_delegate, user_local_uid }),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiDeleteCongregationUser = async (id) => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid, congID } = await apiDefault();

  const res = await fetch(`${apiHost}api/congregations/admin/${congID}/members/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', appclient: 'organized', appversion, visitorid, uid },
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiFetchCongregationLastBackup = async () => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid, congID } = await apiDefault();

  const res = await fetch(`${apiHost}api/congregations/${congID}/backup/last`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', appclient: 'organized', appversion, visitorid, uid },
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiSendCongregationBackup = async (reqPayload) => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid, congID } = await apiDefault();

  const res = await fetch(`${apiHost}api/congregations/${congID}/backup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', appclient: 'organized', appversion, visitorid, uid },
    body: JSON.stringify(reqPayload),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiRestoreCongregationBackup = async () => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid, congID } = await apiDefault();

  const res = await fetch(`${apiHost}api/congregations/${congID}/backup`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', appclient: 'organized', appversion, visitorid, uid },
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiSetCongregationEncryption = async (key) => {
  const { apiHost, appVersion: appversion, visitorID: visitorid, userUID: uid, congID } = await apiDefault();

  const res = await fetch(`${apiHost}api/congregations/admin/${congID}/encryption`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', appclient: 'organized', appversion, visitorid, uid },
    body: JSON.stringify({ encryption_code: key }),
  });

  const data = await res.json();

  return { status: res.status, data };
};
