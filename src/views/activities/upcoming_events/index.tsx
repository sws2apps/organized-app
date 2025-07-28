import registerFonts from '@views/registerFonts';
import { TemplateUpcomingEventsProps } from './index.types';
import useAppTranslation from '@hooks/useAppTranslation';
import { LANGUAGE_LIST } from '@constants/index';
import { Document, Page, PageContent, PageHeader } from '@views/components';
import { IconDate } from '@views/components/icons';
import UpcomingEventsList from './UpcomingEventsList';

registerFonts();

const TemplateUpcomingEvents = ({
  events,
  congregation,
  lang,
}: TemplateUpcomingEventsProps) => {
  const { t } = useAppTranslation();

  const font =
    LANGUAGE_LIST.find((record) => record.threeLettersCode === lang)?.font ||
    'Inter';

  return (
    <Document title={t('tr_upcomingEvents')}>
      <Page font={font}>
        <PageContent>
          <PageHeader
            variant="secondary"
            title={t('tr_upcomingEvents')}
            icon={<IconDate size={18} />}
            congregationName={congregation}
          />
          <UpcomingEventsList events={events} />
        </PageContent>
      </Page>
    </Document>
  );
};

export default TemplateUpcomingEvents;
