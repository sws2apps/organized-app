import { PartnerConnection } from '@definition/preaching_partner';
import {
  apiPartnerRequests,
  PartnerApiError,
} from '@services/api/preaching_partner';
import { createPartnerSyncClient } from '@services/app/preaching_partner_sync_engine';
import {
  dbPartnerSyncRead,
  dbPartnerSyncUpdate,
} from '@services/dexie/preaching_partner_sync';

const clients = new Map<string, ReturnType<typeof createPartnerSyncClient>>();
export const partnerSyncClient = (connection: PartnerConnection) => {
  let client = clients.get(connection.scope);
  if (!client) {
    client = createPartnerSyncClient(connection, {
      read: () => dbPartnerSyncRead(connection.scope),
      update: (update) => dbPartnerSyncUpdate(connection.scope, update),
      request: (mutation) => apiPartnerRequests(connection, mutation),
      online: () => navigator.onLine,
      errorStatus: (error) =>
        error instanceof PartnerApiError ? error.status : undefined,
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
