import { PARTNER_API_TIMEOUT } from '@constants/preaching_partner';
import {
  PartnerConnection,
  PartnerWireMutation,
  PreachingPartnerRequestType,
} from '@definition/preaching_partner';
import { apiDefault } from '@services/api/common';
import { store } from '@states/index';
import { accountTypeState, userLocalUIDState } from '@states/settings';

export class PartnerApiError extends Error {
  constructor(
    public readonly status: number,
    code: string
  ) {
    super(code);
  }
}

// Stable operation IDs and the original server revision are preserved for retries.
export const apiPartnerRequests = async (
  connection: PartnerConnection,
  mutation?: PartnerWireMutation
): Promise<PreachingPartnerRequestType[]> => {
  const { apiHost, appVersion, congID, idToken, userID } = await apiDefault();
  const pocket = store.get(accountTypeState) === 'pocket';
  if (
    apiHost !== connection.apiHost ||
    congID !== connection.congregationId ||
    userID !== connection.userId ||
    pocket !== connection.pocket ||
    store.get(userLocalUIDState) !== connection.actor
  )
    throw new PartnerApiError(403, 'tr_partnerAccountChanged');
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
      signal: AbortSignal.timeout(PARTNER_API_TIMEOUT),
      ...(mutation && { body: JSON.stringify(mutation) }),
    }
  );
  const data = await response.json();
  if (!response.ok)
    throw new PartnerApiError(
      response.status,
      data?.message ?? 'tr_partnerActionFailed'
    );
  if (data.publisher_uid !== connection.actor)
    throw new PartnerApiError(403, 'tr_partnerAccountChanged');
  if (!Array.isArray(data.requests))
    throw new PartnerApiError(502, 'tr_partnerActionFailed');
  return data.requests as PreachingPartnerRequestType[];
};
