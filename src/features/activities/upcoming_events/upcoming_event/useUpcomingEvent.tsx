import { useEffect, useMemo, useRef, useState } from 'react';
import { IconError } from '@components/icons';
import { dbUpcomingEventsSave } from '@services/dexie/upcoming_events';
import { UpcomingEventType } from '@definition/upcoming_events';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { upcomingEventData } from '@services/app/upcoming_events';
import { formatDate } from '@utils/date';
import { decorationsForEvent } from '../decorations_for_event';
import { UpcomingEventProps } from './index.types';

const useUpcomingEvent = ({ data }: UpcomingEventProps) => {
  const dayIndicatorRefs = useRef<HTMLDivElement[]>([]);

  const [isEdit, setIsEdit] = useState(false);
  const [showEditIcon, setShowEditIcon] = useState(false);
  const [dayIndicatorMaxWidth, setDayIndicatorMaxWidth] = useState(0);

  const previousDay = useMemo(() => {
    const result = new Date();
    result.setDate(result.getDate() - 1);

    return formatDate(result, 'yyyy/MM/dd');
  }, []);

  const eventFormatted = useMemo(() => {
    return upcomingEventData(data);
  }, [data]);

  const eventDecoration = useMemo(() => {
    const category = data.event_data.category;

    if (
      category === undefined ||
      category === null ||
      category >= decorationsForEvent.length
    ) {
      return decorationsForEvent[decorationsForEvent.length - 1];
    }

    return decorationsForEvent[category];
  }, [data.event_data.category]);

  const handleMouseEnter = () => setShowEditIcon(true);

  const handleMouseLeave = () => setShowEditIcon(false);

  const handleTurnEditMode = () => setIsEdit((prev) => !prev);

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

  useEffect(() => {
    const widths = dayIndicatorRefs.current.map((el) => el?.offsetWidth || 0);
    const widest = Math.max(...widths);
    setDayIndicatorMaxWidth(widest);
  }, []);

  return {
    eventDecoration,
    isEdit,
    handleOnSaveEvent,
    dayIndicatorMaxWidth,
    dayIndicatorRefs,
    handleTurnEditMode,
    showEditIcon,
    handleMouseEnter,
    handleMouseLeave,
    eventFormatted,
    previousDay,
  };
};

export default useUpcomingEvent;
