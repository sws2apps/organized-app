import { ChangeEvent, useState } from 'react';
import { EditUpcomingEventProps } from './index.types';
import { UpcomingEventCategory } from '@definition/upcoming_events';
import { SelectChangeEvent } from '@mui/material';
import { stackDatesToOne } from '@utils/date';
import { addHours } from 'date-fns';
import { useAtomValue } from 'jotai';
import { hour24FormatState } from '@states/settings';

const useEditUpcomingEvent = ({ data, onSave }: EditUpcomingEventProps) => {
  const hour24 = useAtomValue(hour24FormatState);

  const [localEvent, setLocalEvent] = useState(data);
  const [localEventDates, setLocalEventDates] = useState(
    data.event_data.event_dates
  );

  const handleChangeEventType = (event: SelectChangeEvent<unknown>) => {
    setLocalEvent((prev) => {
      return {
        ...prev,
        event_data: {
          ...prev.event_data,
          type: event.target.value as UpcomingEventCategory,
        },
      };
    });
  };

  const handleChangeEventCustomTitle = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setLocalEvent((prev) => {
      return {
        ...prev,
        event_data: {
          ...prev.event_data,
          custom: event.target.value,
        },
      };
    });
  };

  const handleChangeEventDescription = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setLocalEvent((prev) => {
      return {
        ...prev,
        event_data: {
          ...prev.event_data,
          description: event.target.value,
        },
      };
    });
  };

  const handleChangeEventDateDate = (value: Date, index: number) => {
    setLocalEventDates((prev) => {
      const updatedDates = [...prev];

      updatedDates[index] = {
        ...updatedDates[index],
        start: stackDatesToOne(
          value,
          new Date(updatedDates[index].start),
          true
        ).toISOString(),
        end: stackDatesToOne(
          value,
          new Date(updatedDates[index].start),
          true
        ).toISOString(),
      };

      return updatedDates;
    });
  };

  const handleChangeEventDateStartTime = (value: Date, index: number) => {
    setLocalEventDates((prev) => {
      const updatedDates = [...prev];

      updatedDates[index] = {
        ...updatedDates[index],
        start: stackDatesToOne(
          new Date(updatedDates[index].start),
          value,
          true
        ).toISOString(),
      };

      return updatedDates;
    });
  };

  const handleChangeEventDateEndTime = (value: Date, index: number) => {
    setLocalEventDates((prev) => {
      const updatedDates = [...prev];

      updatedDates[index] = {
        ...updatedDates[index],
        end: stackDatesToOne(
          new Date(updatedDates[index].start),
          value,
          true
        ).toISOString(),
      };

      return updatedDates;
    });
  };

  const handleChangeEventDateComment = (value: string, index: number) => {
    setLocalEventDates((prev) => {
      const updatedDates = [...prev];

      updatedDates[index] = {
        ...updatedDates[index],
        comment: value,
      };

      return updatedDates;
    });
  };

  const handleDeleteEventDate = (index: number) => {
    if (localEventDates.length !== 1) {
      setLocalEventDates((prev) => {
        const updatedDates = [...prev];
        updatedDates.splice(index, 1);
        return updatedDates;
      });
    }
  };

  const handleAddEventDate = () => {
    setLocalEventDates((prev) => {
      const updatedDates = [...prev];

      updatedDates.push({
        start: new Date().toISOString(),
        end: addHours(new Date(), 5).toISOString(),
        comment: '',
      });

      return updatedDates;
    });
  };

  const handleSaveEvent = () => {
    const upcomingEvent = localEvent;
    upcomingEvent.event_data.event_dates = localEventDates;

    onSave([upcomingEvent]);
  };

  const handleDeleteEvent = () => {
    const upcomingEvent = localEvent;
    upcomingEvent.event_data.event_dates = localEventDates;
    upcomingEvent._deleted = true;

    onSave([upcomingEvent]);
  };

  return {
    hour24,
    localEvent,
    localEventDates,

    handleChangeEventType,
    handleChangeEventCustomTitle,
    handleChangeEventDescription,

    handleChangeEventDateDate,
    handleChangeEventDateStartTime,
    handleChangeEventDateEndTime,
    handleChangeEventDateComment,
    handleDeleteEventDate,
    handleAddEventDate,

    handleSaveEvent,
    handleDeleteEvent,
  };
};

export default useEditUpcomingEvent;
