export type BibleStudiesEditorProps = {
  value: number;
  onChange: (value: number) => void;
  validator: (value: number) => boolean | Promise<boolean>;
};
