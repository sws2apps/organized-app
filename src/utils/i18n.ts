export const TRANSLATION_VARIATION_SEPARATOR = '|';

export const splitTranslationVariations = (value?: string): string[] => {
  if (!value) return [];

  return value
    .split(TRANSLATION_VARIATION_SEPARATOR)
    .map((variation) => variation.trim())
    .filter((variation) => variation.length > 0);
};

export const primaryTranslation = (value?: string): string => {
  return splitTranslationVariations(value).at(0) ?? '';
};
