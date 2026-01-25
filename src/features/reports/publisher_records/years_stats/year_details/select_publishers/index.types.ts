import { ChangeEvent } from 'react';

export type SelectPublishersProps = {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
};
