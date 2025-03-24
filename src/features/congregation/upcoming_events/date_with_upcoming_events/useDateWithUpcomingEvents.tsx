import useCurrentUser from '@hooks/useCurrentUser';
import { DateWithUpcomingEventsProps } from './index.types';
import { useAppTranslation } from '@hooks/index';
import { formatDate } from 'date-fns';
import { useEffect, useState } from 'react';
import { UpcomingEventType } from '@definition/upcoming_events';
import { dbUpcomingEventBulkSave } from '@services/dexie/upcoming_events';

const useDateWithUpcomingEvents = ({ data }: DateWithUpcomingEventsProps) => {
  const { t } = useAppTranslation();
  const { isAdmin } = useCurrentUser();

  const [eventsDate, setEventsDate] = useState(null);
  const [localEvents, setLocalEvents] = useState(data);
  const [editModeIsOn, setEditModeIsOn] = useState(false);

  useEffect(() => {
    if (data.length > 0 && data[0]?.date?.value) {
      setEventsDate(data[0].date.value);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const sortedEvents = [...data].sort(
        (a, b) =>
          new Date(b.time.value).getTime() - new Date(a.time.value).getTime()
      );
      setLocalEvents(sortedEvents);
    }
  }, [data]);

  const getFormattedDate = () => {
    if (!eventsDate) {
      return '';
    }

    return formatDate(new Date(eventsDate), t('tr_longDateFormat'));
  };

  const handleSaveUpcomingEvents = async (dates: UpcomingEventType[]) => {
    try {
      await dbUpcomingEventBulkSave(dates);
      handleTurnOffEditMode();
    } catch (err) {
      throw new Error(err);
    }
  };

  const handleTurnOnEditMode = () => {
    setEditModeIsOn(true);
  };

  const handleTurnOffEditMode = () => {
    setEditModeIsOn(false);
  };

  return {
    isAdmin,
    getFormattedDate,
    localEvents,
    handleTurnOnEditMode,
    handleTurnOffEditMode,
    editModeIsOn,
    handleSaveUpcomingEvents,
  };
};

export default useDateWithUpcomingEvents;
