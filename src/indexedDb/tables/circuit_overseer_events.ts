import { CircuitOverseerEventType } from '@definition/circuit_overseer_visit';
import { Table } from 'dexie';

export type CircuitOverseerEventsTable = {
  circuit_overseer_events: Table<CircuitOverseerEventType>;
};

export const circuitOverseerEventsSchema = {
  circuit_overseer_events: '&event_uid, event_data',
};
