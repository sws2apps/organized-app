import { ReactElement } from 'react';

export type PresetItemProps = {
  preset: {
    icon: ReactElement;
    name: string;
    value: number;
  };
  onClose: VoidFunction;
  onSelect: (value: number, name?: string) => void;
};
