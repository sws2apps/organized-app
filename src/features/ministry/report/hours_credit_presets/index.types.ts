import { MutableRefObject } from 'react';

export type HoursCreditPresetsProps = {
  anchorEl: MutableRefObject<Element>;
  onSelect: (value: number, name?: string) => void;
  readOnly?: boolean;
};
