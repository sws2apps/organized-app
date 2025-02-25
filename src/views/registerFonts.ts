import { Font } from '@react-pdf/renderer';

import FontBold from '/assets/fonts/Inter-SemiBold.ttf';
import FontLight from '/assets/fonts/Inter-Light.ttf';
import FontMedium from '/assets/fonts/Inter-Medium.ttf';
import FontRegular from '/assets/fonts/Inter-Regular.ttf';

import NotoSansFontBold from '/assets/fonts/NotoSans-SemiBold.ttf';
import NotoSansFontRegular from '/assets/fonts/NotoSans-Regular.ttf';

import NotoSansSCFontBold from '/assets/fonts/NotoSansSC-SemiBold.ttf';
import NotoSansSCFontRegular from '/assets/fonts/NotoSansSC-Regular.ttf';

import NotoSansJPFontBold from '/assets/fonts/NotoSansJP-SemiBold.ttf';
import NotoSansJPFontRegular from '/assets/fonts/NotoSansJP-Regular.ttf';

Font.register({
  family: 'Inter',
  format: 'truetype',
  fonts: [
    { src: FontRegular },
    { src: FontBold },
    { src: FontLight },
    { src: FontMedium },
  ],
});

Font.register({
  family: 'NotoSans',
  format: 'truetype',
  fonts: [{ src: NotoSansFontRegular }, { src: NotoSansFontBold }],
});

Font.register({
  family: 'NotoSansSC',
  format: 'truetype',
  fonts: [{ src: NotoSansSCFontRegular }, { src: NotoSansSCFontBold }],
});

Font.register({
  family: 'NotoSansJP',
  format: 'truetype',
  fonts: [{ src: NotoSansJPFontRegular }, { src: NotoSansJPFontBold }],
});

Font.registerHyphenationCallback((word) => [word]);

export default () => {};
