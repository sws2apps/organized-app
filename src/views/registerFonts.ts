import { Font } from '@react-pdf/renderer';

const FontItalic = '/assets/fonts/Inter-Italic.ttf';
const FontExtraBold = '/assets/fonts/Inter-ExtraBold.ttf';
const FontBold = '/assets/fonts/Inter-Bold.ttf';
const FontSemiBold = '/assets/fonts/Inter-SemiBold.ttf';
const FontLight = '/assets/fonts/Inter-Light.ttf';
const FontMedium = '/assets/fonts/Inter-Medium.ttf';
const FontRegular = '/assets/fonts/Inter-Regular.ttf';

const NotoSansFontBold = '/assets/fonts/NotoSans-SemiBold.ttf';
const NotoSansFontRegular = '/assets/fonts/NotoSans-Regular.ttf';

const NotoSansSCFontBold = '/assets/fonts/NotoSansSC-SemiBold.ttf';
const NotoSansSCFontRegular = '/assets/fonts/NotoSansSC-Regular.ttf';

const NotoSansJPFontBold = '/assets/fonts/NotoSansJP-SemiBold.ttf';
const NotoSansJPFontRegular = '/assets/fonts/NotoSansJP-Regular.ttf';

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
