import { Page } from '@react-pdf/renderer';
import { Document } from '@views/components';
import { useAppTranslation } from '@hooks/index';
import { LANGUAGE_LIST } from '@constants/index';
import { WeekendMeetingTemplateType } from './index.types';
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

  return (
    <Document title={t('tr_weekendMeetingPrint', { lng: lang })}>
      <Page size="A4" style={[styles.page, { fontFamily: font }]}>
        <Header cong_name={cong_name} lang={lang} />
        {data.map((meetingData, index) => (
          <WeekData
            key={meetingData.weekOf}
            isLast={index === data.length - 1}
            meetingData={meetingData}
            lang={lang}
          />
        ))}
      </Page>
    </Document>
  );
};

export default WeekendMeetingTemplate;
