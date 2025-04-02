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
        updatedAt: new Date().toISOString(),
        event_data: {
          ...updatedEvents[eventIndex].event_data,
          date: value.toISOString(),
        },
      };
      return updatedEvents;
    });
  };

  const handleChangeEventTime = (eventIndex: number, value: Date) => {
    setLocalEvents((prev) => {
      const updatedEvents = [...prev];
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        updatedAt: new Date().toISOString(),
        event_data: {
          ...updatedEvents[eventIndex].event_data,
          time: value.toISOString(),
        },
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
        updatedAt: new Date().toISOString(),
        event_data: {
          ...updatedEvents[eventIndex].event_data,
          additional: value,
        },
      };
      return updatedEvents;
    });
  };

  const handleChangeEventCustom = (eventIndex: number, value: string) => {
    setLocalEvents((prev) => {
      const updatedEvents = [...prev];
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        updatedAt: new Date().toISOString(),
        event_data: {
          ...updatedEvents[eventIndex].event_data,
          custom: value,
        },
      };
      return updatedEvents;
    });
  };

  const handleChangeEventType = (
    eventIndex: number,
    value: UpcomingEventCategory
  ) => {
    setLocalEvents((prev) => {
      const updatedEvents = [...prev];
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        updatedAt: new Date().toISOString(),
        event_data: {
          ...updatedEvents[eventIndex].event_data,
          type: value,
        },
      };
      return updatedEvents;
    });
  };

  const handleDeleteEvent = (eventIndex: number) => {
    setLocalEvents((prev) => {
      const updatedEvents = [...prev];
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        updatedAt: new Date().toISOString(),
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
        _deleted: false,
        updatedAt: new Date().toISOString(),
        event_data: {
          time: new Date().toISOString(),
          date: data[0].event_data.date,
          additional: '',
          custom: '',
          type: UpcomingEventCategory.CircuitOverseerWeek,
          scope: '',
        },
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
