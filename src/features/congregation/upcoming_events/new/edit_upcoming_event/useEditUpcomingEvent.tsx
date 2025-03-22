import { useState } from 'react';
import { EditUpcomingEventProps } from './index.types';
import {
  DateUpcomingEventType,
  UpcomingEventContentType,
} from '@definition/upcoming_events';

const useEditUpcomingEvent = (props: EditUpcomingEventProps) => {
  const [localEvents, setLocalEvents] = useState<UpcomingEventContentType[]>(
    props.data.events
  );

  const [localDates, setLocalDates] = useState<Date[]>(
    Array(props.data.events.length).fill(props.data.date)
  );

  /* ----------------- Functions for handle changes of events ----------------- */

  const handleChangeEventTime = (index: number, value: Date) => {
    setLocalEvents((prev) => {
      prev[index].time.value = value;
      prev[index].time.updatedAt = new Date().toISOString();
      return [...prev];
    });
  };

  const handleChangeEventDate = (index: number, value: Date) => {
    setLocalDates((prev) => {
      prev[index] = value;
      return [...prev];
    });
  };

  const handleChangeEventType = (index: number, value: number) => {
    setLocalEvents((prev) => {
      prev[index].type.value = value;
      prev[index].type.updatedAt = new Date().toISOString();
      return [...prev];
    });
  };

  const handleChangeEventAdditionalInfo = (index: number, value: string) => {
    setLocalEvents((prev) => {
      prev[index].additional.value = value;
      prev[index].additional.updatedAt = new Date().toISOString();
      return [...prev];
    });
  };

  const handleChangeEventCustom = (index: number, value: string) => {
    setLocalEvents((prev) => {
      prev[index].custom.value = value;
      prev[index].custom.updatedAt = new Date().toISOString();
      return [...prev];
    });
  };

  const handleDeleteEvent = (index: number) => {
    setLocalEvents((prev) => {
      prev[index]._deleted.value = true;
      prev[index]._deleted.updatedAt = new Date().toISOString();
      return [...prev];
    });
  };

  /* --------------- End Functions for handle changes of events --------------- */

  const handleAddNewEvent = () => {
    setLocalEvents((prev) => {
      const newEventCreatingTime = new Date().toISOString();

      prev.push({
        time: { value: null, updatedAt: newEventCreatingTime },
        type: { value: 0, updatedAt: newEventCreatingTime },
        additional: { value: '', updatedAt: newEventCreatingTime },
        custom: { value: '', updatedAt: newEventCreatingTime },
        _deleted: { value: false, updatedAt: newEventCreatingTime },
      });

      return [...prev];
    });

    setLocalDates((prev) => {
      prev.push(props.data.date);
      return [...prev];
    });
  };

  const handleSaveChanges = () => {
    const resultData: DateUpcomingEventType[] = [];

    localEvents.forEach((event, index) => {
      if (resultData.some((data) => data.date === localDates[index])) {
        resultData
          .find((data) => data.date === localDates[index])
          .events.push(event);
      } else {
        resultData.push({
          date: localDates[index],
          events: [event],
        });
      }
    });

    props.onSave(resultData);
  };

  return {
    localDates,
    localEvents,
    handleChangeEventTime,
    handleChangeEventDate,
    handleChangeEventType,
    handleChangeEventAdditionalInfo,
    handleChangeEventCustom,
    handleDeleteEvent,
    handleAddNewEvent,
    handleSaveChanges,
  };
};

export default useEditUpcomingEvent;
