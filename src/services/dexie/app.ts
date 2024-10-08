// eslint-disable-next-line import/no-named-as-default
import Dexie from 'dexie';
import appDb from '@db/appDb';

export const dbAppDelete = async () => {
  await appDb.close();
  await Dexie.delete('organized');

  localStorage.clear();
};

export const dbAppOpen = async () => {
  await appDb.open();
};
