import useCurrentUser from '@hooks/useCurrentUser';
import { DateWithUpcomingEventsProps } from './index.types';
import { useAppTranslation } from '@hooks/index';
import { formatDate } from 'date-fns';
import { useEffect, useState } from 'react';
import { UpcomingEventType } from '@definition/upcoming_events';

const useDateWithUpcomingEvents = ({ data }: DateWithUpcomingEventsProps) => {
  const { t } = useAppTranslation();
  const { isAdmin } = useCurrentUser();

  const eventsDate = data[0].date.value;

  const [localEvents, setLocalEvents] = useState(data);
  const [editModeIsOn, setEditModeIsOn] = useState(false);

  const handleTurnOnEditMode = () => {
    setEditModeIsOn(true);
  };

  const handleTurnOffEditMode = () => {
    setEditModeIsOn(false);
  };

  useEffect(() => {
    setLocalEvents((prev) =>
      prev.sort(
        (a, b) =>
          new Date(b.time.value).getTime() - new Date(a.time.value).getTime()
      )
    );
  }, [localEvents]);

  const getFormattedDate = formatDate(
    new Date(eventsDate),
    t('tr_longDateFormat')
  );

  const handleSaveUpcomingEvents = (dates: UpcomingEventType[]) => {
    console.log(dates);

    handleTurnOffEditMode();
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
