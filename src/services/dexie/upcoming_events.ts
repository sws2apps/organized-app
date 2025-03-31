import appDb from '@db/appDb';
import { UpcomingEventType } from '@definition/upcoming_events';

const dbUpdateUpcomingEventMetadata = async () => {
  const metadata = await appDb.metadata.get(1);

  if (!metadata) return;

  metadata.metadata.upcoming_events = {
    ...metadata.metadata.upcoming_events,
    send_local: true,
  };

  await appDb.metadata.put(metadata);
};

export const dbUpcomingEventGetAll = async () => {
  const events = appDb.upcoming_events.toArray();
  return events;
};

export const dbUpcomingEventsGetActive = async () => {
  const events = await appDb.upcoming_events
    .filter((record) => !record._deleted)
    .toArray();

  return events;
};

export const dbUpcomingEventBulkSave = async (events: UpcomingEventType[]) => {
  await appDb.upcoming_events.bulkPut(events);
  await dbUpdateUpcomingEventMetadata();
};

export const dbUpcomingEventsClear = async () => {
  const records = await appDb.upcoming_events.toArray();

  if (records.length === 0) return;

  for (const record of records) {
    record._deleted = true;
    record.updatedAt = new Date().toISOString();
  }

  await appDb.upcoming_events.bulkPut(records);
};
