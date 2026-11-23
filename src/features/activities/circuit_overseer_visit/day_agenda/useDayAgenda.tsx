import { useAtomValue } from 'jotai';
import { fullnameOptionState, settingsState } from '@states/settings';
import { dbCircuitOverseerEventSave } from '@services/dexie/circuit_overseer_visit';
import { circuitOverseerNamesGet } from '@utils/circuit_overseer_visit';
import { DayAgendaProps } from './index.types';

const useDayAgenda = ({ visit, day }: DayAgendaProps) => {
  const settings = useAtomValue(settingsState);
  const fullnameOption = useAtomValue(fullnameOptionState);

  const names = circuitOverseerNamesGet(settings, visit.weekOf, fullnameOption);

  const overseer = [names.fullname, names.wifeFullname]
    .filter(Boolean)
    .join(' & ');

  const handleAddEvent = async () => {
    await dbCircuitOverseerEventSave({
      event_uid: crypto.randomUUID(),
      event_data: {
        _deleted: false,
        updatedAt: new Date().toISOString(),
        visit_id: visit.id,
        day: day.day,
        time: '',
        category: 'field_service',
        address: '',
        notes: '',
        hosts: [],
        elders_only: false,
      },
    });
  };

  return { overseer, handleAddEvent };
};

export default useDayAgenda;
