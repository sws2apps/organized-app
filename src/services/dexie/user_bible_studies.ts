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
