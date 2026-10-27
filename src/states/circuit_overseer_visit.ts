/*
This file holds the source of the truth from the table "circuit_overseer_events".
*/

import { atom } from 'jotai';
import { CircuitOverseerEventType } from '@definition/circuit_overseer_visit';
import { formatDate, getWeekDate } from '@utils/date';
import { settingsState } from './settings';

export const circuitOverseerEventsDbState = atom<CircuitOverseerEventType[]>(
  []
);

export const circuitOverseerEventsState = atom((get) =>
  get(circuitOverseerEventsDbState).filter(
    (record) => !record.event_data._deleted
  )
);

// A visit stays listed through its Sunday and drops off the next Monday.
export const circuitOverseerVisitsState = atom((get) => {
  const currentWeek = formatDate(getWeekDate(), 'yyyy/MM/dd');

  return get(settingsState)
    .cong_settings.circuit_overseer.visits.filter(
      (record) => !record._deleted && record.weekOf >= currentWeek
    )
    .sort((a, b) => a.weekOf.localeCompare(b.weekOf));
});
