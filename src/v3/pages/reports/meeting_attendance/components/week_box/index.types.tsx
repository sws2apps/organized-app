import { TFunction } from 'i18next';

export type WeekBoxProps = {
  weekNumber: number;
  weekend: boolean;
  onChange: (weekNumber: number, weekend: boolean, value: number) => void;
  t: TFunction<'translation', undefined>;
};
