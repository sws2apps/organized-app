import { Font, Document, Page, View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import { LANGUAGE_LIST } from '@constants/index';
import { WeekendMeetingTemplateType } from './index.types';
import { WeekendMeetingDataType } from '@definition/schedules';
import Header from './Header';
import WeekData from './WeekData';
import styles from './index.styles';

import FontBold from '/assets/fonts/Inter-SemiBold.ttf';
import FontLight from '/assets/fonts/Inter-Light.ttf';
import FontMedium from '/assets/fonts/Inter-Medium.ttf';
import FontRegular from '/assets/fonts/Inter-Regular.ttf';

import NotoSansFontBold from '/assets/fonts/NotoSans-SemiBold.ttf';
import NotoSansFontRegular from '/assets/fonts/NotoSans-Regular.ttf';

import NotoSansSCFontBold from '/assets/fonts/NotoSansSC-SemiBold.ttf';
import NotoSansSCFontRegular from '/assets/fonts/NotoSansSC-Regular.ttf';

import NotoSansJPFontBold from '/assets/fonts/NotoSansJP-SemiBold.ttf';
import NotoSansJPFontRegular from '/assets/fonts/NotoSansJP-Regular.ttf';

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

Font.register({
  family: 'NotoSans',
  format: 'truetype',
  fonts: [{ src: NotoSansFontRegular }, { src: NotoSansFontBold }],
});

Font.register({
  family: 'NotoSansSC',
  format: 'truetype',
  fonts: [{ src: NotoSansSCFontRegular }, { src: NotoSansSCFontBold }],
});

Font.register({
  family: 'NotoSansJP',
  format: 'truetype',
  fonts: [{ src: NotoSansJPFontRegular }, { src: NotoSansJPFontBold }],
});

Font.registerHyphenationCallback((word) => [word]);

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
