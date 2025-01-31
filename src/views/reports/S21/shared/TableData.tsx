import { View } from '@react-pdf/renderer';
import { S21Type } from './index.types';
import { styles } from './index.styles';
import MonthlyRow from './MonthlyRow';
import TableHeader from './TableHeader';

const TableData = ({ data, lang }: S21Type) => {
  return (
    <View style={styles.table}>
      <TableHeader data={data} lang={lang} />

      {data.months.map((month, index) => (
        <MonthlyRow
          key={month.month_name}
          data={month}
          isLast={index === data.months.length - 1}
        />
      ))}
    </View>
  );
};

export default TableData;
