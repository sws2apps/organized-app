import { CircuitOverseerVisitType } from '@definition/settings';

export type VisitDetailsProps = {
  // undefined adds a new visit
  visit?: CircuitOverseerVisitType;
  onClose: VoidFunction;
  onSaved: (id: string) => void;
};
