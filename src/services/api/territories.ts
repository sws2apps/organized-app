import { store } from '@states/index';
import { accountTypeState, congIDState } from '@states/settings';
import { userIDState } from '@states/app';
import { apiDefault } from '@services/api/common';
import type {
  TerritoryBatch,
  TerritorySnapshot,
  TerritoryWirePolicy,
} from '@definition/territory_sync';

export class TerritoryApiError extends Error {
  constructor(public readonly status: number) {
    super('Territory request failed');
  }
}
const request = async <T>(
  scope: string,
  path: string,
  method = 'GET',
  body?: unknown
): Promise<T> => {
  const { apiHost, congID, idToken, appVersion, isOnline } = await apiDefault();
  if (!apiHost || !congID || !isOnline) throw new TerritoryApiError(0);
  if (`${congID}:${store.get(userIDState)}` !== scope)
    throw new TerritoryApiError(403);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    appclient: 'organized',
    appversion: appVersion,
  };
  if (store.get(accountTypeState) !== 'pocket' && idToken)
    headers.Authorization = `Bearer ${idToken}`;
  const response = await fetch(
    `${apiHost}api/v3/congregations/${encodeURIComponent(congID)}/territories${path}`,
    {
      method,
      headers,
      credentials: 'include',
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    }
  );
  if (`${store.get(congIDState)}:${store.get(userIDState)}` !== scope)
    throw new TerritoryApiError(403);
  if (!response.ok) throw new TerritoryApiError(response.status);
  return response.json();
};
export const apiGetTerritories = (scope: string) =>
  request<TerritorySnapshot>(scope, '');
export const apiSendTerritories = (scope: string, batch: TerritoryBatch) =>
  request<{ revision: number }>(scope, '/commands', 'POST', batch);
export const apiSetTerritoryPolicy = (
  scope: string,
  policy: TerritoryWirePolicy
) => request(scope, '/policy', 'PUT', policy);
