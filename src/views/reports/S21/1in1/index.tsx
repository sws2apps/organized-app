import { Page } from '@react-pdf/renderer';
import { Document } from '@views/components';
import { S21Type } from '../shared/index.types';
import { styles } from '../shared/index.styles';
import registerFonts from '@views/registerFonts';
import CardS21 from '../shared/Card21';

registerFonts();

const TemplateS21Doc1in1 = ({ data, lang }: S21Type) => {
  return (
    <Document title="S-21" lang={lang}>
      <Page size={[595.2, 419.84]} style={styles.body}>
        <CardS21 data={data} lang={lang} />
      </Page>
    </Document>
  );
};

export default TemplateS21Doc1in1;
