import { Page, View } from '@react-pdf/renderer';
import { Document } from '@views/components';
import { TemplateS21Doc2in1Props } from './index.types';
import { styles } from '../shared/index.styles';
import registerFonts from '@views/registerFonts';
import CardS21 from '../shared/Card21';

registerFonts();

const TemplateS21Doc2in1 = ({ data, lang }: TemplateS21Doc2in1Props) => {
  return (
    <Document title="S-21" lang={lang}>
      <Page size="A4" style={styles.body}>
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
