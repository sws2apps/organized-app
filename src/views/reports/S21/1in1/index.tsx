import { Document, Font, Page } from '@react-pdf/renderer';
import { LANGUAGE_LIST } from '@constants/index';
import { S21Type } from '../shared/index.types';
import { styles } from '../shared/index.styles';
import CardS21 from '../shared/Card21';

import FontRegular from '/assets/fonts/Inter-Regular.ttf';
import FontSemiBold from '/assets/fonts/Inter-SemiBold.ttf';

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
    { src: FontRegular, fontWeight: 'normal' },
    { src: FontSemiBold, fontWeight: 'bold' },
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

const TemplateS21Doc1in1 = ({ data, lang }: S21Type) => {
  const font =
    LANGUAGE_LIST.find((record) => record.threeLettersCode === lang)?.font ||
    'Inter';

  return (
    <Document
      author="sws2apps"
      title="S-21"
      creator="Organized"
      producer="sws2apps (by react-pdf)"
    >
      <Page size={[595.2, 419.84]} style={[styles.body, { fontFamily: font }]}>
        <CardS21 data={data} lang={lang} />
      </Page>
    </Document>
  );
};

export default TemplateS21Doc1in1;
