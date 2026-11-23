import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useAtomValue } from 'jotai';
import { useCurrentUser } from '@hooks/index';
import { CircuitOverseerVisitDayType } from '@definition/circuit_overseer_visit';
import { CircuitOverseerVisitType } from '@definition/settings';
import {
  circuitOverseerEventsState,
  circuitOverseerVisitsState,
} from '@states/circuit_overseer_visit';
import { formatDate } from '@utils/date';
import { circuitOverseerVisitDate } from '@utils/circuit_overseer_visit';

// undefined: closed, null: adding a visit
type VisitDialogState = CircuitOverseerVisitType | null | undefined;

const useCircuitOverseerVisit = () => {
  const [searchParams] = useSearchParams();

  const { isAdmin, isElder } = useCurrentUser();

  const visits = useAtomValue(circuitOverseerVisitsState);
  const allEvents = useAtomValue(circuitOverseerEventsState);

  const [selectedId, setSelectedId] = useState(searchParams.get('visit'));
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [visitDialog, setVisitDialog] = useState<VisitDialogState>();
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);

  const visit = visits.find((record) => record.id === selectedId) ?? visits[0];

  const events = useMemo(() => {
    if (!visit) return [];

    return allEvents
      .filter(
        (record) =>
          record.event_data.visit_id === visit.id &&
          (isElder || !record.event_data.elders_only)
      )
      .sort(
        (a, b) =>
          a.event_data.day - b.event_data.day ||
          (a.event_data.time || '24').localeCompare(b.event_data.time || '24')
      );
  }, [allEvents, visit, isElder]);

  const days = useMemo(() => {
    if (!visit) return [];

    return Array.from(
      { length: 7 },
      (_, day): CircuitOverseerVisitDayType => ({
        day,
        date: circuitOverseerVisitDate(visit.weekOf, day),
        events: events.filter((record) => record.event_data.day === day),
      })
    );
  }, [visit, events]);

  const today = formatDate(new Date(), 'yyyy/MM/dd');

  const todayIndex = days.findIndex(
    (record) => formatDate(record.date, 'yyyy/MM/dd') === today
  );

  const day = days[selectedDay ?? Math.max(todayIndex, 0)];

  const handleSelectVisit = (id: string) => {
    setSelectedId(id);
    setSelectedDay(null);
  };

  return {
    isAdmin,
    visits,
    visit,
    events,
    days,
    day,
    visitDialog,
    quickSettingsOpen,
    handleSelectVisit,
    handleSelectDay: setSelectedDay,
    handleAddVisit: () => setVisitDialog(null),
    handleEditVisit: (record: CircuitOverseerVisitType) =>
      setVisitDialog(record),
    handleCloseVisitDialog: () => setVisitDialog(undefined),
    handleOpenQuickSettings: () => setQuickSettingsOpen(true),
    handleCloseQuickSettings: () => setQuickSettingsOpen(false),
  };
};

export default useCircuitOverseerVisit;
