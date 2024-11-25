import {
  APFormOutgoing,
  UserLoginResponseType,
  UserSessionsResponseType,
} from '@definition/api';
import { apiDefault } from './common';
import { APRecordType } from '@definition/ministry';

export const apiPocketSignup = async (code: string) => {
  const { apiHost, appVersion: appversion } = await apiDefault();

  const res = await fetch(`${apiHost}api/v3/pockets/signup`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      appclient: 'organized',
      appversion,
    },
    body: JSON.stringify({ code }),
  });

  const data = (await res.json()) as UserLoginResponseType;

  return { status: res.status, data };
};

export const apiPocketValidateMe = async () => {
  const { apiHost, appVersion: appversion } = await apiDefault();

  const res = await fetch(`${apiHost}api/v3/pockets/validate-me`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      appclient: 'organized',
      appversion,
    },
  });

  const data = (await res.json()) as UserLoginResponseType;

  return { status: res.status, result: data };
};

export const apiGetPocketSessions =
  async (): Promise<UserSessionsResponseType> => {
    const { apiHost, appVersion: appversion } = await apiDefault();

    const res = await fetch(`${apiHost}api/v3/pockets/sessions`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
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

export const apiRevokePocketSession = async (id: string) => {
  const { apiHost, appVersion: appversion } = await apiDefault();

  const res = await fetch(`${apiHost}api/v3/pockets/sessions`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      appclient: 'organized',
      appversion,
    },
    body: JSON.stringify({ identifier: id }),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiPocketFieldServiceReportPost = async (report: object) => {
  const { apiHost, appVersion: appversion } = await apiDefault();

  const res = await fetch(`${apiHost}api/v3/pockets/field-service-reports`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      appclient: 'organized',
      appversion,
    },
    body: JSON.stringify({ report }),
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

export const apiGetPocketApplications = async (): Promise<APRecordType[]> => {
  const { apiHost, appVersion: appversion } = await apiDefault();

  const res = await fetch(`${apiHost}api/v3/pockets/applications`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
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

export const apiPocketSubmitApplication = async (
  application: APFormOutgoing
) => {
  const { apiHost, appVersion: appversion } = await apiDefault();

  const res = await fetch(`${apiHost}api/v3/pockets/applications`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
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

export const apiPocketDelete = async () => {
  const { apiHost, appVersion: appversion } = await apiDefault();

  const res = await fetch(`${apiHost}api/v3/pockets/erase`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      appclient: 'organized',
      appversion,
    },
  });

  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }
};
