import { Style } from '@react-pdf/types';
import { LANGUAGE_LIST } from '@constants/index';

/**
 * Checks if a language is Right-to-Left (RTL)
 */
export const isRTL = (lang: string): boolean => {
  const language = LANGUAGE_LIST.find(
    (record) => record.threeLettersCode === lang
  );
  return language?.direction === 'rtl';
};

/**
 * Flips a shorthand property (4 values: top right bottom left)
 */
const flipShorthand = (
  value: string | number | undefined
): string | number | undefined => {
  if (typeof value !== 'string') return value;

  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 4) {
    // top right bottom left -> top left bottom right
    const [t, r, b, l] = parts;
    return `${t} ${l} ${b} ${r}`;
  }
  return value;
};

/**
 * Flips a single style object properties for RTL
 */
const flipStyle = (style: Style): Style => {
  if (!style) return style;

  const flipped: Record<string, unknown> = { ...style };

  // Mapping of properties to flip
  const pairs: [keyof Style, keyof Style][] = [
    ['paddingLeft', 'paddingRight'],
    ['marginLeft', 'marginRight'],
    ['borderLeft', 'borderRight'],
    ['borderTopLeftRadius', 'borderTopRightRadius'],
    ['borderBottomLeftRadius', 'borderBottomRightRadius'],
    ['left', 'right'],
  ];

  pairs.forEach(([left, right]) => {
    const leftVal = style[left];
    const rightVal = style[right];

    // Swap values if either is defined
    if (leftVal !== undefined || rightVal !== undefined) {
      flipped[left as string] = rightVal;
      flipped[right as string] = leftVal;
    }
  });

  // Handle shorthands
  if (style.padding) flipped.padding = flipShorthand(style.padding);
  if (style.margin) flipped.margin = flipShorthand(style.margin);

  // Handle explicit directions
  if (style.textAlign === 'left') {
    flipped.textAlign = 'right';
  } else if (style.textAlign === 'right') {
    flipped.textAlign = 'left';
  }

  if (style.alignItems === 'flex-start') {
    flipped.alignItems = 'flex-end';
  } else if (style.alignItems === 'flex-end') {
    flipped.alignItems = 'flex-start';
  }

  if (style.justifyContent === 'flex-start') {
    flipped.justifyContent = 'flex-end';
  } else if (style.justifyContent === 'flex-end') {
    flipped.justifyContent = 'flex-start';
  }

  if (style.flexDirection === 'row') {
    flipped.flexDirection = 'row-reverse';
  } else if (style.flexDirection === 'row-reverse') {
    flipped.flexDirection = 'row';
  }

  if (style.direction === 'ltr') {
    flipped.direction = 'rtl';
  }

  return flipped as Style;
};

/**
 * Applies RTL transformations to a stylesheet or a style object
 */
export const applyRTL = <T extends Style | Style[] | Record<string, Style>>(
  styles: T,
  lang: string
): T => {
  if (!isRTL(lang)) return styles;
  if (!styles) return styles;

  // 1. Handle Array of Styles
  if (Array.isArray(styles)) {
    return (styles as Style[]).map(flipStyle) as unknown as T;
  }

  // 2. Determine if it's a StyleSheet (Map of Styles) or a single Style object
  const entries = Object.entries(styles);
  if (entries.length === 0) return styles;

  const isStyleSheet = entries.every(
    ([, v]) => typeof v === 'object' && v !== null && !Array.isArray(v)
  );

  if (isStyleSheet) {
    const newStyles: Record<string, Style> = {};
    for (const [key, value] of entries) {
      newStyles[key] = flipStyle(value as Style);
    }
    return newStyles as unknown as T;
  }

  // 3. Handle single Style object
  return flipStyle(styles as Style) as unknown as T;
};
