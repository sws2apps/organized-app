import { Document, Page, View } from '@react-pdf/renderer';
import { LANGUAGE_LIST } from '@constants/index';
import { TemplateS21Doc2in1Props } from './index.types';
import { styles } from '../shared/index.styles';
import registerFonts from '@views/registerFonts';
import CardS21 from '../shared/Card21';

registerFonts();

const TemplateS21Doc2in1 = ({ data, lang }: TemplateS21Doc2in1Props) => {
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
      <Page size="A4" style={[styles.body, { fontFamily: font }]}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            alignItems: 'center',
          }}
        >
          {data.map((card) => (
            <CardS21 key={card.year} data={card} lang={lang} />
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default TemplateS21Doc2in1;
