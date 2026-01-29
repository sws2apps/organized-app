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

  fonts: [{ src: NotoSansFontRegular }, { src: NotoSansFontBold }],
});

Font.register({
  family: 'NotoSansSC',

  fonts: [{ src: NotoSansSCFontRegular }, { src: NotoSansSCFontBold }],
});

Font.register({
  family: 'NotoSansJP',

  fonts: [{ src: NotoSansJPFontRegular }, { src: NotoSansJPFontBold }],
});

export default () => {};
