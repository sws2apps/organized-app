import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { IconError } from '@components/icons';
import { useCurrentUser } from '@hooks/index';
import { UpcomingEventType } from '@definition/upcoming_events';
import { dbUpcomingEventsSave } from '@services/dexie/upcoming_events';
import { upcomingEventsActiveState } from '@states/upcoming_events';
import { addHours } from '@utils/date';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { userDataViewState } from '@states/settings';

const useUpcomingEvents = () => {
  const { isAdmin } = useCurrentUser();

  const upcomingEvents = useAtomValue(upcomingEventsActiveState);
  const dataView = useAtomValue(userDataViewState);

  const [addEventBoxShow, setAddEventBoxShow] = useState(false);

  const events = useMemo(() => {
    return upcomingEvents.filter((record) => {
      if (dataView === 'main') {
        return record.event_data.type === 'main';
      }

      // language group events (main + own events)
      return (
        record.event_data.type === 'main' || record.event_data.type === dataView
      );
    });
  }, [upcomingEvents, dataView]);

  const emptyEvent: UpcomingEventType = {
    event_uid: crypto.randomUUID(),
    event_data: {
      _deleted: false,
      updatedAt: new Date().toISOString(),
      start: new Date().toISOString(),
      end: addHours(5).toISOString(),
      description: '',
      type: dataView,
      custom: '',
      category: null,
      duration: null,
    },
  };

  const handleShowAddEventBox = () => {
    setAddEventBoxShow(true);
  };

  const handleHideAddEventBox = () => {
    setAddEventBoxShow(false);
  };

  const handleAddEventButtonClick = () => {
    handleShowAddEventBox();
  };

  const handleSaveEvent = async (event: UpcomingEventType) => {
    try {
      await dbUpcomingEventsSave(event);
      handleHideAddEventBox();
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

  return {
    isAdmin,
    emptyEvent,
    events,
    addEventBoxShow,
    handleSaveEvent,
    handleHideAddEventBox,
    handleAddEventButtonClick,
  };
};

export default useUpcomingEvents;
