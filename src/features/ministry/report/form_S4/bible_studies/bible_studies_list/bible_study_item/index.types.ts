import { UserBibleStudyType } from '@definition/user_bible_studies';

export type BibleStudyItemProps = {
  bibleStudy: UserBibleStudyType;
  readOnly: boolean;
  onDelete: (study: UserBibleStudyType) => void;
};
