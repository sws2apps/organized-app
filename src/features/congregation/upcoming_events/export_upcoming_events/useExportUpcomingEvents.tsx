import { UpcomingEventCategory } from '@definition/upcoming_events';
import { pdf } from '@react-pdf/renderer';
import {
  congNameState,
  JWLangLocaleState,
  settingsState,
  userDataViewState,
} from '@states/settings';
// import { upcomingEventsState } from '@states/upcoming_events';
import TemplateUpcomingEvents from '@views/upcoming_events';
import { saveAs } from 'file-saver';
import { useRecoilValue } from 'recoil';

const useExportUpcomingEvents = () => {
  // const upcomingEvents = useRecoilValue(upcomingEventsState);
  const congName = useRecoilValue(congNameState);
  const locale = useRecoilValue(JWLangLocaleState);
  const settings = useRecoilValue(settingsState);
  const dataView = useRecoilValue(userDataViewState);

  const timeFormat = settings.cong_settings.format_24h_enabled.find(
    (record) => record.type === dataView
  ).value;

  const upcomingEvents = [
    {
      event_uid: 'evt-001',
      _deleted: false,
      updatedAt: '2025-04-04T10:00:00Z',
      event_data: {
        date: '2025-04-10',
        time: '2025-04-10T19:00:00.000Z',
        scope: 'congregation',
        type: UpcomingEventCategory.CircuitOverseerWeek,
        additional: 'Visit by the circuit overseer',
      },
    },
    {
      event_uid: 'evt-002',
      _deleted: false,
      updatedAt: '2025-04-04T10:00:00Z',
      event_data: {
        date: '2025-04-17',
        time: '2025-04-17T19:00:00.000Z',
        scope: 'congregation',
        type: UpcomingEventCategory.PioneerWeek,
        additional: 'Special pioneer school activities',
      },
    },
    {
      event_uid: 'evt-003',
      _deleted: false,
      updatedAt: '2025-04-04T10:00:00Z',
      event_data: {
        date: '2025-04-23',
        time: '2025-04-23T20:00:00.000Z',
        scope: 'city',
        type: UpcomingEventCategory.MemorialWeek,
        additional: 'Memorial of Christ’s death',
      },
    },
    {
      event_uid: 'evt-004',
      _deleted: false,
      updatedAt: '2025-04-04T10:00:00Z',
      event_data: {
        date: '2025-05-01',
        time: '2025-05-01T10:00:00.000Z',
        scope: 'regional',
        type: UpcomingEventCategory.ConventionWeek,
        additional: 'Regional convention at Odessa Arena',
      },
    },
    {
      event_uid: 'evt-005',
      _deleted: false,
      updatedAt: '2025-04-04T10:00:00Z',
      event_data: {
        date: '2025-05-08',
        time: '2025-05-08T09:00:00.000Z',
        scope: 'congregation',
        type: UpcomingEventCategory.AssemblyWeek,
        additional: 'Circuit assembly with a branch representative',
      },
    },
    {
      event_uid: 'evt-006',
      _deleted: false,
      updatedAt: '2025-04-04T10:00:00Z',
      event_data: {
        date: '2025-06-12',
        time: '2025-06-12T08:30:00.000Z',
        scope: 'international',
        type: UpcomingEventCategory.InternationalConventionWeek,
        additional: 'Delegates from Europe and Asia',
      },
    },
    {
      event_uid: 'evt-007',
      _deleted: false,
      updatedAt: '2025-04-04T10:00:00Z',
      event_data: {
        date: '2025-06-20',
        time: '2025-06-20T18:00:00.000Z',
        scope: 'city',
        type: UpcomingEventCategory.SpecialCampaignWeek,
        additional: 'Invitation campaign for Memorial',
      },
    },
    {
      event_uid: 'evt-008',
      _deleted: false,
      updatedAt: '2025-04-04T10:00:00Z',
      event_data: {
        date: '2025-07-01',
        time: '2025-07-01T16:00:00.000Z',
        scope: 'congregation',
        type: UpcomingEventCategory.TheocraticTrainingWeek,
        additional: 'Theocratic school workshop',
      },
    },
    {
      event_uid: 'evt-009',
      _deleted: false,
      updatedAt: '2025-04-04T10:00:00Z',
      event_data: {
        date: '2025-07-08',
        time: '2025-07-08T10:00:00.000Z',
        scope: 'local',
        type: UpcomingEventCategory.BethelTour,
        additional: 'Group tour to Bethel Ukraine branch',
      },
    },
    {
      event_uid: 'evt-010',
      _deleted: false,
      updatedAt: '2025-04-04T10:00:00Z',
      event_data: {
        date: '2025-07-15',
        time: '2025-07-15T11:00:00.000Z',
        scope: 'congregation',
        type: UpcomingEventCategory.Custom,
        additional: 'Special youth workshop',
        custom: 'Youth Encouragement Day',
      },
    },
  ];

  const handleExportButtonClick = async () => {
    const blob = await pdf(
      <TemplateUpcomingEvents
        events={upcomingEvents}
        congregation={congName}
        lang={locale}
        use24={timeFormat}
      />
    ).toBlob();

    const filename = 'Upcoming_Events.pdf';

    saveAs(blob, filename);
  };

  return {
    handleExportButtonClick,
  };
};

export default useExportUpcomingEvents;
