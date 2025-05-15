import { UpcomingEventProps } from './index.types';
import { decorationsForEvent } from '../decorations_for_event';
import { useMemo, useState } from 'react';
import { dbUpcomingEventBulkSave } from '@services/dexie/upcoming_events';
import { UpcomingEventType } from '@definition/upcoming_events';
import useCurrentUser from '@hooks/useCurrentUser';

const useUpcomingEvent = ({ data }: UpcomingEventProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const { isAdmin } = useCurrentUser();

  const sortedEventDates = useMemo(() => {
    return data.event_data.event_dates.slice().sort((a, b) => {
      const dateA = new Date(a.start);
      const dateB = new Date(b.start);

      const dateOnlyA = new Date(
        dateA.getFullYear(),
        dateA.getMonth(),
        dateA.getDate()
      );
      const dateOnlyB = new Date(
        dateB.getFullYear(),
        dateB.getMonth(),
        dateB.getDate()
      );

      return dateOnlyA.getTime() - dateOnlyB.getTime();
    });
  }, [data.event_data.event_dates]);

  const handleTurnOnEditMode = () => {
    setIsEdit(true);
  };

  const handleTurnOffEditMode = () => {
    setIsEdit(false);
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

  return {
    eventDecoration,
    isEdit,
    handleTurnOnEditMode,
    handleOnSaveEvent,
    handleTurnOffEditMode,
    sortedEventDates,
    isAdmin,
  };
};

export default useUpcomingEvent;
