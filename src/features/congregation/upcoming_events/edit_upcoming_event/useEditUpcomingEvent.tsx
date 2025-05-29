import { ChangeEvent, useState } from 'react';
import { EditUpcomingEventProps } from './index.types';
import {
  UpcomingEventCategory,
  UpcomingEventDuration,
} from '@definition/upcoming_events';
import { useAtomValue } from 'jotai';
import { hour24FormatState } from '@states/settings';
import { stackDatesToOne } from '@utils/date';
import { SelectChangeEvent } from '@mui/material';
import { decorationsForEvent } from '../decorations_for_event';

const useEditUpcomingEvent = ({ data, onSave }: EditUpcomingEventProps) => {
  const hour24 = useAtomValue(hour24FormatState);

  const [localEvent, setLocalEvent] = useState(data);

  const handleChangeEventType = (event: SelectChangeEvent<unknown>) => {
    const targetValue = event.target.value as UpcomingEventCategory;
    setLocalEvent((prev) => {
      return {
        ...prev,
        event_data: {
          ...prev.event_data,
          type: targetValue,
          duration: decorationsForEvent[targetValue].duration,
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

  const handleChangeEventDuration = (event: SelectChangeEvent<unknown>) => {
    setLocalEvent((prev) => {
      return {
        ...prev,
        event_data: {
          ...prev.event_data,
          duration: event.target.value as UpcomingEventDuration,
        },
      };
    });
  };

  const handleChangeEventStartDate = (value: Date) => {
    setLocalEvent((prev) => {
      return {
        ...prev,
        event_data: {
          ...prev.event_data,
          start: stackDatesToOne(
            value,
            new Date(prev.event_data.start),
            true
          ).toISOString(),
        },
      };
    });
  };

  const handleChangeEventStartTime = (value: Date) => {
    setLocalEvent((prev) => {
      return {
        ...prev,
        event_data: {
          ...prev.event_data,
          start: stackDatesToOne(
            new Date(prev.event_data.start),
            value,
            true
          ).toISOString(),
        },
      };
    });
  };

  const handleChangeEventEndDate = (value: Date) => {
    setLocalEvent((prev) => {
      return {
        ...prev,
        event_data: {
          ...prev.event_data,
          end: stackDatesToOne(
            value,
            new Date(prev.event_data.end),
            true
          ).toISOString(),
        },
      };
    });
  };

  const handleChangeEventEndTime = (value: Date) => {
    setLocalEvent((prev) => {
      return {
        ...prev,
        event_data: {
          ...prev.event_data,
          end: stackDatesToOne(
            new Date(prev.event_data.start),
            value,
            true
          ).toISOString(),
        },
      };
    });
  };

  const handleSaveEvent = () => {
    onSave([localEvent]);
  };

  const handleDeleteEvent = () => {
    onSave([
      {
        ...localEvent,
        _deleted: true,
      },
    ]);
  };

  return {
    hour24,
    localEvent,
    handleChangeEventType,
    handleChangeEventCustomTitle,
    handleChangeEventDescription,
    handleChangeEventDuration,

    handleChangeEventStartDate,
    handleChangeEventStartTime,
    handleChangeEventEndDate,
    handleChangeEventEndTime,

    handleSaveEvent,
    handleDeleteEvent,
  };
};

export default useEditUpcomingEvent;
