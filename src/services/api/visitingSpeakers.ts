import { VisitingSpeakersAccessResponseType } from '@definition/api';
import { apiDefault } from './common';

export const apiGetApprovedVisitingSpeakersAccess =
  async (): Promise<VisitingSpeakersAccessResponseType> => {
    const {
      apiHost,
      appVersion: appversion,
      congID,
      idToken,
    } = await apiDefault();

    const res = await fetch(
      `${apiHost}api/v3/congregations/meeting/${congID}/visiting-speakers/access`,
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

export const apiRequestAccessCongregationSpeakers = async (
  cong_id: string,
  request_id: string,
  key: string
) => {
  const {
    apiHost,
    appVersion: appversion,
    congID,
    idToken,
  } = await apiDefault();

  const res = await fetch(
    `${apiHost}api/v3/congregations/meeting/${congID}/visiting-speakers/request`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
        appclient: 'organized',
        appversion,
      },
      body: JSON.stringify({ cong_id, request_id, key }),
    }
  );

  const data = await res.json();

  return { status: res.status, data };
};

export const apiFindCongregationSpeakers = async (name: string) => {
  const {
    apiHost,
    appVersion: appversion,
    congID,
    idToken,
  } = await apiDefault();

  const res = await fetch(
    `${apiHost}api/v3/congregations/meeting/${congID}/visiting-speakers/congregations?name=${name}`,
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

export const apiGetPendingVisitingSpeakersAccess =
  async (): Promise<VisitingSpeakersAccessResponseType> => {
    const {
      apiHost,
      appVersion: appversion,
      congID,
      idToken,
    } = await apiDefault();

    const res = await fetch(
      `${apiHost}api/v3/congregations/meeting/${congID}/visiting-speakers/pending-access`,
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

export const apiApproveRequestCongregationSpeakers = async (
  request_id: string,
  key: string
): Promise<VisitingSpeakersAccessResponseType> => {
  const {
    apiHost,
    appVersion: appversion,
    congID,
    idToken,
  } = await apiDefault();

  const res = await fetch(
    `${apiHost}api/v3/congregations/meeting/${congID}/visiting-speakers/request/approve`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
        appclient: 'organized',
        appversion,
      },
      body: JSON.stringify({ request_id, key }),
    }
  );

  const data = await res.json();

  return { status: res.status, result: data };
};

export const apiRejectRequestCongregationSpeakers = async (
  request_id: string
): Promise<VisitingSpeakersAccessResponseType> => {
  const {
    apiHost,
    appVersion: appversion,
    congID,
    idToken,
  } = await apiDefault();

  const res = await fetch(
    `${apiHost}api/v3/congregations/meeting/${congID}/visiting-speakers/request/reject`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
        appclient: 'organized',
        appversion,
      },
      body: JSON.stringify({ request_id }),
    }
  );

  const data = await res.json();

  return { status: res.status, result: data };
};
