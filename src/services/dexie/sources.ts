import { UpdateSpec } from 'dexie';
import appDb from '@db/appDb';
import { sourceSchema } from '@services/dexie/schema';
import { SourceWeekType } from '@definition/sources';
import { updateObject } from '@utils/common';

const dbUpdateSourcesMetadata = async () => {
  const metadata = await appDb.metadata.get(1);

  if (!metadata) return;

  metadata.metadata.sources = {
    ...metadata.metadata.sources,
    send_local: true,
  };

  await appDb.metadata.put(metadata);
};

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
  await dbUpdateSourcesMetadata();
};

export const dbSourcesUpdate = async (
  weekOf: string,
  changes: UpdateSpec<SourceWeekType>
) => {
  await appDb.sources.update(weekOf, changes);
  await dbUpdateSourcesMetadata();
};
