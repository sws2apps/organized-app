import { Document, Page, PageContent, PageHeader } from '@views/components';
import { IconDate } from '@views/components/icons';
import { useAppTranslation } from '@hooks/index';
import { TemplateUpcomingEventsProps } from './index.types';
import UpcomingEventsList from './UpcomingEventsList';

const TemplateUpcomingEvents = ({
  events,
  congregation,
  lang,
}: TemplateUpcomingEventsProps) => {
  const { t } = useAppTranslation();

  return (
    <Document title={t('tr_upcomingEvents')} lang={lang}>
      <Page>
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
