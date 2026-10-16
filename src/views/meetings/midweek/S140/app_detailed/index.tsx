import { Page, View } from '@react-pdf/renderer';
import { Document } from '@views/components';
import { useAppTranslation } from '@hooks/index';
import { applyRTL } from '@views/utils/pdf_utils';
import registerFonts from '@views/registerFonts';
import { MidweekMeetingDataType } from '@definition/schedules';
import { S140Type } from '../shared/index.types';
import S140Header from '../app_normal/S140Header';
import S140Week from './S140Week';
import styles from './index.styles';

registerFonts();

const TemplateS140AppDetailed = ({ data, cong_name, lang }: S140Type) => {
  const { t } = useAppTranslation();

  const stylesSmart = applyRTL(styles, lang);

  // each meeting week starts a page; no-meeting cards ride along with a neighbouring week
  const pages = data.reduce<MidweekMeetingDataType[][]>(
    (result, meetingData) => {
      const current = result.at(-1);
      const startsPage =
        !meetingData.no_meeting && current?.some((week) => !week.no_meeting);

      if (!current || startsPage) result.push([meetingData]);
      else current.push(meetingData);

      return result;
    },
    []
  );

  return (
    <Document title={t('tr_midweekMeetingPrint')} lang={lang}>
      <Page size="A4" style={stylesSmart.page}>
        <S140Header cong_name={cong_name} lang={lang} />

        {pages.map((weeks, index) => (
          <View key={weeks[0].weekOf} break={index > 0}>
            {weeks.map((meetingData, weekIndex) => (
              <View
                key={meetingData.weekOf}
                style={{ marginTop: weekIndex > 0 ? '20px' : 0 }}
              >
                <S140Week meetingData={meetingData} lang={lang} />
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default TemplateS140AppDetailed;
