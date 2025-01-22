import { UserBibleStudyType } from '@definition/user_bible_studies';

export type BibleStudyEditorProps = {
  open: boolean;
  onClose: VoidFunction;
  bibleStudy?: UserBibleStudyType;
};
