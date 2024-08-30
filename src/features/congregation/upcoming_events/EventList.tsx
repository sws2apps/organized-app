import InfoTip from '@components/info_tip';
import { HorizontalFlex, StyledCardBox, VerticalFlex } from './index.styles';
import { IconAddMonth, IconInfo } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import {
  EventDateType,
  EventListType,
  EventType,
  YearlyEventsType,
} from './index.types';
import { formatDate } from '@services/dateformat';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Button from '@components/button';

const EventList = ({
  data,
  isAdmin,
}: {
  data: EventListType;
  isAdmin: boolean;
}) => {
  const { t } = useAppTranslation();
  return (
    <VerticalFlex>
      {data.length == 0 && (
        <InfoTip
          isBig={false}
          icon={<IconInfo />}
          color="white"
          text={t('tr_upcomingEventsEmpty')}
        />
      )}
      <VerticalFlex sx={{ gap: '32px' }}>
        {data.map((yearlyEvent, index) => (
          <YearlyEvent yearlyEvent={yearlyEvent} key={index} />
        ))}
      </VerticalFlex>
    </VerticalFlex>
  );
};

const YearlyEvent = ({ yearlyEvent }: { yearlyEvent: YearlyEventsType }) => {
  return (
    <VerticalFlex>
      <span className="h4" style={{ color: 'var(--accent-400)' }}>
        {yearlyEvent.year}
      </span>
      {yearlyEvent.dates.map((eventDate, index) => (
        <EventDate eventDate={eventDate} key={index} />
      ))}
    </VerticalFlex>
  );
};

const EventDate = ({ eventDate }: { eventDate: EventDateType }) => {
  const { t } = useAppTranslation();

  return (
    <StyledCardBox>
      <span className="h2" style={{ color: 'var(--black)' }}>
        {formatDate(new Date(eventDate.date), t('tr_longDateFormat'))}
      </span>
      {eventDate.events.map((event, index) => (
        <Event event={event} key={index} />
      ))}
    </StyledCardBox>
  );
};

const Event = ({ event }: { event: EventType }) => {
  const { t } = useAppTranslation();
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        '& + &': {
          borderTop: '1px solid var(--accent-200)',
          paddingTop: '16px',
        },
      }}
    >
      <span
        className="h4"
        style={{
          color: 'var(--accent-dark)',
          backgroundColor: 'var(--accent-150)',
          padding: '0px 8px',
          borderRadius: 'var(--radius-s)',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {event.time}
      </span>
      <VerticalFlex
        sx={{ gap: '4px', flexGrow: '1', justifyContent: 'center' }}
      >
        <HorizontalFlex sx={{ gap: '4px' }}>
          {<DynamicIcon name={event.icon} color="var(--black)" />}
          <span className="h4" style={{ color: 'var(--black)' }}>
            {event.title}
          </span>
        </HorizontalFlex>
        {event.description && (
          <span className="body-regular" style={{ color: 'var(--grey-400)' }}>
            {event.description}
          </span>
        )}
      </VerticalFlex>
      <Button
        sx={{ minHeight: '0px', flexShrink: '0' }}
        variant="secondary"
        startIcon={<IconAddMonth />}
      >
        {t('tr_addToCalendar')}
      </Button>
    </Box>
  );
};

const DynamicIcon = ({ name, ...props }: { name: string; color: string }) => {
  const [Icon, setIcon] = useState(null);

  useEffect(() => {
    const importIcon = async () => {
      try {
        const importedIcon = await import(`@components/icons/${name}.tsx`);
        setIcon(() => importedIcon.default || importedIcon[name]);
      } catch (err) {
        console.error(`Erreur lors de l'importation de l'icône ${name}:`, err);
        setIcon(null);
      }
    };

    importIcon();
  }, [name]);

  if (!Icon) return 'loading... ' + name;

  return <Icon {...props} />;
};

export default EventList;
