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
import { UpcomingEventType } from '@definition/upcoming_events';

export const getDecorationByEventType = (eventType: UpcomingEventType) => {
  switch (eventType) {
    case UpcomingEventType.CircuitOverseerWeek:
      return {
        translationKey: 'tr_circuitOverseerWeek',
        icon: <IconWavingHand />,
      };
    case UpcomingEventType.PioneerWeek:
      return { translationKey: 'tr_pioneerWeek', icon: <IconLocalLibrary /> };
    case UpcomingEventType.MemorialWeek:
      return { translationKey: 'tr_memorialWeek', icon: <IconWine /> };
    case UpcomingEventType.ConventionWeek:
      return { translationKey: 'tr_conventionWeek', icon: <IconStadium /> };
    case UpcomingEventType.AssemblyWeek:
      return { translationKey: 'tr_assemblyWeek', icon: <IconDistance /> };
    case UpcomingEventType.InternationalConventionWeek:
      return {
        translationKey: 'tr_internationalConventionWeek',
        icon: <IconAirplaneTicket />,
      };
    case UpcomingEventType.SpecialCampaignWeek:
      return {
        translationKey: 'tr_specialCampaignWeek',
        icon: <IconCampaign />,
      };
    case UpcomingEventType.TheocraticTrainingWeek:
      return {
        translationKey: 'tr_theocraticTrainingWeek',
        icon: <IconVoiceSelection />,
      };
    case UpcomingEventType.HallMaintenanceTrainingWeek:
      return {
        translationKey: 'tr_hallMaintenanceTrainingWeek',
        icon: <IconVacuum />,
      };
    case UpcomingEventType.BethelTour:
      return { translationKey: 'tr_bethelTour', icon: <IconCorporateFare /> };
    case UpcomingEventType.CongregationTrip:
      return {
        translationKey: 'tr_congregationTrip',
        icon: <IconAirportShuttle />,
      };
    case UpcomingEventType.SpecialProgram:
      return { translationKey: 'tr_specialProgram', icon: <IconLightbulb /> };
    case UpcomingEventType.PublicWitnessing:
      return { translationKey: 'tr_publicWitnessing', icon: <IconCart /> };
    case UpcomingEventType.KingdomInnauguration:
      return { translationKey: 'tr_kingdomInauguration', icon: <IconJwHome /> };
    case UpcomingEventType.LanguageCourse:
      return { translationKey: 'tr_languageCourse', icon: <IconTranslate /> };
    case UpcomingEventType.AnnualMeeting:
      return { translationKey: 'tr_annualMeeting', icon: <IconDiagnosis /> };
    case UpcomingEventType.Custom:
      return { translationKey: 'tr_custom', icon: <IconCalendarClock /> };
  }
};
