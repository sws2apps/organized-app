import { CircuitOverseerEventType } from '@definition/circuit_overseer_visit';

export type EventEditorProps = {
  event: CircuitOverseerEventType;
  weekOf: string;
};

export type HostOption = {
  person_uid: string;
  person_name: string;
};
