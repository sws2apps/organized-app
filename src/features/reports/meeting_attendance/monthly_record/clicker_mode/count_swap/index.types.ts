import { ClickerTab } from '../index.types';

export type CountSwapProps = {
  tab: ClickerTab;
  value: number;
  label: string;
  shake?: number; // bump to trigger a denial shake
};
