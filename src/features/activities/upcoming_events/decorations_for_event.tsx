import {
  IconAirplaneTicket,
  IconCalendarClock,
  IconCampaign,
  IconCart,
  IconCorporateFare,
  IconDiagnosis,
  IconDistance,
  IconJwHome,
  IconLightbulb,
  IconLocalLibrary,
  IconStadium,
  IconTranslate,
  IconVacuum,
  IconVoiceSelection,
  IconWavingHand,
  IconWine,
} from '@components/icons';
import { UpcomingEventDuration } from '@definition/upcoming_events';

// the index of each entry is the stored `category` value — never reorder
export const decorationsForEvent = [
  {
    translationKey: 'tr_circuitOverseerWeek',
    icon: <IconWavingHand />,
    duration: UpcomingEventDuration.MultipleDays,
    wholeDay: true,
  },
  {
    translationKey: 'tr_pioneerWeek',
    icon: <IconLocalLibrary />,
    duration: UpcomingEventDuration.SingleDay,
    wholeDay: false,
  },
  {
    translationKey: 'tr_memorialWeek',
    icon: <IconWine />,
    duration: UpcomingEventDuration.SingleDay,
    wholeDay: false,
  },
  {
    translationKey: 'tr_conventionWeek',
    icon: <IconStadium />,
    duration: UpcomingEventDuration.MultipleDays,
    wholeDay: true,
  },
  {
    translationKey: 'tr_assemblyWeek',
    icon: <IconDistance />,
    duration: UpcomingEventDuration.SingleDay,
    wholeDay: true,
  },
  {
    translationKey: 'tr_internationalConventionWeek',
    icon: <IconAirplaneTicket />,
    duration: UpcomingEventDuration.MultipleDays,
    wholeDay: true,
  },
  {
    translationKey: 'tr_specialCampaignWeek',
    icon: <IconCampaign />,
    duration: UpcomingEventDuration.MultipleDays,
    wholeDay: true,
  },
  {
    translationKey: 'tr_hallMaintenanceTrainingWeek',
    icon: <IconVacuum />,
    duration: UpcomingEventDuration.SingleDay,
    wholeDay: false,
  },
  {
    translationKey: 'tr_theocraticTrainingWeek',
    icon: <IconVoiceSelection />,
    duration: UpcomingEventDuration.SingleDay,
    wholeDay: false,
  },
  {
    translationKey: 'tr_bethelTour',
    icon: <IconCorporateFare />,
    duration: UpcomingEventDuration.SingleDay,
    wholeDay: true,
  },
  {
    translationKey: 'tr_specialProgram',
    icon: <IconLightbulb />,
    duration: UpcomingEventDuration.SingleDay,
    wholeDay: false,
  },
  {
    translationKey: 'tr_publicWitnessing',
    icon: <IconCart />,
    duration: UpcomingEventDuration.SingleDay,
    wholeDay: false,
  },
  {
    translationKey: 'tr_kingdomDedication',
    icon: <IconJwHome />,
    duration: UpcomingEventDuration.SingleDay,
    wholeDay: false,
  },
  {
    translationKey: 'tr_languageCourse',
    icon: <IconTranslate />,
    duration: UpcomingEventDuration.SingleDay,
    wholeDay: false,
  },
  {
    translationKey: 'tr_annualMeeting',
    icon: <IconDiagnosis />,
    duration: UpcomingEventDuration.SingleDay,
    wholeDay: false,
  },
  {
    translationKey: 'tr_custom',
    icon: <IconCalendarClock />,
    duration: UpcomingEventDuration.SingleDay,
    wholeDay: false,
  },
];
