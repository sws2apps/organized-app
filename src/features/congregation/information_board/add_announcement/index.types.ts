import { InfoBoardAnnouncementType } from '@definition/information_board';
import { Dispatch, SetStateAction } from 'react';

export type AddAnnouncementProps = {
  open: boolean;
  onClose: VoidFunction;
  mode?: 'add' | 'edit';
  announcementId?: string;
};

export type AddAnnouncementDraftProps = {
  draft: InfoBoardAnnouncementType | null;
  changeDraft: Dispatch<SetStateAction<InfoBoardAnnouncementType | null>>;
};
