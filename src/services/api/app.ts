import { apiDefault } from './common';

export const apiFeatureFlagsGet = async (
  installation: string,
  user?: string
) => {
  try {
    const { apiHost, appVersion: appversion, idToken } = await apiDefault();

    const res = await fetch(`${apiHost}api/v3/public/feature-flags`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
        appclient: 'organized',
        appversion,
        installation,
        user,
      },
    });

    const data = await res.json();

    if (res.status !== 200) {
      throw new Error(data?.message);
    }

    return data as Record<string, boolean>;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
