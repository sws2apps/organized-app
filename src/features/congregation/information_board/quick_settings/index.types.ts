import { InfoBoardGeneralInformationType } from '@definition/information_board';
import { Dispatch, SetStateAction } from 'react';

export type QuickSettingsInformationBoardProps = {
  open: boolean;
  onClose: VoidFunction;
};

export type InfoBoardGeneralInformationDraftProps = {
  draft: InfoBoardGeneralInformationType | null;
  changeDraft: Dispatch<SetStateAction<InfoBoardGeneralInformationType | null>>;
};
