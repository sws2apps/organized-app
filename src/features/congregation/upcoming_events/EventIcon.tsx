import { cloneElement } from 'react';
import { eventValue } from './index.types';
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

const EventTypeIcon: Record<eventValue, JSX.Element> = {
  tr_circuitOverseerWeek: <IconWavingHand />,
  tr_pioneerWeek: <IconLocalLibrary />,
  tr_memorialWeek: <IconWine />,
  tr_conventionWeek: <IconStadium />,
  tr_assemblyWeek: <IconDistance />,
  tr_internationalConventionWeek: <IconAirplaneTicket />,
  tr_specialCampaignWeek: <IconCampaign />,
  tr_theocraticTrainingWeek: <IconVoiceSelection />,
  tr_hallMaintenanceTrainingWeek: <IconVacuum />,
  tr_bethelTour: <IconCorporateFare />,
  tr_congregationTrip: <IconAirportShuttle />,
  tr_specialProgram: <IconLightbulb />,
  tr_publicWitnessing: <IconCart />,
  tr_kingdomInauguration: <IconJwHome />,
  tr_languageCourse: <IconTranslate />,
  tr_annualMeeting: <IconDiagnosis />,
  tr_custom: <IconCalendarClock />,
};

interface EventIconProps {
  type: eventValue;
  color?: string;
}

const EventIcon = ({ type, ...props }: EventIconProps) => {
  return cloneElement(EventTypeIcon[type], props);
};

export default EventIcon;
