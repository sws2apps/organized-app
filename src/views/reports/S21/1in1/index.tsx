import { Document, Page } from '@react-pdf/renderer';
import { LANGUAGE_LIST } from '@constants/index';
import { S21Type } from '../shared/index.types';
import { styles } from '../shared/index.styles';
import registerFonts from '@views/registerFonts';
import CardS21 from '../shared/Card21';

registerFonts();

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
