import Dexie from 'dexie';
import appDb from '@db/appDb';

export const dbAppDelete = async () => {
  await appDb.close();
  await Dexie.delete('organized');
};

export const dbAppOpen = async () => {
  await appDb.open();
};
