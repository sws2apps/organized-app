import {
  APIResponseMessageString,
  APIUserRequest,
  CongregationUserType,
} from '@definition/api';
import { apiDefault } from './common';
import { AppRoleType } from '@definition/app';
import { APRecordType } from '@definition/ministry';

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

export const apiFetchCongregations = async (country: string, name: string) => {
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
  country_code: string,
  cong_name: string,
  cong_number: string,
  firstname: string,
  lastname: string
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

export const apiGetCongregationMasterKey =
  async (): Promise<APIResponseMessageString> => {
    const {
      apiHost,
      appVersion: appversion,
      congID,
      idToken,
    } = await apiDefault();

    const res = await fetch(
      `${apiHost}api/v3/congregations/admin/${congID}/master-key`,
      {
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

    return { status: res.status, message: data?.message };
  };

export const apiGetCongregationAccessCode =
  async (): Promise<APIResponseMessageString> => {
    const {
      apiHost,
      appVersion: appversion,
      congID,
      idToken,
    } = await apiDefault();

    const res = await fetch(
      `${apiHost}api/v3/congregations/admin/${congID}/access-code`,
      {
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

    return { status: res.status, message: data?.message };
  };

export const apiPocketUserCreate = async ({
  cong_person_uid,
  cong_role,
  user_firstname,
  user_lastname,
  user_secret_code,
}: {
  user_firstname: string;
  user_lastname: string;
  user_secret_code: string;
  cong_role: string[];
  cong_person_uid: string;
}) => {
  try {
    const {
      apiHost,
      appVersion: appversion,
      congID,
      idToken,
    } = await apiDefault();

    const res = await fetch(
      `${apiHost}api/v3/congregations/admin/${congID}/pocket-user`,
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
          cong_person_uid,
          cong_role,
          user_firstname,
          user_lastname,
          user_secret_code,
        }),
      }
    );

    const data = await res.json();

    if (res.status !== 200) {
      throw new Error(data.message);
    }

    return data as CongregationUserType[];
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const apiCongregationUsersGet = async () => {
  try {
    const {
      apiHost,
      appVersion: appversion,
      congID,
      idToken,
    } = await apiDefault();

    const res = await fetch(
      `${apiHost}api/v3/congregations/admin/${congID}/users`,
      {
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

    if (res.status !== 200) {
      throw new Error(data.message);
    }

    return data as CongregationUserType[];
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const apiCongregationUserUpdate = async ({
  user_id,
  cong_person_uid,
  cong_role,
  cong_person_delegates,
  user_secret_code,
  first_name,
  last_name,
}: {
  user_id: string;
  user_secret_code?: string;
  cong_role: AppRoleType[];
  cong_person_uid: string;
  cong_person_delegates: string[];
  first_name: string;
  last_name: string;
}) => {
  try {
    const {
      apiHost,
      appVersion: appversion,
      congID,
      idToken,
    } = await apiDefault();

    const res = await fetch(
      `${apiHost}api/v3/congregations/admin/${congID}/users/${user_id}`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
          appclient: 'organized',
          appversion,
        },
        body: JSON.stringify({
          cong_person_uid,
          cong_role,
          cong_person_delegates,
          user_secret_code,
          first_name,
          last_name,
        }),
      }
    );

    const data = await res.json();

    if (res.status !== 200) {
      throw new Error(data.message);
    }

    return data as CongregationUserType[];
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const apiAdminRevokeUserSession = async (
  user_id: string,
  identifier: string
) => {
  try {
    const {
      apiHost,
      appVersion: appversion,
      congID,
      idToken,
    } = await apiDefault();

    const res = await fetch(
      `${apiHost}api/v3/congregations/admin/${congID}/users/${user_id}/sessions`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
          appclient: 'organized',
          appversion,
        },
        body: JSON.stringify({ identifier }),
      }
    );

    const data = await res.json();

    if (res.status !== 200) {
      throw new Error(data.message);
    }

    return data as CongregationUserType[];
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const apiAdminDeletePocketCode = async (user_id: string) => {
  try {
    const {
      apiHost,
      appVersion: appversion,
      congID,
      idToken,
    } = await apiDefault();

    const res = await fetch(
      `${apiHost}api/v3/congregations/admin/${congID}/pocket-user/${user_id}`,
      {
        method: 'DELETE',
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

    if (res.status !== 200) {
      throw new Error(data.message);
    }

    return data as CongregationUserType[];
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const apiAdminGlobalSearchUser = async (email: string) => {
  const {
    apiHost,
    appVersion: appversion,
    congID,
    idToken,
  } = await apiDefault();

  const res = await fetch(
    `${apiHost}api/v3/congregations/admin/${congID}/users/global?email=${email}`,
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

export const apiCreateUser = async ({
  cong_person_uid,
  cong_role,
  user_firstname,
  user_lastname,
  user_id,
}: {
  user_firstname: string;
  user_lastname: string;
  user_id: string;
  cong_role: string[];
  cong_person_uid: string;
}) => {
  try {
    const {
      apiHost,
      appVersion: appversion,
      congID,
      idToken,
    } = await apiDefault();

    const res = await fetch(
      `${apiHost}api/v3/congregations/admin/${congID}/users`,
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
          cong_person_uid,
          cong_role,
          user_firstname,
          user_lastname,
          user_id,
        }),
      }
    );

    const data = await res.json();

    if (res.status !== 200) {
      throw new Error(data.message);
    }

    return data as CongregationUserType[];
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const apiCongregationUserDelete = async (user_id: string) => {
  try {
    const {
      apiHost,
      appVersion: appversion,
      congID,
      idToken,
    } = await apiDefault();

    const res = await fetch(
      `${apiHost}api/v3/congregations/admin/${congID}/users/${user_id}`,
      {
        method: 'DELETE',
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

    if (res.status !== 200) {
      throw new Error(data.message);
    }

    return data as CongregationUserType[];
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const apiCongregationSaveApplication = async (
  application: APRecordType
) => {
  const {
    apiHost,
    appVersion: appversion,
    congID,
    idToken,
  } = await apiDefault();

  const res = await fetch(
    `${apiHost}api/v3/congregations/${congID}/applications/${application.request_id}`,
    {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
        appclient: 'organized',
        appversion,
      },
      body: JSON.stringify({ application }),
    }
  );

  if (res.ok && res.status === 200) {
    const data = await res.json();

    return data as APRecordType[];
  }

  if (res.status !== 200) {
    const data = await res.json();

    throw new Error(data.message);
  }
};

export const apiCongregationDeleteApplication = async (request_id: string) => {
  const {
    apiHost,
    appVersion: appversion,
    congID,
    idToken,
  } = await apiDefault();

  const res = await fetch(
    `${apiHost}api/v3/congregations/${congID}/applications/${request_id}`,
    {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
        appclient: 'organized',
        appversion,
      },
    }
  );

  if (res.ok && res.status === 200) {
    const data = await res.json();

    return data as APRecordType[];
  }

  if (res.status !== 200) {
    const data = await res.json();

    throw new Error(data.message);
  }
};

export const apiSetUserUid = async (user_uid: string) => {
  const {
    apiHost,
    appVersion: appversion,
    congID,
    idToken,
  } = await apiDefault();

  const res = await fetch(
    `${apiHost}api/v3/congregations/admin/${congID}/local-uid`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
        appclient: 'organized',
        appversion,
      },
      body: JSON.stringify({ user_uid }),
    }
  );

  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }

  return data;
};

export const apiCongregationDelete = async (key: string) => {
  const {
    apiHost,
    appVersion: appversion,
    congID,
    idToken,
  } = await apiDefault();

  const res = await fetch(
    `${apiHost}api/v3/congregations/admin/${congID}/erase`,
    {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
        appclient: 'organized',
        appversion,
      },
      body: JSON.stringify({ key }),
    }
  );

  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }
};

export const apiCongregationJoinRequestDecline = async (user: string) => {
  try {
    const {
      apiHost,
      appVersion: appversion,
      congID,
      idToken,
    } = await apiDefault();

    const res = await fetch(
      `${apiHost}api/v3/congregations/admin/${congID}/join-requests`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
          appclient: 'organized',
          appversion,
          user,
        },
      }
    );

    const data = await res.json();

    if (res.status !== 200) {
      throw new Error(data.message);
    }

    return data as APIUserRequest[];
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const apiCongregationJoinRequestAccept = async ({
  firstname,
  lastname,
  role,
  user,
  person_uid,
}: {
  user: string;
  role: AppRoleType[];
  firstname: string;
  lastname: string;
  person_uid: string;
}) => {
  try {
    const {
      apiHost,
      appVersion: appversion,
      congID,
      idToken,
      appLang,
    } = await apiDefault();

    const res = await fetch(
      `${apiHost}api/v3/congregations/admin/${congID}/join-requests`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
          appclient: 'organized',
          appversion,
          user,
          applanguage: appLang,
        },
        body: JSON.stringify({ firstname, lastname, role, person_uid }),
      }
    );

    const data = await res.json();

    if (res.status !== 200) {
      throw new Error(data.message);
    }

    return data as APIUserRequest[];
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
