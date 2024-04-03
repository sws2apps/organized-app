export interface CustomTimePickerProps {
  ampm: boolean;
  value?: Date | null;
  label?: string;
  onChange?: () => void;
  isValueOnOpen?: boolean;
}
