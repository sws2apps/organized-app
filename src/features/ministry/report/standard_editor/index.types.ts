import { CustomClassName } from '@definition/app';

export type TextFieldStandardProps = {
  value: number;
  onChange: (value: number) => void;
  validator?: (value: number) => boolean | Promise<boolean>;
  className?: CustomClassName;
  readOnly?: boolean;
};
