import { Document, Page, View } from '@react-pdf/renderer';
import registerFonts from '@views/registerFonts';
import { TemplateUpcomingEventsType } from './index.types';
import useAppTranslation from '@hooks/useAppTranslation';
import { LANGUAGE_LIST } from '@constants/index';
import styles from './index.styles';
import PageHeader from './PageHeader';

registerFonts();

const TemplateUpcomingEvents = ({
  congregation,
  lang,
}: TemplateUpcomingEventsType) => {
  const { t } = useAppTranslation();

  const font =
    LANGUAGE_LIST.find((record) => record.threeLettersCode === lang)?.font ||
    'Inter';

  const 

  return (
    <Document
      author="sws2apps"
      title={t('tr_upcomingEvents')}
      creator="Organized"
      producer="sws2apps (by react-pdf)"
    >
      <Page size="A4" style={[styles.page, { fontFamily: font }]}>
        <View style={styles.contentContainer}>
          <PageHeader congregation={congregation} />
        </View>
      </Page>
    </Document>
  );
};

export default TemplateUpcomingEvents;
