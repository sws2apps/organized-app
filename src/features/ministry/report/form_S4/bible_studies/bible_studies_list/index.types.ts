import { UserBibleStudyType } from '@definition/user_bible_studies';

export type BibleStudiesListProps = {
  bibleStudies: UserBibleStudyType[];
  onDelete: (study: UserBibleStudyType) => void;
  readOnly: boolean;
};
