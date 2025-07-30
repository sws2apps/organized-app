import { ChangeEvent, useCallback, useState } from 'react';
import { useAtomValue } from 'jotai';
import { SelectChangeEvent } from '@mui/material';
import {
  UpcomingEventCategory,
  UpcomingEventDuration,
} from '@definition/upcoming_events';
import { hour24FormatState } from '@states/settings';
import { stackDatesToOne } from '@utils/date';
import { decorationsForEvent } from '../decorations_for_event';
import { EditUpcomingEventProps } from './index.types';

const useEditUpcomingEvent = ({ data, onSave }: EditUpcomingEventProps) => {
  const hour24 = useAtomValue(hour24FormatState);

  const [localEvent, setLocalEvent] = useState(data);

  const [wasSubmitted, setWasSubmitted] = useState(false);

  const [errors, setErrors] = useState({
    category: false,
    duration: false,
    custom: false,
  });

  const validateField = useCallback(
    (field: keyof typeof errors, value) => {
      const data = localEvent.event_data;

      switch (field) {
        case 'category':
          return value === null || value === undefined;
        case 'duration':
          return data.category === null || data.duration === undefined;
        case 'custom':
          return (
            data.category === UpcomingEventCategory.Custom &&
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
      category: validateField('category', data.category),
      duration: validateField('duration', data.duration),
      custom: validateField('custom', data.custom),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  }, [localEvent.event_data, validateField]);

  const handleChangeEventCategory = useCallback(
    (event: SelectChangeEvent<unknown>) => {
      const targetValue = event.target.value as UpcomingEventCategory;

      setLocalEvent((prev) => ({
        ...prev,
        event_data: {
          ...prev.event_data,
          category: targetValue,
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
      const event = structuredClone(localEvent);
      event.event_data.updatedAt = new Date().toISOString();

      onSave(event);
    }
  }, [localEvent, onSave, validateForm]);

  const handleDeleteEvent = useCallback(() => {
    const event = structuredClone(localEvent);

    event.event_data._deleted = true;
    event.event_data.updatedAt = new Date().toISOString();

    onSave(event);
  }, [localEvent, onSave]);

  return {
    hour24,
    localEvent,
    errors,
    handleChangeEventCategory,
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
