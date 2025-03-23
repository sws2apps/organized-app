import {
  IconAirplaneTicket,
  IconAirportShuttle,
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

export const decorationsForEvent = [
  {
    translationKey: 'tr_circuitOverseerWeek',
    icon: <IconWavingHand />,
  },
  { translationKey: 'tr_pioneerWeek', icon: <IconLocalLibrary /> },
  { translationKey: 'tr_memorialWeek', icon: <IconWine /> },
  { translationKey: 'tr_conventionWeek', icon: <IconStadium /> },
  { translationKey: 'tr_assemblyWeek', icon: <IconDistance /> },
  {
    translationKey: 'tr_internationalConventionWeek',
    icon: <IconAirplaneTicket />,
  },
  {
    translationKey: 'tr_specialCampaignWeek',
    icon: <IconCampaign />,
  },
  {
    translationKey: 'tr_hallMaintenanceTrainingWeek',
    icon: <IconVacuum />,
  },
  {
    translationKey: 'tr_theocraticTrainingWeek',
    icon: <IconVoiceSelection />,
  },
  { translationKey: 'tr_bethelTour', icon: <IconCorporateFare /> },
  {
    translationKey: 'tr_congregationTrip',
    icon: <IconAirportShuttle />,
  },
  { translationKey: 'tr_specialProgram', icon: <IconLightbulb /> },
  { translationKey: 'tr_publicWitnessing', icon: <IconCart /> },
  { translationKey: 'tr_kingdomInauguration', icon: <IconJwHome /> },
  { translationKey: 'tr_languageCourse', icon: <IconTranslate /> },
  { translationKey: 'tr_annualMeeting', icon: <IconDiagnosis /> },
  { translationKey: 'tr_custom', icon: <IconCalendarClock /> },
];
