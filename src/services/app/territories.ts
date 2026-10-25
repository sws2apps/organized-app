import type { TerritorySharedSettings } from '@definition/territory_sync';
import {
  dbTerritorySettingsSave,
  dbTerritoriesEnqueue,
} from '@services/dexie/territory_sync';
import type { Territory } from '@definition/territory';
import type { TerritoryRecord } from '@definition/territory_record';
import { store } from '@states/index';
import { congIDState } from '@states/settings';
import { userIDState } from '@states/app';
import { isTest } from '@constants/index';

import { dbTerritoriesSave } from '@services/dexie/territories';

export const saveTerritoryChanges = async (
  previous: Territory[],
  next: Territory[],
  dataView: string
) => {
  const before = new Map(
    previous.map((territory) => [territory.id, territory])
  );
  const after = new Map(next.map((territory) => [territory.id, territory]));
  const updatedAt = new Date().toISOString();
  const records: TerritoryRecord[] = [];
  for (const territory of next) {
    if (
      before.get(territory.id) === territory ||
      JSON.stringify(before.get(territory.id)) === JSON.stringify(territory)
    )
      continue;
    records.push({
      id: `${dataView}:${territory.id}`,
      dataView,
      updatedAt,
      deleted: false,
      data: territory,
    });
  }
  for (const territory of previous) {
    if (!after.has(territory.id))
      records.push({
        id: `${dataView}:${territory.id}`,
        dataView,
        updatedAt,
        deleted: true,
        data: territory,
      });
  }
  if (!records.length) return;
  const congregation = store.get(congIDState);
  const user = store.get(userIDState);
  if (isTest || !congregation || !user) await dbTerritoriesSave(records);
  else await dbTerritoriesEnqueue(records, `${congregation}:${user}`);
};

export const saveTerritorySettings = async (
  settings: TerritorySharedSettings,
  baseline?: TerritorySharedSettings
) => {
  if (isTest) return;
  const congregation = store.get(congIDState);
  const user = store.get(userIDState);
  if (!congregation || !user) return;
  await dbTerritorySettingsSave(`${congregation}:${user}`, settings, {
    dirty: true,
    baseline,
  });
};
