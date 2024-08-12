import { CongregationUpdatesResponseType } from '@definition/api';
import { apiDefault } from './common';

export const apiFetchCountries = async () => {
  const {
    apiHost,
    appVersion: appversion,
    JWLang,
    idToken,
  } = await apiDefault();

  const res = await fetch(
    `${apiHost}api/v3/congregations/countries?language=${JWLang.toUpperCase()}`,
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

  return { status: res.status, data };
};

export const apiFetchCongregations = async (country, name) => {
  const {
    apiHost,
    appVersion: appversion,
    JWLang,
    idToken,
  } = await apiDefault();

  if (apiHost === '') {
    return { data: [] };
  }

  const res = await fetch(
    `${apiHost}api/v3/congregations/search?language=${JWLang.toUpperCase()}&country=${country}&name=${name}`,
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

  return { status: res.status, data };
};

export const apiCreateCongregation = async (
  country_code,
  cong_name,
  cong_number,
  firstname,
  lastname
) => {
  const {
    apiHost,
    appVersion: appversion,
    JWLang,
    idToken,
  } = await apiDefault();

  const res = await fetch(`${apiHost}api/v3/congregations`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
      appclient: 'organized',
      appversion,
      language: JWLang.toUpperCase(),
    },
    body: JSON.stringify({
      country_code,
      cong_name,
      cong_number,
      firstname,
      lastname,
    }),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiFetchCongregationUsers = async () => {
  const {
    apiHost,
    appVersion: appversion,
    congID,
    idToken,
  } = await apiDefault();

  const res = await fetch(
    `${apiHost}api/v3/congregations/admin/${congID}/members`,
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

  return { status: res.status, data };
};

export const apiSetCongregationMasterKey = async (key: string) => {
  const {
    apiHost,
    appVersion: appversion,
    congID,
    idToken,
  } = await apiDefault();

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

  return { status: res.status, data };
};

export const apiSetCongregationAccessCode = async (access_code: string) => {
  const {
    apiHost,
    appVersion: appversion,
    congID,
    idToken,
  } = await apiDefault();

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

  return { status: res.status, data };
};

export const apiGetCongregationUpdates =
  async (): Promise<CongregationUpdatesResponseType> => {
    const {
      apiHost,
      appVersion: appversion,
      congID,
      idToken,
    } = await apiDefault();

    const res = await fetch(
      `${apiHost}api/v3/congregations/${congID}/updates-routine`,
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
