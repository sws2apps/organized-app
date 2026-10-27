import appDb from '@db/appDb';
import { PARTNER_SYNC_LOCAL_ID } from '@constants/preaching_partner';
import {
  PartnerSyncCache,
  PartnerSyncLocal,
} from '@definition/preaching_partner';
import {
  emptyPartnerCache,
  partnerCacheUnchanged,
  projectPartnerRequests,
} from '@utils/preaching_partner_sync';

export const dbPartnerSyncRead = async (scope: string) =>
  (await appDb.app_locals.get(PARTNER_SYNC_LOCAL_ID))?.partnerSync?.scopes[
    scope
  ] ?? emptyPartnerCache();

export const dbPartnerSyncUpdate = <T>(
  scope: string,
  update: (
    cache: PartnerSyncCache,
    activePersonIds: string[]
  ) => { cache: PartnerSyncCache; result: T },
  activate = false
) =>
  appDb.transaction(
    'rw',
    appDb.app_locals,
    appDb.preaching_partner_requests,
    appDb.persons,
    async () => {
      const record = await appDb.app_locals.get(PARTNER_SYNC_LOCAL_ID);
      const local: PartnerSyncLocal = record?.partnerSync ?? {
        activeScope: '',
        scopes: {},
      };
      const persons = await appDb.persons.toArray();
      const activeIds = persons
        .filter(
          (person) =>
            !person._deleted.value && !person.person_data.archived?.value
        )
        .map((person) => person.person_uid);
      const previous = local.scopes[scope] ?? emptyPartnerCache();
      const { cache, result } = update(previous, activeIds);
      const activated = activate && local.activeScope !== scope;
      if (!activated && partnerCacheUnchanged(previous, cache)) return result;
      const next = {
        ...local,
        activeScope: activate ? scope : local.activeScope,
        scopes: { ...local.scopes, [scope]: cache },
      };
      await appDb.app_locals.put({
        ...record,
        id: PARTNER_SYNC_LOCAL_ID,
        partnerSync: next,
      });
      const projected = projectPartnerRequests(cache);
      if (
        next.activeScope === scope &&
        (activated ||
          JSON.stringify(projected) !==
            JSON.stringify(projectPartnerRequests(previous)))
      ) {
        await appDb.preaching_partner_requests.clear();
        await appDb.preaching_partner_requests.bulkPut(projected);
      }
      return result;
    }
  );
