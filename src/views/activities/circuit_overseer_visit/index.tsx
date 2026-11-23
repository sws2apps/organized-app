import { View } from '@react-pdf/renderer';
import { Document, Page, PageContent, PageHeader } from '@views/components';
import { IconDate } from '@views/components/icons';
import { TemplateCircuitOverseerVisitProps } from './index.types';
import UpcomingEvent from '../upcoming_events/UpcomingEvent';

const TemplateCircuitOverseerVisit = ({
  title,
  congregation,
  lang,
  events,
}: TemplateCircuitOverseerVisitProps) => {
  return (
    <Document title={title} lang={lang}>
      <Page>
        <PageContent>
          <PageHeader
            variant="secondary"
            title={title}
            icon={<IconDate size={18} />}
            congregationName={congregation}
          />

          <View
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            {events.map((event) => (
              <UpcomingEvent key={event.uid} event={event} />
            ))}
          </View>
        </PageContent>
      </Page>
    </Document>
  );
};

export default TemplateCircuitOverseerVisit;
