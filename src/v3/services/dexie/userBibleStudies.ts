import { appDb } from '.';

export const cleanUserBibleStudiesDeleted = async () => {
  const allData = await appDb.user_bible_studies.toArray();
  const appData = allData.filter((record) => record.isDeleted === true);

  for await (const record of appData) {
    await appDb.user_bible_studies.delete(record.uid);
  }
};
