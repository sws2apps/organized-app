import { View } from '@react-pdf/renderer';
import { styles } from './index.styles';
import { S21Type } from './index.types';
import BasicInfo from './BasicInfo';
import Footer from './Footer';
import Header from './Header';
import PrivilegesEnrollments from './PrivilegesEnrollments';
import TableData from './TableData';
import TotalRow from './TotalRow';

const CardS21 = ({ data }: S21Type) => {
  return (
    <View style={styles.cardContainer}>
      <View>
        <Header />
        <BasicInfo data={data} />
        <PrivilegesEnrollments data={data} />
        <TableData data={data} />
        <TotalRow data={data} />
      </View>
      <Footer data={data} />
    </View>
  );
};

export default CardS21;
