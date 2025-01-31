import { View } from '@react-pdf/renderer';
import { styles } from './index.styles';
import { S21Type } from './index.types';
import BasicInfo from './BasicInfo';
import Footer from './Footer';
import Header from './Header';
import PrivilegesEnrollments from './PrivilegesEnrollments';
import TableData from './TableData';
import TotalRow from './TotalRow';

const CardS21 = ({ data, lang }: S21Type) => {
  return (
    <View style={styles.cardContainer}>
      <View>
        <Header lang={lang} />
        <BasicInfo data={data} lang={lang} />
        <PrivilegesEnrollments data={data} lang={lang} />
        <TableData data={data} lang={lang} />
        <TotalRow data={data} lang={lang} />
      </View>
      <Footer data={data} lang={lang} />
    </View>
  );
};

export default CardS21;
