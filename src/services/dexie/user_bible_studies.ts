import { UserBibleStudyType } from '@definition/user_bible_studies';
import appDb from '@db/appDb';

export const dbUserBibleStudySave = async (study: UserBibleStudyType) => {
  await appDb.user_bible_studies.put(study);
};
