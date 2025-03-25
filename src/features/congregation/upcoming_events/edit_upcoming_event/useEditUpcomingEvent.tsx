import { useState } from 'react';
import { EditUpcomingEventProps } from './index.types';
import { UpcomingEventCategory } from '@definition/upcoming_events';

const useEditUpcomingEvent = ({ data, onSave }: EditUpcomingEventProps) => {
  const [localEvents, setLocalEvents] = useState(data);

  const handleChangeEventDate = (eventIndex: number, value: Date) => {
    setLocalEvents((prev) => {
      const updatedEvents = [...prev];
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        date: value.toISOString(),
      };
      return updatedEvents;
    });
  };

  const handleChangeEventTime = (eventIndex: number, value: Date) => {
    setLocalEvents((prev) => {
      const updatedEvents = [...prev];
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        time: value.toISOString(),
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
        additional: value,
      };
      return updatedEvents;
    });
  };

  const handleChangeEventCustom = (eventIndex: number, value: string) => {
    setLocalEvents((prev) => {
      const updatedEvents = [...prev];
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        custom: value,
      };
      return updatedEvents;
    });
  };

  const handleChangeEventType = (eventIndex: number, value: number) => {
    setLocalEvents((prev) => {
      const updatedEvents = [...prev];
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        type: value,
      };
      return updatedEvents;
    });
  };

  const handleDeleteEvent = (eventIndex: number) => {
    setLocalEvents((prev) => {
      const updatedEvents = [...prev];
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        _deleted: true,
      };
      return updatedEvents;
    });
  };

  const handleAddNewEvent = () => {
    setLocalEvents((prev) => {
      const updatedEvents = [...prev];

      updatedEvents.push({
        event_uid: crypto.randomUUID(),
        time: '',
        date: data[0].date,
        additional: '',
        custom: '',
        type: UpcomingEventCategory.CircuitOverseerWeek,
        _deleted: false,
        scope: '',
        updatedAt: new Date().toISOString(),
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
