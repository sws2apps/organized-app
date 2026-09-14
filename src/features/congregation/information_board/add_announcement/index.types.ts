import { InfoBoardAnnouncementType } from '@definition/information_board';
import { Dispatch, SetStateAction } from 'react';

export type AddAnnouncementDraftProps = {
  draft: InfoBoardAnnouncementType | null;
  changeDraft: Dispatch<SetStateAction<InfoBoardAnnouncementType | null>>;
};
