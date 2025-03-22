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
      prev[index].time = value;
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
      prev[index].type = value;
      return [...prev];
    });
  };

  const handleChangeEventAdditionalInfo = (index: number, value: string) => {
    setLocalEvents((prev) => {
      prev[index].additional = value;
      return [...prev];
    });
  };

  const handleChangeEventCustom = (index: number, value: string) => {
    setLocalEvents((prev) => {
      prev[index].custom = value;
      return [...prev];
    });
  };

  const handleDeleteEvent = (index: number) => {
    setLocalEvents((prev) => {
      prev[index]._deleted = true;
      return [...prev];
    });
  };

  /* --------------- End Functions for handle changes of events --------------- */

  const handleAddNewEvent = () => {
    setLocalEvents((prev) => {
      prev.push({
        time: null,
        type: 0,
        additional: null,
        custom: null,
        _deleted: false,
        updatedAt: new Date().toISOString(),
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
