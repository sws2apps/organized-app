import appDb from '@db/appDb';
import { CircuitOverseerEventType } from '@definition/circuit_overseer_visit';
import { CircuitOverseerVisitType } from '@definition/settings';
import { Week } from '@definition/week_type';
import { dbAppSettingsUpdate } from './settings';
import { dbSchedCheck, dbSchedUpdate } from './schedules';

const dbUpdateCircuitOverseerEventsMetadata = async () => {
  const metadata = await appDb.metadata.get(1);
  if (!metadata) return;

  metadata.metadata.circuit_overseer_events = {
    ...metadata.metadata.circuit_overseer_events,
    send_local: true,
  };

  await appDb.metadata.put(metadata);
};

const dbSchedWeekTypeUpdate = async (weekOf: string, value: Week) => {
  const schedule = await appDb.sched.get(weekOf);
  if (!schedule) return;

  const updatedAt = new Date().toISOString();

  await dbSchedUpdate(weekOf, {
    'midweek_meeting.week_type': schedule.midweek_meeting.week_type.map(
      (record) => ({ ...record, value, updatedAt })
    ),
    'weekend_meeting.week_type': schedule.weekend_meeting.week_type.map(
      (record) => ({ ...record, value, updatedAt })
    ),
  });
};

export const dbCircuitOverseerEventSave = async (
  event: CircuitOverseerEventType
) => {
  await appDb.transaction(
    'rw',
    appDb.circuit_overseer_events,
    appDb.metadata,
    async () => {
      await appDb.circuit_overseer_events.put(event);
      await dbUpdateCircuitOverseerEventsMetadata();
    }
  );
};

// Keeps the meeting week type in step with the visit dates.
export const dbCircuitOverseerVisitSave = async (
  visit: CircuitOverseerVisitType
) => {
  await appDb.transaction(
    'rw',
    [appDb.app_settings, appDb.sched, appDb.metadata],
    async () => {
      const settings = await appDb.app_settings.get(1);
      const visits = settings.cong_settings.circuit_overseer.visits;
      const previous = visits.find((record) => record.id === visit.id);

      const weekInUse = (weekOf: string) =>
        visits.some(
          (record) =>
            record.id !== visit.id &&
            !record._deleted &&
            record.weekOf === weekOf
        );

      const leftWeek =
        previous &&
        !previous._deleted &&
        (visit._deleted || previous.weekOf !== visit.weekOf);

      if (leftWeek && !weekInUse(previous.weekOf)) {
        await dbSchedWeekTypeUpdate(previous.weekOf, Week.NORMAL);
      }

      if (!visit._deleted) {
        await dbSchedCheck(visit.weekOf);
        await dbSchedWeekTypeUpdate(visit.weekOf, Week.CO_VISIT);
      }

      const saved = { ...visit, updatedAt: new Date().toISOString() };

      await dbAppSettingsUpdate({
        'cong_settings.circuit_overseer.visits': previous
          ? visits.map((record) => (record.id === visit.id ? saved : record))
          : [...visits, saved],
      });
    }
  );
};

export const dbCircuitOverseerVisitDelete = async (
  visit: CircuitOverseerVisitType
) => {
  await appDb.transaction(
    'rw',
    [
      appDb.app_settings,
      appDb.sched,
      appDb.circuit_overseer_events,
      appDb.metadata,
    ],
    async () => {
      await dbCircuitOverseerVisitSave({ ...visit, _deleted: true });

      const updatedAt = new Date().toISOString();
      const events = await appDb.circuit_overseer_events
        .filter(
          (record) =>
            record.event_data.visit_id === visit.id &&
            !record.event_data._deleted
        )
        .toArray();

      if (events.length === 0) return;

      await appDb.circuit_overseer_events.bulkPut(
        events.map((record) => ({
          ...record,
          event_data: { ...record.event_data, _deleted: true, updatedAt },
        }))
      );
      await dbUpdateCircuitOverseerEventsMetadata();
    }
  );
};
