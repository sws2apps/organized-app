import Button from '@components/button';
import { IconAdd, IconPrint } from '@components/icons';
import PageTitle from '@components/page_title';
import EventList from '@features/congregation/upcoming_events/EventList';
import { VerticalFlex } from '@features/congregation/upcoming_events/index.styles';
import { EventListType } from '@features/congregation/upcoming_events/index.types';
import { useAppTranslation } from '@hooks/index';

const data: EventListType = [
  {
    year: '2024',
    dates: [
      {
        date: 1732489200000,
        events: [
          {
            time: '10:00',
            icon: 'IconDistance',
            title: 'Circuit Assembly',
            description: 'Dortmund Stadium, Mayday Str. 253',
          },
          {
            time: '10:30',
            icon: 'IconCalendarClock',
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
            icon: 'IconDistance',
            title: 'Circuit Assembly',
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
            icon: 'IconDistance',
            title: 'Circuit Assembly',
            description: '12-17 February',
          },
        ],
      },
      {
        date: 1733180400000,
        events: [
          {
            time: '10:30',
            icon: 'IconCart',
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
            icon: 'IconWine',
            title: 'Memorial',
            description: 'After the sunset',
          },
        ],
      },
    ],
  },
];

const UpcomingEvents = () => {
  const { t } = useAppTranslation();

  const isAdmin = true;

  const handleAddEvent = () => true;

  return (
    <VerticalFlex>
      <PageTitle
        title={t('tr_upcomingEvents')}
        buttons={
          isAdmin && (
            <>
              <Button
                variant="secondary"
                startIcon={<IconPrint />}
                onClick={handleAddEvent}
              >
                {t('tr_export')}
              </Button>
              <Button
                variant="main"
                startIcon={<IconAdd />}
                onClick={handleAddEvent}
              >
                {t('tr_addEvent')}
              </Button>
            </>
          )
        }
      />
      <EventList data={data} isAdmin={isAdmin} />
    </VerticalFlex>
  );
};

export default UpcomingEvents;
