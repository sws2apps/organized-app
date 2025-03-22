import { IconAdd, IconPrint } from '@components/icons';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import Button from '@components/button';
import PageTitle from '@components/page_title';
import { Box } from '@mui/material';
import {
  UpcomingEventType,
  YearlyUpcomingEventType,
} from '@definition/upcoming_events';
import UpcomingEventsList from '@features/congregation/upcoming_events/upcoming_events_list';

const data: YearlyUpcomingEventType[] = [
  {
    year: '2024',
    dates: [
      {
        date: new Date('March 3, 2024 12:00:00'),
        events: [
          {
            time: new Date('March 3, 2024 12:00:00'),
            type: UpcomingEventType.CircuitOverseerWeek,
            additional: 'Meeting with the circuit overseer',
            _deleted: false,
            updatedAt: '2024-02-28T09:00:00Z',
          },
        ],
      },
      {
        date: new Date('June 15, 2024 14:00:00'),
        events: [
          {
            time: new Date('June 15, 2024 14:00:00'),
            type: UpcomingEventType.ConventionWeek,
            additional: 'Regional convention',
            _deleted: false,
            updatedAt: '2024-05-10T15:30:00Z',
          },
        ],
      },
      {
        date: new Date('December 20, 2024 10:00:00'),
        events: [
          {
            time: new Date('December 20, 2024 10:00:00'),
            type: UpcomingEventType.Custom,
            additional: 'Special end-of-year gathering',
            custom: 'End of Year Celebration',
            _deleted: false,
            updatedAt: '2024-12-01T08:45:00Z',
          },
        ],
      },
    ],
  },
  {
    year: '2025',
    dates: [
      {
        date: new Date('April 5, 2025 16:00:00'),
        events: [
          {
            time: new Date('April 5, 2025 16:00:00'),
            type: UpcomingEventType.MemorialWeek,
            additional: 'Memorial service',
            _deleted: false,
            updatedAt: '2025-03-20T12:15:00Z',
          },
          {
            time: new Date('April 5, 2025 23:00:00'),
            type: UpcomingEventType.MemorialWeek,
            additional: 'Memorial service',
            _deleted: false,
            updatedAt: '2025-03-20T12:15:00Z',
          },
          {
            time: new Date('April 5, 2025 14:00:00'),
            type: UpcomingEventType.MemorialWeek,
            additional: 'Memorial service',
            _deleted: false,
            updatedAt: '2025-03-20T12:15:00Z',
          },
        ],
      },
      {
        date: new Date('September 10, 2025 09:30:00'),
        events: [
          {
            time: new Date('September 10, 2025 09:30:00'),
            type: UpcomingEventType.LanguageCourse,
            additional: 'Beginner Spanish course',
            _deleted: false,
            updatedAt: '2025-08-15T11:00:00Z',
          },
        ],
      },
    ],
  },
];

const UpcomingEvents = () => {
  const { t } = useAppTranslation();
  const { isAdmin } = useCurrentUser();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
      }}
    >
      <PageTitle
        title={t('tr_upcomingEvents')}
        buttons={
          isAdmin && (
            <>
              <Button variant="secondary" startIcon={<IconPrint />}>
                {t('tr_export')}
              </Button>
              <Button variant="main" startIcon={<IconAdd />}>
                {t('tr_addEvent')}
              </Button>
            </>
          )
        }
      />
      <UpcomingEventsList data={data} />
    </Box>
  );
};

export default UpcomingEvents;
