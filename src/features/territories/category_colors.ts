import { BadgeColor } from '@definition/app';
import { CATEGORY_COLORS, CategoryColor } from '@definition/territory';

const BLUE = 'var(--midweek-meeting)';

// categories saved before the fixed palette used the theme's 'accent'
export const toCategoryColor = (value: string): CategoryColor =>
  CATEGORY_COLORS.includes(value as CategoryColor)
    ? (value as CategoryColor)
    : 'blue';

// the solid colour, for swatches and dots
export const categorySwatch = (value: string) => {
  const color = toCategoryColor(value);

  if (color === 'blue') return BLUE;
  if (color === 'grey') return 'var(--grey-350)';

  return `var(--${color}-main)`;
};

// the badge the app already draws for green, orange, red and grey; blue has
// no badge colour of its own, so it borrows the grey one and repaints it in
// the fixed midweek blue
export const categoryBadge = (
  value: string
): { color: BadgeColor; sx?: Record<string, unknown> } => {
  const color = toCategoryColor(value);

  if (color !== 'blue') return { color };

  return {
    color: 'grey',
    sx: {
      background: `color-mix(in srgb, ${BLUE} 16%, transparent)`,
      // the badge text sets its colour with a doubled class (&&), so match it
      '&& p': { color: BLUE },
    },
  };
};
