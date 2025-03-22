import useCurrentUser from '@hooks/useCurrentUser';
import { DateWithUpcomingEventsProps } from './index.types';
import { useAppTranslation } from '@hooks/index';
import { formatDate } from 'date-fns';
import { useEffect, useState } from 'react';
import { DateUpcomingEventType } from '@definition/upcoming_events';

const useDateWithUpcomingEvents = (props: DateWithUpcomingEventsProps) => {
  const { t } = useAppTranslation();
  const { isAdmin } = useCurrentUser();

  const [localEvents, setLocalEvents] = useState(props.data.events);

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
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
      )
    );
  }, [localEvents]);

  const getFormattedDate = formatDate(
    new Date(props.data.date),
    t('tr_longDateFormat')
  );

  const handleSaveUpcomingEvents = (dates: DateUpcomingEventType[]) => {
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
