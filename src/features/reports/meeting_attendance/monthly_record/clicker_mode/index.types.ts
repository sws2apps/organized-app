export type ClickerTab = 'present' | 'online';

// Only the counts the user actually adjusted are present.
export type ClickerSaveValues = {
  present?: number;
  online?: number;
};

export type ClickerModeProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  initialTab: ClickerTab;
  recordOnline: boolean;
  presentValue: number;
  onlineValue: number;
  onSave: (values: ClickerSaveValues) => void;
};
