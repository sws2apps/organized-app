import { UserBibleStudyType } from '@definition/user_bible_studies';

export type BibleStudyItemProps = {
  bibleStudy: UserBibleStudyType;
  onEdit: (study: UserBibleStudyType) => void;
  selected: boolean;
  onSelect: (study: UserBibleStudyType) => void;
};
