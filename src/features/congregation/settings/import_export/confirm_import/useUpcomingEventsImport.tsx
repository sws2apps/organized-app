import { UpcomingEventType } from '@definition/upcoming_events';
import { updatedAtOverride } from '@utils/common';
import appDb from '@db/appDb';

const useUpcomingEventsImport = () => {
  const getUpcomingEvents = async (events: UpcomingEventType[]) => {
    const result: UpcomingEventType[] = [];

    result.push(...events);

    const oldEvents = await appDb.upcoming_events.toArray();

    for (const oldEvent of oldEvents) {
      const newEvent = events.find(
        (record) => record.event_uid === oldEvent.event_uid
      );

      if (!newEvent) {
        oldEvent.event_data._deleted = true;
        oldEvent.event_data.updatedAt = new Date().toISOString();

        result.push(oldEvent);
      }
    }

    return result.map((record) => {
      const data = updatedAtOverride(record);
      return data;
    });
  };

  return { getUpcomingEvents };
};

export default useUpcomingEventsImport;
