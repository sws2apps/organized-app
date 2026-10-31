import { PARTNER_KEY_ERROR } from '@constants/preaching_partner';
import {
  PartnerConnection,
  PartnerWireMutation,
} from '@definition/preaching_partner';
import {
  apiPartnerRequests,
  PartnerApiError,
} from '@services/api/preaching_partner';
import { createPartnerSyncClient } from '@services/app/preaching_partner_sync_engine';
import {
  openPartnerRequests,
  sealPartnerMutation,
} from '@services/app/preaching_partner_crypto';
import { decryptData } from '@services/encryption';
import { store } from '@states/index';
import { congAccessCodeState } from '@states/settings';
import {
  dbPartnerSyncRead,
  dbPartnerSyncUpdate,
} from '@services/dexie/preaching_partner_sync';

const accessCodes = new Map<string, string>();

const fetchPartnerRequests = async (
  connection: PartnerConnection,
  payload?: PartnerWireMutation
) => {
  const { cong_access_code, requests } = await apiPartnerRequests(
    connection,
    payload
  );
  let accessCode: string;
  // the same key unwrapping reports and applications use
  try {
    accessCode = decryptData(
      cong_access_code,
      store.get(congAccessCodeState),
      'access_code'
    );
  } catch {
    accessCodes.delete(connection.scope);
    throw new Error(PARTNER_KEY_ERROR);
  }
  accessCodes.set(connection.scope, accessCode);
  return openPartnerRequests(requests, accessCode);
};

const partnerAccessCode = async (connection: PartnerConnection) => {
  if (!accessCodes.has(connection.scope))
    await fetchPartnerRequests(connection);
  return accessCodes.get(connection.scope) as string;
};

const clients = new Map<string, ReturnType<typeof createPartnerSyncClient>>();
export const partnerSyncClient = (connection: PartnerConnection) => {
  let client = clients.get(connection.scope);
  if (!client) {
    client = createPartnerSyncClient(connection, {
      read: () => dbPartnerSyncRead(connection.scope),
      update: (update) => dbPartnerSyncUpdate(connection.scope, update),
      seal: async (mutation) =>
        sealPartnerMutation(mutation, await partnerAccessCode(connection)),
      request: (payload) => fetchPartnerRequests(connection, payload),
      online: () => navigator.onLine,
      errorStatus: (error) =>
        error instanceof PartnerApiError ? error.status : undefined,
      errorMessage: (error) =>
        error instanceof Error && error.message === PARTNER_KEY_ERROR
          ? PARTNER_KEY_ERROR
          : undefined,
    });
    clients.set(connection.scope, client);
  }
  return client;
};
export const activatePartnerConnection = async (
  connection: PartnerConnection
) => {
  await dbPartnerSyncUpdate(
    connection.scope,
    (cache) => ({ cache, result: undefined }),
    true
  );
  await partnerSyncClient(connection).synchronize();
};
