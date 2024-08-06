import { ChangeEvent } from 'react';

export type QuickSettingsModalWindowProps = {
  showTimeAwayToAllUsers: boolean;

  onChange?: (e: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
};
