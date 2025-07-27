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

    let dateV = startDate.getDate();
    let monthIndex = startDate.getMonth();
    let month = months[monthIndex];

    const startDateFormatted = t('tr_longDateNoYearLocale', {
      month,
      date: dateV,
    });

    const endDate = eventDates.at(-1);

    dateV = endDate.getDate();
    monthIndex = endDate.getMonth();
    month = months[monthIndex];

    const endDateFormatted = t('tr_longDateNoYearLocale', {
      month,
      date: dateV,
    });

    return t('tr_dateRangeNoYear', {
      startDate: startDateFormatted,
      endDate: endDateFormatted,
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
