import { FontSizeOptionType } from './index.types';

// scales mirror the root font sizes declared for html[data-font-size]
export const FONT_SIZE_OPTIONS: FontSizeOptionType[] = [
  { value: 'small', labelKey: 'tr_small', scale: 0.875 },
  { value: 'normal', labelKey: 'tr_normal', scale: 1 },
  { value: 'large', labelKey: 'tr_large', scale: 1.125 },
];
