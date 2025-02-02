import { Document, Font, Page, View } from '@react-pdf/renderer';
import { TemplateS21Doc2in1Props } from './index.types';
import { styles } from '../shared/index.styles';
import CardS21 from '../shared/Card21';
import FontRegular from '@assets/fonts/Inter-Regular.ttf';
import FontSemiBold from '@assets/fonts/Inter-SemiBold.ttf';

Font.register({
  family: 'Inter',
  format: 'truetype',
  fonts: [
    { src: FontRegular, fontWeight: 'normal' },
    { src: FontSemiBold, fontWeight: 'bold' },
  ],
});

Font.registerHyphenationCallback((word) => [word]);

const TemplateS21Doc2in1 = ({ data, lang }: TemplateS21Doc2in1Props) => {
  return (
    <Document
      author="sws2apps"
      title="S-21"
      creator="Organized"
      producer="sws2apps (by react-pdf)"
    >
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
