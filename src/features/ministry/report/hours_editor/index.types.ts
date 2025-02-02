export type HoursEditorProps = {
  value: string;
  onChange?: (value: string) => void;
  validator?: (value: string) => boolean | Promise<boolean>;
};
