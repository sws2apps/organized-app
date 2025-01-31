import { useState } from 'react';
import { IconAdd, IconPrint } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { VerticalFlex } from '@features/congregation/upcoming_events/index.styles';
import {
  EventListType,
  EventType,
} from '@features/congregation/upcoming_events/index.types';
import AddEvent from '@features/congregation/upcoming_events/AddEvent';
import Button from '@components/button';
import EventList from '@features/congregation/upcoming_events/EventList';
import PageTitle from '@components/page_title';

const data: EventListType = [
  {
    year: '2024',
    dates: [
      {
        date: 1732489200000,
        events: [
          {
            time: '10:00',
            type: 'tr_assemblyWeek',
            description: 'Dortmund Stadium, Mayday Str. 253',
          },
          {
            time: '10:30',
            type: 'tr_custom',
            title:
              'Can also be two custom input events during the same day (no additional info added)',
          },
        ],
      },
      {
        date: 1733180400000,
        events: [
          {
            time: '10:30',
            type: 'tr_assemblyWeek',
            description: '"Resurrection – a victory over death"',
          },
        ],
      },
    ],
  },
  {
    year: '2025',
    dates: [
      {
        date: 1733180400000,
        events: [
          {
            time: '10:30',
            type: 'tr_assemblyWeek',
            description: '12-17 February',
          },
        ],
      },
      {
        date: 1733180400000,
        events: [
          {
            time: '10:30',
            type: 'tr_publicWitnessing',
            title: 'Public witnessing training',
            description:
              'In Kingdom Hall. The whole congregation is welcomed. The program will be from 13:00 to 15:00 with a 15-m break',
          },
        ],
      },
      {
        date: 1733180400000,
        events: [
          {
            time: '17:50',
            type: 'tr_memorialWeek',
            title: 'Memorial',
            description: 'After the sunset',
          },
        ],
      },
    ],
  },
];

const UpcomingEvents = () => {
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  const { t } = useAppTranslation();

  const isAdmin = true;

  const handleCancelEvent = () => setIsAddingEvent(false);
  const handleAddEvent = (data: EventType[]) => setIsAddingEvent(data && false);

  return (
    <VerticalFlex>
      <PageTitle
        title={t('tr_upcomingEvents')}
        buttons={
          isAdmin && (
            <>
              <Button variant="secondary" startIcon={<IconPrint />}>
                {t('tr_export')}
              </Button>
              <Button
                variant="main"
                startIcon={<IconAdd />}
                onClick={() => setIsAddingEvent(true)}
              >
                {t('tr_addEvent')}
              </Button>
            </>
          )
        }
      />
      <EventList data={data} isAdmin={isAdmin} />
      {isAddingEvent && (
        <AddEvent onCancel={handleCancelEvent} onDone={handleAddEvent} />
      )}
    </VerticalFlex>
  );
};

export default UpcomingEvents;
