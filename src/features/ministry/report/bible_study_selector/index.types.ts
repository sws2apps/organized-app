import { UserBibleStudyType } from '@definition/user_bible_studies';
import { MutableRefObject } from 'react';

export type BibleStudySelectorProps = {
  anchorEl: MutableRefObject<Element>;
  editable: boolean;
  handleCheckSelected: (study: UserBibleStudyType) => boolean;
  onChange: (study: UserBibleStudyType) => void;
};
