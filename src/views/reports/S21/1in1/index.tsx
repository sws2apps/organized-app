import { Document, Page } from '@react-pdf/renderer';
import { S21Type } from '../shared/index.types';
import { styles } from '../shared/index.styles';
import CardS21 from '../shared/Card21';

const TemplateS21Doc1in1 = ({ data }: S21Type) => {
  return (
    <Document
      author="sws2apps"
      title="S-21"
      creator="Organized"
      producer="sws2apps (by react-pdf)"
    >
      <Page size={[595.2, 419.84]} style={styles.body}>
        <CardS21 data={data} />
      </Page>
    </Document>
  );
};

export default TemplateS21Doc1in1;
