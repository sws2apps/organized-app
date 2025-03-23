import { useState } from 'react';
import { EditUpcomingEventProps } from './index.types';
import { UpcomingEventСategory } from '@definition/upcoming_events';
import {
  dbUpcomingEventBulkSave,
  dbUpcomingEventGetAll,
} from '@services/dexie/upcoming_events';

const useEditUpcomingEvent = ({ data }: EditUpcomingEventProps) => {
  const [localEvents, setLocalEvents] = useState(data);

  const handleChangeEventDate = (eventIndex: number, value: Date) => {
    setLocalEvents((prev) => {
      prev[eventIndex].date = {
        value: value,
        updatedAt: new Date().toISOString(),
      };
      return [...prev];
    });
  };

  const handleChangeEventTime = (eventIndex: number, value: Date) => {
    setLocalEvents((prev) => {
      prev[eventIndex].time = {
        value: value,
        updatedAt: new Date().toISOString(),
      };
      return [...prev];
    });
  };

  const handleChangeEventAdditionalInfo = (
    eventIndex: number,
    value: string
  ) => {
    setLocalEvents((prev) => {
      prev[eventIndex].additional = {
        value: value,
        updatedAt: new Date().toISOString(),
      };
      return [...prev];
    });
  };

  const handleChangeEventCustom = (eventIndex: number, value: string) => {
    setLocalEvents((prev) => {
      prev[eventIndex].custom = {
        value: value,
        updatedAt: new Date().toISOString(),
      };
      return [...prev];
    });
  };

  const handleChangeEventType = (eventIndex: number, value: number) => {
    setLocalEvents((prev) => {
      prev[eventIndex].type = {
        value: value,
        updatedAt: new Date().toISOString(),
      };
      return [...prev];
    });
  };

  const handleDeleteEvent = (eventIndex: number) => {
    setLocalEvents((prev) => {
      prev[eventIndex]._deleted = {
        value: true,
        updatedAt: new Date().toISOString(),
      };
      return [...prev];
    });
  };

  const handleAddNewEvent = () => {
    setLocalEvents((prev) => {
      const updatedAt = new Date().toISOString();
      prev.push({
        event_uid: crypto.randomUUID(),
        time: { value: null, updatedAt: updatedAt },
        date: { value: data[0].date.value, updatedAt: updatedAt },
        additional: { value: '', updatedAt: updatedAt },
        custom: { value: '', updatedAt: updatedAt },
        type: {
          value: UpcomingEventСategory.CircuitOverseerWeek,
          updatedAt: updatedAt,
        },
        _deleted: { value: false, updatedAt: updatedAt },
      });

      return [...prev];
    });
  };

  const handleSaveChanges = async () => {
    try {
      await dbUpcomingEventBulkSave(localEvents);
      const a = await dbUpcomingEventGetAll();
      console.log(a);
    } catch (err) {
      throw new Error(err);
    }
  };

  return {
    localEvents,
    handleDeleteEvent,
    handleAddNewEvent,
    handleSaveChanges,
    handleChangeEventDate,
    handleChangeEventTime,
    handleChangeEventType,
    handleChangeEventCustom,
    handleChangeEventAdditionalInfo,
  };
};

export default useEditUpcomingEvent;
