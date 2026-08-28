import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { SelectChangeEvent } from '@mui/material';
import {
  UpcomingEventCategory,
  UpcomingEventDuration,
} from '@definition/upcoming_events';
import { hour24FormatState } from '@states/settings';
import { isWholeDayEvent } from '@services/app/upcoming_events';
import {
  addHours,
  formatDate,
  stackDatesToOne,
  sundayOfWeek,
} from '@utils/date';
import { decorationsForEvent } from '../decorations_for_event';
import { EditUpcomingEventProps } from './index.types';
import { useAppTranslation } from '@hooks/index';

const useEditUpcomingEvent = ({ data, onSave }: EditUpcomingEventProps) => {
  const { t } = useAppTranslation();

  const hour24 = useAtomValue(hour24FormatState);

  const [localEvent, setLocalEvent] = useState(data);

  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [errors, setErrors] = useState({
    category: false,
    duration: false,
    custom: false,
    endTime: false,
  });

  const wholeDay = useMemo(() => isWholeDayEvent(localEvent), [localEvent]);

  const eventTitle = useMemo(() => {
    const { category, custom } = localEvent.event_data;

    if (category === UpcomingEventCategory.Custom) return custom ?? '';

    const decoration = decorationsForEvent[category];

    return decoration ? t(decoration.translationKey) : '';
  }, [localEvent.event_data, t]);

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
        case 'endTime':
          if (data.duration === UpcomingEventDuration.MultipleDays) {
            return (
              formatDate(new Date(data.end), 'yyyy/MM/dd') <=
              formatDate(new Date(data.start), 'yyyy/MM/dd')
            );
          }

          return (
            !isWholeDayEvent(localEvent) &&
            new Date(data.end) <= new Date(data.start)
          );
        default:
          return false;
      }
    },
    [localEvent]
  );

  const validateForm = useCallback(() => {
    const data = localEvent.event_data;

    const newErrors = {
      category: validateField('category', data.category),
      duration: validateField('duration', data.duration),
      custom: validateField('custom', data.custom),
      endTime: validateField('endTime', data.end),
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
          wholeDay: decorationsForEvent[targetValue].wholeDay,
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
      const duration = event.target.value as UpcomingEventDuration;

      setLocalEvent((prev) => {
        const category = prev.event_data.category;
        const singleDay = duration === UpcomingEventDuration.SingleDay;

        return {
          ...prev,
          event_data: {
            ...prev.event_data,
            duration,
            wholeDay: singleDay
              ? (decorationsForEvent[category]?.wholeDay ?? false)
              : true,
            end: singleDay
              ? stackDatesToOne(
                  new Date(prev.event_data.start),
                  new Date(prev.event_data.end),
                  true
                ).toISOString()
              : prev.event_data.end,
          },
        };
      });

      if (wasSubmitted) {
        setErrors((prev) => ({ ...prev, duration: false, endTime: false }));
      }
    },
    [wasSubmitted]
  );

  const handleToggleWholeDay = useCallback((value: boolean) => {
    setLocalEvent((prev) => ({
      ...prev,
      event_data: { ...prev.event_data, wholeDay: value },
    }));

    setErrors((prev) => ({ ...prev, endTime: false }));
  }, []);

  const handleChangeEventStartDate = useCallback((value: Date) => {
    setLocalEvent((prev) => {
      const event_data = {
        ...prev.event_data,
        start: stackDatesToOne(
          value,
          new Date(prev.event_data.start),
          true
        ).toISOString(),
      };

      if (prev.event_data.duration === UpcomingEventDuration.SingleDay) {
        event_data.end = stackDatesToOne(
          value,
          new Date(prev.event_data.end),
          true
        ).toISOString();
      }

      if (
        prev.event_data.category ===
          UpcomingEventCategory.CircuitOverseerWeek &&
        prev.event_data.duration === UpcomingEventDuration.MultipleDays
      ) {
        event_data.end = stackDatesToOne(
          sundayOfWeek(value),
          new Date(prev.event_data.end),
          true
        ).toISOString();
      }

      return { ...prev, event_data };
    });

    setErrors((prev) => ({ ...prev, endTime: false }));
  }, []);

  const handleChangeEventStartTime = useCallback((value: Date) => {
    setLocalEvent((prev) => {
      const start = stackDatesToOne(
        new Date(prev.event_data.start),
        value,
        true
      );

      const end = new Date(prev.event_data.end);

      return {
        ...prev,
        event_data: {
          ...prev.event_data,
          start: start.toISOString(),
          end:
            end <= start ? addHours(1, start).toISOString() : end.toISOString(),
        },
      };
    });

    setErrors((prev) => ({ ...prev, endTime: false }));
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

    setErrors((prev) => ({ ...prev, endTime: false }));
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

    setErrors((prev) => ({ ...prev, endTime: false }));
  }, []);

  const handleSaveEvent = useCallback(() => {
    setWasSubmitted(true);

    if (validateForm()) {
      const event = structuredClone(localEvent);
      event.event_data.updatedAt = new Date().toISOString();

      onSave(event);
    }
  }, [localEvent, onSave, validateForm]);

  const handleOpenDeleteConfirm = useCallback(() => setDeleteOpen(true), []);

  const handleCloseDeleteConfirm = useCallback(() => setDeleteOpen(false), []);

  const handleDeleteEvent = useCallback(() => {
    const event = structuredClone(localEvent);

    event.event_data._deleted = true;
    event.event_data.updatedAt = new Date().toISOString();

    setDeleteOpen(false);

    onSave(event);
  }, [localEvent, onSave]);

  return {
    hour24,
    localEvent,
    errors,
    wholeDay,
    handleChangeEventCategory,
    handleChangeEventCustomTitle,
    handleChangeEventDescription,
    handleChangeEventDuration,
    handleToggleWholeDay,

    handleChangeEventStartDate,
    handleChangeEventStartTime,
    handleChangeEventEndDate,
    handleChangeEventEndTime,

    eventTitle,
    handleSaveEvent,
    handleDeleteEvent,
    deleteOpen,
    handleOpenDeleteConfirm,
    handleCloseDeleteConfirm,
  };
};

export default useEditUpcomingEvent;
