import { CircuitOverseerVisitDayType } from '@definition/circuit_overseer_visit';
import { CircuitOverseerVisitType } from '@definition/settings';

export type VisitListProps = {
  visits: CircuitOverseerVisitType[];
  selectedVisit: CircuitOverseerVisitType | undefined;
  days: CircuitOverseerVisitDayType[];
  selectedDay: number;
  onSelectVisit: (id: string) => void;
  onSelectDay: (day: number) => void;
  onEditVisit: (visit: CircuitOverseerVisitType) => void;
};
