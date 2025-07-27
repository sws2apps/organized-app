import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { IconError } from '@components/icons';
import { useCurrentUser } from '@hooks/index';
import { UpcomingEventType } from '@definition/upcoming_events';
import { dbUpcomingEventBulkSave } from '@services/dexie/upcoming_events';
import { upcomingEventsState } from '@states/upcoming_events';
import { addHours } from '@utils/date';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { userDataViewState } from '@states/settings';

const useUpcomingEvents = () => {
  const { isAdmin } = useCurrentUser();

  const upcomingEvents = useAtomValue(upcomingEventsState);
  const dataView = useAtomValue(userDataViewState);

  const [addEventBoxShow, setAddEventBoxShow] = useState(false);

  const emptyEvent: UpcomingEventType = {
    event_uid: crypto.randomUUID(),
    _deleted: false,
    updatedAt: new Date().toISOString(),
    event_data: {
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

  const saveNewEvents = async (events: UpcomingEventType[]) => {
    try {
      await dbUpcomingEventBulkSave(events);
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
    upcomingEvents,
    addEventBoxShow,
    saveNewEvents,
    handleHideAddEventBox,
    handleAddEventButtonClick,
  };
};

export default useUpcomingEvents;
