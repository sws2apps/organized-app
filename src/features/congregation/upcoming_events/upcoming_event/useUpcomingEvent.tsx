import { UpcomingEventProps } from './index.types';
import { decorationsForEvent } from '../decorations_for_event';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { dbUpcomingEventBulkSave } from '@services/dexie/upcoming_events';
import { UpcomingEventType } from '@definition/upcoming_events';
import { useAtomValue } from 'jotai';
import { hour24FormatState } from '@states/settings';
import { formatDate, getDatesBetweenDates } from '@utils/date';

const useUpcomingEvent = ({ data }: UpcomingEventProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const hour24 = useAtomValue(hour24FormatState);

  const [dayIndicatorMaxWidth, setDayIndicatorMaxWidth] = useState(0);
  const dayIndicatorRefs = useRef([]);

  useEffect(() => {
    const widths = dayIndicatorRefs.current.map((el) => el?.offsetWidth || 0);
    const widest = Math.max(...widths);
    setDayIndicatorMaxWidth(widest);
  }, []);

  const handleTurnEditMode = useCallback(() => {
    setIsEdit((prev) => !prev);
  }, []);

  const eventDates = useMemo(
    () =>
      getDatesBetweenDates(
        new Date(data.event_data.start),
        new Date(data.event_data.end)
      ),
    [data.event_data.end, data.event_data.start]
  );

  const eventTime = useMemo(
    () =>
      `${formatDate(new Date(data.event_data.start), hour24 ? 'HH:mm' : 'hh:mm a')} - ${formatDate(new Date(data.event_data.end), hour24 ? 'HH:mm' : 'hh:mm a')}`,
    [data.event_data.end, data.event_data.start, hour24]
  );

  const eventDaysCountIndicator = () => {
    const shortMonth = formatDate(eventDates[0], 'LLL');
    const startDay = formatDate(eventDates[0], 'd');
    const endDay = formatDate(eventDates[eventDates.length - 1], 'd');
    return `${shortMonth}. ${startDay}-${endDay}`;
  };

  const eventDecoration =
    data.event_data.type !== undefined &&
    data.event_data.type < decorationsForEvent.length
      ? decorationsForEvent[data.event_data.type]
      : decorationsForEvent[decorationsForEvent.length - 1];

  const handleOnSaveEvent = async (events: UpcomingEventType[]) => {
    try {
      await dbUpcomingEventBulkSave(events);
      handleTurnEditMode();
    } catch (err) {
      throw new Error(err);
    }
  };

  const prevDay = () => {
    const result = new Date();
    result.setDate(result.getDate() - 1);

    return result;
  };

  return {
    eventDecoration,
    isEdit,
    handleOnSaveEvent,
    eventDates,
    eventTime,
    prevDay,
    dayIndicatorMaxWidth,
    dayIndicatorRefs,
    eventDaysCountIndicator,
    handleTurnEditMode,
  };
};

export default useUpcomingEvent;
