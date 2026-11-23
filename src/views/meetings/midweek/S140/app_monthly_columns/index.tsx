import { Page, View } from '@react-pdf/renderer';
import { Document } from '@views/components';
import { useAppTranslation } from '@hooks/index';
import { applyRTL } from '@views/utils/pdf_utils';
import registerFonts from '@views/registerFonts';
import { S140Type } from '../shared/index.types';
import { groupByMonth } from '../shared/index.utils';
import S140Header from '../app_normal/S140Header';
import S140Week from './S140Week';
import styles from './index.styles';
import pickDensity from './pickDensity';

registerFonts();

const TemplateS140AppMonthlyColumns = ({ data, cong_name, lang }: S140Type) => {
  const { t } = useAppTranslation();

  const stylesSmart = applyRTL(styles, lang);

  return (
    <Document title={t('tr_midweekMeetingPrint')} lang={lang}>
      <Page size="A4" style={stylesSmart.page}>
        <S140Header cong_name={cong_name} lang={lang} />

        {groupByMonth(data).map((month, index) => {
          const density = pickDensity(month);

          return (
            <View key={month[0].weekOf} break={index > 0}>
              {month.map((meetingData) => (
                <S140Week
                  key={meetingData.weekOf}
                  meetingData={meetingData}
                  density={density}
                  lang={lang}
                />
              ))}
            </View>
          );
        })}
      </Page>
    </Document>
  );
};

export default TemplateS140AppMonthlyColumns;
