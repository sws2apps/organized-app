import { PartnerMutation, PreachingPartnerRequestType } from '@definition/preaching_partner';
import { apiDefault } from '@services/api/common';
import { store } from '@states/index';
import { accountTypeState } from '@states/settings';

// Keep operation IDs stable across network retries; the server rejects changed payloads.
export const apiPartnerRequests = async (
  mutation?: PartnerMutation & { operationId: string }
): Promise<PreachingPartnerRequestType[]> => {
  const { apiHost, appVersion, congID, idToken } = await apiDefault();
  const pocket = store.get(accountTypeState) === 'pocket';
  const resource = pocket ? 'pockets' : 'congregations';
  const response = await fetch(
    `${apiHost}api/v3/preaching-partner/${resource}/${encodeURIComponent(congID)}`,
    {
      method: mutation ? 'POST' : 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        appclient: 'organized',
        appversion: appVersion,
        ...(!pocket && { Authorization: `Bearer ${idToken}` }),
      },
      ...(mutation && { body: JSON.stringify(mutation) }),
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data?.message ?? 'tr_partnerActionFailed');
  if (!Array.isArray(data.requests)) throw new Error('tr_partnerActionFailed');
  return data.requests as PreachingPartnerRequestType[];
};
