import { Font, Document, Page, View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import { WeekendMeetingTemplateType } from './index.types';
import { WeekendMeetingDataType } from '@definition/schedules';
import FontBold from '@assets/fonts/Inter-SemiBold.ttf';
import FontLight from '@assets/fonts/Inter-Light.ttf';
import FontMedium from '@assets/fonts/Inter-Medium.ttf';
import FontRegular from '@assets/fonts/Inter-Regular.ttf';
import Header from './Header';
import WeekData from './WeekData';
import styles from './index.styles';

Font.register({
  family: 'Inter',
  format: 'truetype',
  fonts: [
    { src: FontRegular },
    { src: FontLight },
    { src: FontMedium },
    { src: FontBold },
  ],
});

Font.registerHyphenationCallback((word) => [word]);

const WeekendMeetingTemplate = ({
  data,
  cong_name,
  cong_number,
  lang,
}: WeekendMeetingTemplateType) => {
  const { t } = useAppTranslation();

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
      <Page size="A4" style={styles.page}>
        <Header cong_name={cong_name} cong_number={cong_number} lang={lang} />
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
