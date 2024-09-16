import { ComponentType, lazy } from 'react';
import { eventValue } from './index.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EventTypeIcon: Record<eventValue, ComponentType<any>> = {
  tr_circuitOverseerWeek: lazy(
    () => import('@components/icons/IconWavingHand')
  ),
  tr_pioneerWeek: lazy(() => import('@components/icons/IconLocalLibrary')),
  tr_memorialWeek: lazy(() => import('@components/icons/IconWine')),
  tr_conventionWeek: lazy(() => import('@components/icons/IconStadium')),
  tr_assemblyWeek: lazy(() => import('@components/icons/IconDistance')),
  tr_internationalConventionWeek: lazy(
    () => import('@components/icons/IconAirplaneTicket')
  ),
  tr_specialCampaignWeek: lazy(() => import('@components/icons/IconCampaign')),
  tr_theocraticTrainingWeek: lazy(
    () => import('@components/icons/IconVoiceSelection')
  ),
  tr_hallMaintenanceTrainingWeek: lazy(
    () => import('@components/icons/IconVacuum')
  ),
  tr_bethelTour: lazy(() => import('@components/icons/IconCorporateFare')),
  tr_congregationTrip: lazy(
    () => import('@components/icons/IconAirportShuttle')
  ),
  tr_specialProgram: lazy(() => import('@components/icons/IconLightbulb')),
  tr_publicWitnessing: lazy(() => import('@components/icons/IconCart')),
  tr_kingdomInauguration: lazy(() => import('@components/icons/IconJwHome')),
  tr_languageCourse: lazy(() => import('@components/icons/IconTranslate')),
  tr_annualMeeting: lazy(() => import('@components/icons/IconDiagnosis')),
  tr_custom: lazy(() => import('@components/icons/IconCalendarClock')),
};

interface EventIconProps {
  type: eventValue;
  color?: string;
}

const EventIcon = ({ type, ...props }: EventIconProps) => {
  const Icon = EventTypeIcon[type];
  return <Icon {...props} />;
};

export default EventIcon;
