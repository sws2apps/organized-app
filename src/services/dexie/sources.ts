import { UpdateSpec } from 'dexie';
import appDb from '@db/appDb';
import { sourceSchema } from '@services/dexie/schema';
import { SourceWeekType } from '@definition/sources';
import { updateObject } from '@utils/common';

export const dbSourcesSave = async (srcData: SourceWeekType) => {
  const findSource = await appDb.sources.get(srcData.weekOf);

  if (!findSource) {
    const newSource = structuredClone(sourceSchema);
    newSource.weekOf = srcData.weekOf;

    await appDb.sources.put(newSource);
  }

  const source = await appDb.sources.get(srcData.weekOf);

  const newSource = structuredClone(source);
  updateObject(newSource, srcData);

  await appDb.sources.put(newSource);
};

export const dbSourcesUpdate = async (
  weekOf: string,
  changes: UpdateSpec<SourceWeekType>
) => {
  await appDb.sources.update(weekOf, changes);
};
