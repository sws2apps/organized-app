import { CircuitOverseerVisitDayType } from '@definition/circuit_overseer_visit';
import { CircuitOverseerVisitType } from '@definition/settings';

export type DayAgendaProps = {
  visit: CircuitOverseerVisitType;
  day: CircuitOverseerVisitDayType;
};
