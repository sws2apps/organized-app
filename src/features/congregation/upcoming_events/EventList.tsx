import InfoTip from '@components/info_tip';
import { HorizontalFlex, StyledCardBox, VerticalFlex } from './index.styles';
import { IconAddMonth, IconEdit, IconInfo } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import {
  EventDateType,
  EventListType,
  EventType,
  YearlyEventsType,
} from './index.types';
import { formatDate } from '@services/dateformat';
import { Box } from '@mui/material';
import Button from '@components/button';
import IconButton from '@components/icon_button';
import EventIcon from './EventIcon';
import { useState } from 'react';
import AddEvent, { EventValues } from './AddEvent';
import { parse } from 'date-fns';

const EventList = ({
  data,
  isAdmin,
}: {
  data: EventListType;
  isAdmin: boolean;
}) => {
  const { t } = useAppTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EventValues[]>();

  const handleEdit = (event: EventValues[]) => {
    if (!isEditing) {
      setEditData([...event]);
      setIsEditing(true);
    } else {
      handleCancelEdit();
      setTimeout(() => {
        setEditData([...event]);
        setIsEditing(true);
      }, 0);
    }
  };

  const handleEditDone = (data: EventType[]) => {
    setIsEditing(false);
    console.log(data);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <VerticalFlex>
      {data.length === 0 && (
        <InfoTip
          isBig={false}
          icon={<IconInfo />}
          color="white"
          text={t('tr_upcomingEventsEmpty')}
        />
      )}
      <VerticalFlex sx={{ gap: '32px' }}>
        {data.map((yearlyEvent, index) => (
          <YearlyEvent
            isAdmin={isAdmin}
            yearlyEvent={yearlyEvent}
            handleEdit={handleEdit}
            key={index}
          />
        ))}
      </VerticalFlex>
      {isAdmin && isEditing && (
        <AddEvent
          data={editData}
          titleTextKey="tr_editUpcomingEvent"
          onDone={handleEditDone}
          onCancel={handleCancelEdit}
        />
      )}
    </VerticalFlex>
  );
};

const YearlyEvent = ({
  yearlyEvent,
  handleEdit,
  isAdmin,
}: {
  yearlyEvent: YearlyEventsType;
  handleEdit: (event: EventValues[]) => void;
  isAdmin: boolean;
}) => {
  return (
    <VerticalFlex>
      <span className="h4" style={{ color: 'var(--accent-400)' }}>
        {yearlyEvent.year}
      </span>
      {yearlyEvent.dates.map((eventDate, index) => (
        <EventDate
          isAdmin={isAdmin}
          eventDate={eventDate}
          handleEdit={handleEdit}
          key={index}
        />
      ))}
    </VerticalFlex>
  );
};

const EventDate = ({
  eventDate,
  handleEdit,
  isAdmin,
}: {
  eventDate: EventDateType;
  handleEdit: (event: EventValues[]) => void;
  isAdmin: boolean;
}) => {
  const { t } = useAppTranslation();

  const editEvent = () => {
    handleEdit(
      eventDate.events.map((event) => ({
        date: new Date(eventDate.date),
        time: parse(event.time, 'HH:mm', new Date()),
        type: event.type,
        custom: event.title,
        description: event.description,
      }))
    );
  };

  return (
    <StyledCardBox>
      <HorizontalFlex
        sx={{ justifyContent: 'space-between', alignItems: 'center' }}
      >
        <span className="h2" style={{ color: 'var(--black)' }}>
          {formatDate(new Date(eventDate.date), t('tr_longDateFormat'))}
        </span>
        {isAdmin && (
          <IconButton
            onClick={editEvent}
            color="primary"
            sx={{ borderRadius: '100px' }}
          >
            <IconEdit color={'var(--accent-main)'} />
          </IconButton>
        )}
      </HorizontalFlex>
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
        '&:hover #add-calendar-btn': {
          opacity: '1',
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
        <HorizontalFlex sx={{ gap: '4px', alignItems: 'center' }}>
          <EventIcon type={event.type} color="var(--black)" />
          <span className="h4" style={{ color: 'var(--black)' }}>
            {event.title ?? t(event.type)}
          </span>
        </HorizontalFlex>
        {event.description && (
          <span className="body-regular" style={{ color: 'var(--grey-400)' }}>
            {event.description}
          </span>
        )}
      </VerticalFlex>
      <Box
        id="add-calendar-btn"
        sx={{
          flexShrink: '0',
          alignSelf: 'center',
          ['@media (hover: hover)']: {
            opacity: '0',
            transition: 'opacity 0.3s',
          },
        }}
      >
        <Button
          sx={{
            minHeight: '0px',
            '@media (hover: none)': {
              display: 'none',
            },
          }}
          variant="small"
          startIcon={<IconAddMonth />}
        >
          {t('tr_addToCalendar')}
        </Button>
        <IconButton
          sx={{
            display: 'none',
            ['@media (hover: none)']: {
              display: 'block',
            },
          }}
        >
          <IconAddMonth color="var(--accent-main)" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default EventList;
