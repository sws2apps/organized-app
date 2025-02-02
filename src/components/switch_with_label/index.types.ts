export type SwitchWithLabelProps = {
  label: string;
  helper?: string;
  checked?: boolean;
  onChange?: (value: boolean) => void;
  readOnly?: boolean;
};
