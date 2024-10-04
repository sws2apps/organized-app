import { UserLoginResponseType } from '@definition/api';
import { apiDefault } from './common';

export const apiPocketSignup = async (code: string) => {
  const { apiHost, appVersion: appversion } = await apiDefault();

  const res = await fetch(`${apiHost}api/v3/pocket/signup`, {
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

  const res = await fetch(`${apiHost}api/v3/pocket/validate-me`, {
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
