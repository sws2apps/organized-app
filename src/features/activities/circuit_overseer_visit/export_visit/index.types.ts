import { CircuitOverseerEventType } from '@definition/circuit_overseer_visit';
import { CircuitOverseerVisitType } from '@definition/settings';

export type ExportVisitProps = {
  visit: CircuitOverseerVisitType;
  events: CircuitOverseerEventType[];
};
