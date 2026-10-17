import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { IconError } from '@components/icons';
import { useCurrentUser } from '@hooks/index';
import {
  DEFAULT_EVENT_START_HOUR,
  UpcomingEventType,
} from '@definition/upcoming_events';
import { dbUpcomingEventsSave } from '@services/dexie/upcoming_events';
import { upcomingEventsByDataViewState } from '@states/upcoming_events';
import { addHours } from '@utils/date';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { userDataViewState } from '@states/settings';

const useUpcomingEvents = () => {
  const { isAdmin } = useCurrentUser();

  const events = useAtomValue(upcomingEventsByDataViewState);
  const dataView = useAtomValue(userDataViewState);

  const [addEventBoxShow, setAddEventBoxShow] = useState(false);
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);

  const start = new Date();
  start.setHours(DEFAULT_EVENT_START_HOUR, 0, 0, 0);

  // deliberately not memoised: the add form seeds its state from this on
  // mount, so a stable uid would make a second event save over the first
  const emptyEvent: UpcomingEventType = {
    event_uid: crypto.randomUUID(),
    event_data: {
      _deleted: false,
      updatedAt: new Date().toISOString(),
      start: start.toISOString(),
      end: addHours(1, start).toISOString(),
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

  const handleOpenQuickSettings = () => setQuickSettingsOpen(true);

  const handleCloseQuickSettings = () => setQuickSettingsOpen(false);

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
    quickSettingsOpen,
    handleOpenQuickSettings,
    handleCloseQuickSettings,
  };
};

export default useUpcomingEvents;
