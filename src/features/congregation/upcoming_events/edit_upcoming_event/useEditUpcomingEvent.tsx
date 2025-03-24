import { useState } from 'react';
import { EditUpcomingEventProps } from './index.types';
import { UpcomingEventСategory } from '@definition/upcoming_events';

const useEditUpcomingEvent = ({ data, onSave }: EditUpcomingEventProps) => {
  const [localEvents, setLocalEvents] = useState(data);

  const handleChangeEventDate = (eventIndex: number, value: Date) => {
    setLocalEvents((prev) => {
      const updatedEvents = [...prev];
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        date: { value, updatedAt: new Date().toISOString() },
      };
      return updatedEvents;
    });
  };

  const handleChangeEventTime = (eventIndex: number, value: Date) => {
    setLocalEvents((prev) => {
      const updatedEvents = [...prev];
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        time: { value, updatedAt: new Date().toISOString() },
      };
      return updatedEvents;
    });
  };

  const handleChangeEventAdditionalInfo = (
    eventIndex: number,
    value: string
  ) => {
    setLocalEvents((prev) => {
      const updatedEvents = [...prev];
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        additional: { value, updatedAt: new Date().toISOString() },
      };
      return updatedEvents;
    });
  };

  const handleChangeEventCustom = (eventIndex: number, value: string) => {
    setLocalEvents((prev) => {
      const updatedEvents = [...prev];
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        custom: { value, updatedAt: new Date().toISOString() },
      };
      return updatedEvents;
    });
  };

  const handleChangeEventType = (eventIndex: number, value: number) => {
    setLocalEvents((prev) => {
      const updatedEvents = [...prev];
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        type: { value, updatedAt: new Date().toISOString() },
      };
      return updatedEvents;
    });
  };

  const handleDeleteEvent = (eventIndex: number) => {
    setLocalEvents((prev) => {
      const updatedEvents = [...prev];
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        _deleted: { value: true, updatedAt: new Date().toISOString() },
      };
      return updatedEvents;
    });
  };

  const handleAddNewEvent = () => {
    setLocalEvents((prev) => {
      const updatedAt = new Date().toISOString();
      const updatedEvents = [...prev];

      updatedEvents.push({
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

      return updatedEvents;
    });
  };

  const handleSaveChanges = () => {
    onSave(localEvents);
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
