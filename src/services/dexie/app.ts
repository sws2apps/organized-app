import Dexie from 'dexie';
import appDb from '@db/appDb';
import { MetadataRecordType } from '@definition/metadata';

export const dbAppDelete = async () => {
  await appDb.close();
  await Dexie.delete('organized');
};

export const dbAppOpen = async () => {
  await appDb.open();
};

export const dbResetExportState = async () => {
  const metadata = await appDb.metadata.get(1);

  const oldMetadata = metadata.metadata;
  const newMetadata = {} as MetadataRecordType['metadata'];

  for (const [key, values] of Object.entries(oldMetadata)) {
    newMetadata[key] = { version: values.version, send_local: true };
  }

  await appDb.metadata.update(metadata.id, {
    metadata: newMetadata,
  });
};
