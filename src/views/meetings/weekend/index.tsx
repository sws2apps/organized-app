import { Document, Page, View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import { LANGUAGE_LIST } from '@constants/index';
import { WeekendMeetingTemplateType } from './index.types';
import { WeekendMeetingDataType } from '@definition/schedules';
import registerFonts from '@views/registerFonts';
import Header from './Header';
import WeekData from './WeekData';
import styles from './index.styles';

registerFonts();

const WeekendMeetingTemplate = ({
  data,
  cong_name,
  lang,
}: WeekendMeetingTemplateType) => {
  const { t } = useAppTranslation();

  const font =
    LANGUAGE_LIST.find((record) => record.threeLettersCode === lang)?.font ||
    'Inter';

  const formatData = () => {
    const groupedData: WeekendMeetingDataType[][] = [];

    for (let i = 0; i < data.length; i += 9) {
      groupedData.push(data.slice(i, i + 9));
    }

    return groupedData;
  };

  return (
    <Document
      author="sws2apps"
      title={t('tr_weekendMeetingPrint', { lng: lang })}
      creator="Organized"
      producer="sws2apps (by react-pdf)"
    >
      <Page size="A4" style={[styles.page, { fontFamily: font }]}>
        <Header cong_name={cong_name} lang={lang} />
        {formatData().map((groupData, groupIndex) => (
          <View key={groupIndex} break={groupIndex > 0}>
            {groupData.map((meetingData, index) => (
              <WeekData
                key={`${groupIndex}-${index}`}
                isLast={index === groupData.length - 1}
                meetingData={meetingData}
                lang={lang}
              />
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default WeekendMeetingTemplate;
