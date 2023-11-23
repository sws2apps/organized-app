import { appDb } from '.';

export const cleanFieldServiceGroupDeleted = async () => {
  const allData = await appDb.fieldServiceGroup.toArray();
  const appData = allData.filter((record) => record.deleted === true);

  for await (const record of appData) {
    await appDb.fieldServiceGroup.delete(record.fieldServiceGroup_uid);
  }
};
