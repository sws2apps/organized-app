export interface CPETimePickerProps {
  ampm: boolean;
  value?: Date | null;
  label?: string;
  onChange?: () => void;
}
