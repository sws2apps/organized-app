import { CircuitOverseerEventCategory } from '@definition/circuit_overseer_visit';

// Order follows the activity selector.
export const CIRCUIT_OVERSEER_EVENT_LABELS: Record<
  CircuitOverseerEventCategory,
  string
> = {
  midweek: 'tr_midweekMeeting',
  weekend: 'tr_weekendMeeting',
  field_service: 'tr_COFieldServiceMeeting',
  pioneers: 'tr_COPioneersMeeting',
  elders: 'tr_COEldersMeeting',
  appointed_brothers: 'tr_COAppointedBrothersMeeting',
  shepherding: 'tr_COShepherdingVisit',
  additional_meeting: 'tr_COAdditionalMeeting',
  hospitality: 'tr_COHospitality',
};
