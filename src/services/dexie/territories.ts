import appDb from '@db/appDb';
import type { TerritoryRecord } from '@definition/territory_record';
export const dbTerritoriesGetAll = () => appDb.territories.toArray();
export const dbTerritoriesSave = async (records: TerritoryRecord[]) => {
  await appDb.transaction('rw', appDb.territories, async () => {
    await appDb.territories.bulkPut(records);
  });
};
