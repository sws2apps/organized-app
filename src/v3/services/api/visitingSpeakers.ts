import { GetApprovedVisitingSpeakersAccessResponseType } from '@definition/api';
import { apiDefault } from './common';

export const apiGetApprovedVisitingSpeakersAccess =
  async (): Promise<GetApprovedVisitingSpeakersAccessResponseType> => {
    const { apiHost, appVersion: appversion, congID, idToken } = await apiDefault();

    const res = await fetch(`${apiHost}api/congregations/meeting/${congID}/visiting-speakers-access`, {
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

export const apiRequestAccessCongregationSpeakers = async (cong_id: string) => {
  const { apiHost, appVersion: appversion, congID, idToken } = await apiDefault();

  const res = await fetch(`${apiHost}api/congregations/meeting/${congID}/request-speakers`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
      appclient: 'organized',
      appversion,
    },
    body: JSON.stringify({ cong_id }),
  });

  const data = await res.json();

  return { status: res.status, data };
};

export const apiFindCongregationSpeakers = async (name: string) => {
  const { apiHost, appVersion: appversion, congID, idToken } = await apiDefault();

  const res = await fetch(`${apiHost}api/congregations/meeting/${congID}/visiting-speakers-congregations`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
      appclient: 'organized',
      appversion,
      name: name,
    },
  });

  const data = await res.json();

  return { status: res.status, data };
};
