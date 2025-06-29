import { ChangeEvent, useCallback, useState } from 'react';
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

  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [errors, setErrors] = useState({
    type: false,
    duration: false,
    custom: false,
  });

  const validateField = useCallback(
    (field: keyof typeof errors, value) => {
      const data = localEvent.event_data;

      switch (field) {
        case 'type':
          return value === null || value === undefined;
        case 'duration':
          return data.type === null || data.duration === undefined;
        case 'custom':
          return (
            data.type === UpcomingEventCategory.Custom &&
            (!value || value.trim() === '')
          );
        default:
          return false;
      }
    },
    [localEvent.event_data]
  );

  const validateForm = useCallback(() => {
    const data = localEvent.event_data;

    const newErrors = {
      type: validateField('type', data.type),
      duration: validateField('duration', data.duration),
      custom: validateField('custom', data.custom),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  }, [localEvent.event_data, validateField]);

  const handleChangeEventType = useCallback(
    (event: SelectChangeEvent<unknown>) => {
      const targetValue = event.target.value as UpcomingEventCategory;

      setLocalEvent((prev) => ({
        ...prev,
        event_data: {
          ...prev.event_data,
          type: targetValue,
          duration: decorationsForEvent[targetValue].duration,
        },
      }));

      if (wasSubmitted) {
        setErrors((prev) => ({
          ...prev,
          type: false,
          duration: false,
        }));
      }
    },
    [wasSubmitted]
  );

  const handleChangeEventCustomTitle = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setLocalEvent((prev) => {
        return {
          ...prev,
          event_data: {
            ...prev.event_data,
            custom: event.target.value,
          },
        };
      });

      if (wasSubmitted) {
        setErrors((prev) => ({ ...prev, custom: false }));
      }
    },
    [wasSubmitted]
  );

  const handleChangeEventDescription = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setLocalEvent((prev) => {
        return {
          ...prev,
          event_data: {
            ...prev.event_data,
            description: event.target.value,
          },
        };
      });
    },
    []
  );

  const handleChangeEventDuration = useCallback(
    (event: SelectChangeEvent<unknown>) => {
      setLocalEvent((prev) => {
        return {
          ...prev,
          event_data: {
            ...prev.event_data,
            duration: event.target.value as UpcomingEventDuration,
          },
        };
      });

      if (wasSubmitted) {
        setErrors((prev) => ({ ...prev, duration: false }));
      }
    },
    [wasSubmitted]
  );

  const handleChangeEventStartDate = useCallback((value: Date) => {
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
  }, []);

  const handleChangeEventStartTime = useCallback((value: Date) => {
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
  }, []);

  const handleChangeEventEndDate = useCallback((value: Date) => {
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
  }, []);

  const handleChangeEventEndTime = useCallback((value: Date) => {
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
  }, []);

  const handleSaveEvent = useCallback(() => {
    setWasSubmitted(true);
    if (validateForm()) {
      onSave([localEvent]);
    }
  }, [localEvent, onSave, validateForm]);

  const handleDeleteEvent = useCallback(() => {
    onSave([
      {
        ...localEvent,
        _deleted: true,
      },
    ]);
  }, [localEvent, onSave]);

  return {
    hour24,
    localEvent,
    errors,
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
