import Dexie from 'dexie';
import appDb from '@shared/indexedDb/appDb';

export const dbAppDelete = async () => {
  await appDb.close();
  await Dexie.delete('organized');
};

export const dbAppOpen = async () => {
  await appDb.open();
};

export const dbExportDataOnline = async () => {
  // NEW BACKUP ACTION
};
