import { UpcomingEventProps } from './index.types';
import { decorationsForEvent } from '../decorations_for_event';
import { useEffect, useMemo, useRef, useState } from 'react';
import { dbUpcomingEventBulkSave } from '@services/dexie/upcoming_events';
import { UpcomingEventType } from '@definition/upcoming_events';
import { useAtomValue } from 'jotai';
import { hour24FormatState } from '@states/settings';
import { format, formatDate } from 'date-fns';
import { useAppTranslation } from '@hooks/index';

let allLocales;
import('date-fns/locale').then((locales) => {
  allLocales = locales;
});

const useUpcomingEvent = ({ data }: UpcomingEventProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const { t } = useAppTranslation();
  const hour24 = useAtomValue(hour24FormatState);

  const [dayIndicatorMaxWidth, setDayIndicatorMaxWidth] = useState(0);
  const dayIndicatorRefs = useRef([]);

  useEffect(() => {
    const widths = dayIndicatorRefs.current.map((el) => el?.offsetWidth || 0);
    const widest = Math.max(...widths);
    setDayIndicatorMaxWidth(widest);
  }, []);

  const handleTurnOnEditMode = () => {
    setIsEdit(true);
  };

  const handleTurnOffEditMode = () => {
    setIsEdit(false);
  };

  const getDatesBetweenDates = (start: Date, end: Date): Date[] => {
    const dates: Date[] = [];

    const datePointer = new Date(start);

    while (datePointer <= end) {
      dates.push(new Date(datePointer));
      datePointer.setDate(datePointer.getDate() + 1);
    }
    dates.push(new Date(datePointer));

    return dates;
  };

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
      `${format(data.event_data.start, hour24 ? 'HH:mm' : 'hh:mm a')} - ${format(data.event_data.end, hour24 ? 'HH:mm' : 'hh:mm a')}`,
    [data.event_data.end, data.event_data.start, hour24]
  );

  const eventDaysCountIndicator = () => {
    const shortMonth = formatDate(eventDates[0], 'LLL', {
      locale:
        allLocales && allLocales[t('tr_iso')]
          ? allLocales[t('tr_iso')]
          : undefined,
    });
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
      handleTurnOffEditMode();
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
    handleTurnOnEditMode,
    handleOnSaveEvent,
    handleTurnOffEditMode,
    eventDates,
    eventTime,
    prevDay,
    dayIndicatorMaxWidth,
    dayIndicatorRefs,
    eventDaysCountIndicator,
  };
};

export default useUpcomingEvent;
