import { Font } from '@react-pdf/renderer';

import FontItalic from '/assets/fonts/Inter-Italic.ttf';
import FontExtraBold from '/assets/fonts/Inter-ExtraBold.ttf';
import FontBold from '/assets/fonts/Inter-Bold.ttf';
import FontSemiBold from '/assets/fonts/Inter-SemiBold.ttf';
import FontLight from '/assets/fonts/Inter-Light.ttf';
import FontMedium from '/assets/fonts/Inter-Medium.ttf';
import FontRegular from '/assets/fonts/Inter-Regular.ttf';

import NotoSansFontBold from '/assets/fonts/NotoSans-SemiBold.ttf';
import NotoSansFontRegular from '/assets/fonts/NotoSans-Regular.ttf';

import NotoSansSCFontBold from '/assets/fonts/NotoSansSC-SemiBold.ttf';
import NotoSansSCFontRegular from '/assets/fonts/NotoSansSC-Regular.ttf';

import NotoSansJPFontBold from '/assets/fonts/NotoSansJP-SemiBold.ttf';
import NotoSansJPFontRegular from '/assets/fonts/NotoSansJP-Regular.ttf';

import NotoSansHebrewBold from '/assets/fonts/NotoSansHebrew-SemiBold.ttf';
import NotoSansHebrewRegular from '/assets/fonts/NotoSansHebrew-Regular.ttf';

const HYPHENATION_MIN_LENGTH = 14;
const HYPHENATION_EDGE = 3;
const VOWELS = /[aeiouyàáâäãåæèéêëìíîïòóôöõøùúûüýÿœаеёиоуыэюяіїє]/i;

// react-pdf hyphenates with English patterns by default, which splits short words in
// narrow table cells. Short words are now kept whole, and since no dictionary is
// available, long ones are only offered vowel-consonant boundaries to break at.
Font.registerHyphenationCallback((word) => {
  if (word.length < HYPHENATION_MIN_LENGTH) return [word];

  const parts: string[] = [];
  let start = 0;

  for (let i = HYPHENATION_EDGE; i <= word.length - HYPHENATION_EDGE; i++) {
    const isBoundary = VOWELS.test(word[i - 1]) && !VOWELS.test(word[i]);

    if (isBoundary && i - start >= HYPHENATION_EDGE) {
      parts.push(word.slice(start, i));
      start = i;
    }
  }

  parts.push(word.slice(start));

  return parts.length > 1 ? parts : [word];
});

Font.register({
  family: 'Inter',
  fonts: [
    { src: FontLight, fontWeight: 300 },
    { src: FontRegular, fontWeight: 400 },
    { src: FontItalic, fontWeight: 400, fontStyle: 'italic' },
    { src: FontMedium, fontWeight: 500 },
    { src: FontSemiBold, fontWeight: 600 },
    { src: FontBold, fontWeight: 700 },
    { src: FontExtraBold, fontWeight: 800 },
  ],
});

Font.register({
  family: 'NotoSans',
  fonts: [
    { src: NotoSansFontRegular, fontWeight: 400 },
    { src: NotoSansFontBold, fontWeight: 700 },
  ],
});

Font.register({
  family: 'NotoSansSC',
  fonts: [
    { src: NotoSansSCFontRegular, fontWeight: 400 },
    { src: NotoSansSCFontBold, fontWeight: 700 },
  ],
});

Font.register({
  family: 'NotoSansJP',
  fonts: [
    { src: NotoSansJPFontRegular, fontWeight: 400 },
    { src: NotoSansJPFontBold, fontWeight: 700 },
  ],
});

Font.register({
  family: 'NotoSansHebrew',
  fonts: [
    { src: NotoSansHebrewRegular, fontWeight: 400 },
    { src: NotoSansHebrewBold, fontWeight: 700 },
  ],
});

export default () => {};
