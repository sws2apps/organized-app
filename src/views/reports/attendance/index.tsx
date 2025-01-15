import { Document, Font, Page, Text, View } from '@react-pdf/renderer';
import { TemplateS88Props } from './index.types';
import { useAppTranslation } from '@hooks/index';
import { styles } from './index.styles';
import AverageRow from './AverageRow';
import FontBold from '@assets/fonts/Inter-SemiBold.ttf';
import FontRegular from '@assets/fonts/Inter-Regular.ttf';
import MonthlyRow from './MonthlyRow';
import TableHeader from './TableHeader';

Font.register({
  family: 'Inter',
  format: 'truetype',
  fonts: [{ src: FontRegular }, { src: FontBold }],
});

Font.registerHyphenationCallback((word) => [word]);

const TemplateS88 = ({ data }: TemplateS88Props) => {
  const { t } = useAppTranslation();

  return (
    <Document
      author="sws2apps"
      title="S-88"
      creator="Organized"
      producer="sws2apps (by react-pdf)"
    >
      <Page size={[595.2, 842]} style={styles.body}>
        <View style={styles.title}>
          <Text>{t('tr_S88Title', { lng: data.locale })}</Text>
        </View>

        <View style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
          <View>
            <Text style={styles.section}>
              {t('tr_midweekMeeting', { lng: data.locale })}
            </Text>

            <View style={styles.container}>
              {data.years.map((year, index) => (
                <TableHeader
                  key={year}
                  year={year}
                  locale={data.locale}
                  column={index + 1}
                />
              ))}
            </View>

            {data.midweek_meeting.map((record, index) => (
              <View key={record.month} style={[styles.container]}>
                <MonthlyRow
                  column={1}
                  last={index === 11}
                  month={record.month}
                  count={record.table_1.count}
                  total={record.table_1.total}
                  average={record.table_1.average}
                />
                <MonthlyRow
                  column={2}
                  last={index === 11}
                  month={record.month}
                  count={record.table_2.count}
                  total={record.table_2.total}
                  average={record.table_2.average}
                />
              </View>
            ))}

            <View style={styles.container}>
              {data.midweek_average.map((record, index) => (
                <AverageRow
                  key={record}
                  column={index + 1}
                  locale={data.locale}
                  average={record}
                />
              ))}
            </View>
          </View>

          <View>
            <Text style={styles.section}>
              {t('tr_weekendMeeting', { lng: data.locale })}
            </Text>

            <View style={styles.container}>
              {data.years.map((year, index) => (
                <TableHeader
                  key={year}
                  year={year}
                  locale={data.locale}
                  column={index + 1}
                />
              ))}
            </View>

            {data.weekend_meeting.map((record, index) => (
              <View key={record.month} style={[styles.container]}>
                <MonthlyRow
                  column={1}
                  last={index === 11}
                  month={record.month}
                  count={record.table_1.count}
                  total={record.table_1.total}
                  average={record.table_1.average}
                />
                <MonthlyRow
                  column={2}
                  last={index === 11}
                  month={record.month}
                  count={record.table_2.count}
                  total={record.table_2.total}
                  average={record.table_2.average}
                />
              </View>
            ))}

            <View style={styles.container}>
              {data.weekend_average.map((record, index) => (
                <AverageRow
                  key={record}
                  column={index + 1}
                  locale={data.locale}
                  average={record}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={{ position: 'absolute', bottom: '48px' }}>
          <Text style={{ fontSize: '7px' }}>
            S-88-{data.lang}
            {'    '}12/18
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default TemplateS88;
