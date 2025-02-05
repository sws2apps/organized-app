import { UserBibleStudyType } from '@definition/user_bible_studies';
import appDb from '@db/appDb';

const dbUpdateUserBibleStudiesMetadata = async () => {
  const metadata = await appDb.metadata.get(1);

  if (!metadata) return;

  metadata.metadata.user_bible_studies = {
    ...metadata.metadata.user_bible_studies,
    send_local: true,
  };

  await appDb.metadata.put(metadata);
};

export const dbUserBibleStudySave = async (study: UserBibleStudyType) => {
  await appDb.user_bible_studies.put(study);
  await dbUpdateUserBibleStudiesMetadata();
};

export const dbUserBibleStudyClear = async () => {
  const records = await appDb.user_bible_studies.toArray();

  if (records.length === 0) return;

  for (const record of records) {
    record.person_data._deleted = true;
    record.person_data.updatedAt = new Date().toISOString();
  }

  await appDb.user_bible_studies.bulkPut(records);
};
