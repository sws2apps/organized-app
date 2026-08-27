import { Font } from '@react-pdf/renderer';

const MIN_LENGTH = 14;
const EDGE = 3;
const MAX_PART = 16;

const VOWELS = /[aeiouyàáâäãåæèéêëìíîïòóôöõøùúûüýÿœаеёиоуыэюяіїє]/i;

// CJK glyphs take about twice the width of a latin one, and a run of them
// carries no break opportunity of its own
const WIDE = /[ᄀ-ᅟ⺀-꓏가-힣豈-﫿︰-﹏＀-｠￠-￦]/;

/**
 * Last resort: a part that is still too wide for any cell is cut at a fixed
 * width, so a word without a single break opportunity - a cyrillic or CJK run,
 * for instance - cannot overflow its column and paint over the next one.
 */
const cutToWidth = (part: string) => {
  const parts: string[] = [];

  let current = '';
  let width = 0;

  for (const character of part) {
    const characterWidth = WIDE.test(character) ? 2 : 1;

    if (width + characterWidth > MAX_PART) {
      parts.push(current);
      current = '';
      width = 0;
    }

    current += character;
    width += characterWidth;
  }

  if (current.length > 0) parts.push(current);

  return parts;
};

/**
 * react-pdf hyphenates with English patterns by default, which splits short
 * words in narrow cells. Short words are kept whole, and since no dictionary is
 * available, long ones are only offered vowel-consonant boundaries to break at.
 */
export const splitWord = (word: string) => {
  if (word.length < MIN_LENGTH) return [word];

  const parts: string[] = [];
  let start = 0;

  for (let i = EDGE; i <= word.length - EDGE; i++) {
    const isBoundary = VOWELS.test(word[i - 1]) && !VOWELS.test(word[i]);

    if (isBoundary && i - start >= EDGE) {
      parts.push(word.slice(start, i));
      start = i;
    }
  }

  parts.push(word.slice(start));

  return parts.flatMap(cutToWidth);
};

const registerHyphenation = () => {
  Font.registerHyphenationCallback(splitWord);
};

export default registerHyphenation;
