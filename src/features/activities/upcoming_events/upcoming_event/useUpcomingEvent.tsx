import { useEffect, useMemo, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { IconError } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { addDays, formatDate } from '@utils/date';
import { dbUpcomingEventsSave } from '@services/dexie/upcoming_events';
import { UpcomingEventType } from '@definition/upcoming_events';
import { hour24FormatState } from '@states/settings';
import { monthShortNamesState } from '@states/app';
import { decorationsForEvent } from '../decorations_for_event';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { UpcomingEventProps } from './index.types';

const useUpcomingEvent = ({ data }: UpcomingEventProps) => {
  const { t } = useAppTranslation();

  const hour24 = useAtomValue(hour24FormatState);
  const months = useAtomValue(monthShortNamesState);

  const dayIndicatorRefs = useRef<HTMLDivElement[]>([]);

  const [isEdit, setIsEdit] = useState(false);
  const [showEditIcon, setShowEditIcon] = useState(false);
  const [dayIndicatorMaxWidth, setDayIndicatorMaxWidth] = useState(0);

  const eventDates = useMemo(() => {
    const dates: Date[] = [];

    const start = formatDate(new Date(data.event_data.start), 'yyyy/MM/dd');
    const end = formatDate(new Date(data.event_data.end), 'yyyy/MM/dd');

    let currentDate = start;

    do {
      dates.push(new Date(currentDate));
      currentDate = formatDate(addDays(currentDate, 1), 'yyyy/MM/dd');
    } while (currentDate <= end);

    return dates;
  }, [data.event_data.end, data.event_data.start]);

  const eventTime = useMemo(() => {
    const startTime = formatDate(
      new Date(data.event_data.start),
      hour24 ? 'HH:mm' : 'hh:mmaaa'
    );

    const endTime = formatDate(
      new Date(data.event_data.end),
      hour24 ? 'HH:mm' : 'hh:mmaaa'
    );

    return t('tr_dateRangeNoYear', {
      startDate: startTime,
      endDate: endTime,
    });
  }, [data.event_data.end, data.event_data.start, hour24, t]);

  const eventDecoration = useMemo(() => {
    return data.event_data.category !== undefined &&
      data.event_data.category < decorationsForEvent.length
      ? decorationsForEvent[data.event_data.category]
      : decorationsForEvent[decorationsForEvent.length - 1];
  }, [data.event_data.category]);

  const handleMouseEnter = () => setShowEditIcon(true);

  const handleMouseLeave = () => setShowEditIcon(false);

  const handleTurnEditMode = () => setIsEdit((prev) => !prev);

  const generateDatesRange = () => {
    const startDate = eventDates.at(0);
    const startDateV = startDate.getDate();
    const startMonthIndex = startDate.getMonth();
    const startMonth = months[startMonthIndex];

    const endDate = eventDates.at(-1);
    const endDateV = endDate.getDate();
    const endMonthIndex = endDate.getMonth();
    const endMonth = months[endMonthIndex];

    if (startMonthIndex !== endMonthIndex) {
      const startDateFormatted = t('tr_longDateNoYearLocale', {
        month: startMonth,
        date: startDateV,
      });

      const endDateFormatted = t('tr_longDateNoYearLocale', {
        month: endMonth,
        date: endDateV,
      });

      return t('tr_dateRangeNoYear', {
        startDate: startDateFormatted,
        endDate: endDateFormatted,
      });
    }

    const dateRanges = t('tr_dateRangeNoYear', {
      startDate: startDateV,
      endDate: endDateV,
    });

    return t('tr_longDateNoYearLocale', {
      month: startMonth,
      date: dateRanges,
    });
  };

  const handleOnSaveEvent = async (event: UpcomingEventType) => {
    try {
      await dbUpcomingEventsSave(event);
      handleTurnEditMode();
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: error.message,
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
    }
  };

  const prevDay = () => {
    const result = new Date();
    result.setDate(result.getDate() - 1);

    return result;
  };

  useEffect(() => {
    const widths = dayIndicatorRefs.current.map((el) => el?.offsetWidth || 0);
    const widest = Math.max(...widths);
    setDayIndicatorMaxWidth(widest);
  }, []);

  return {
    eventDecoration,
    isEdit,
    handleOnSaveEvent,
    eventDates,
    eventTime,
    prevDay,
    dayIndicatorMaxWidth,
    dayIndicatorRefs,
    generateDatesRange,
    handleTurnEditMode,
    showEditIcon,
    handleMouseEnter,
    handleMouseLeave,
  };
};

export default useUpcomingEvent;
