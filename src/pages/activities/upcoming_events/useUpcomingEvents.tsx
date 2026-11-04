import { useLocation, useSearchParams } from 'react-router';
import { eventVisibleInDataView } from '@utils/upcoming_events';
import {
  upcomingEventsState,
  saveUpcomingEventState,
  upcomingEventsByDataViewState,
} from '@states/upcoming_events';
import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { IconError } from '@components/icons';
import { useCurrentUser } from '@hooks/index';
import {
  DEFAULT_EVENT_START_HOUR,
  UpcomingEventCategory,
  UpcomingEventDuration,
  UpcomingEventType,
} from '@definition/upcoming_events';

import { addHours } from '@utils/date';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { userDataViewState } from '@states/settings';

const useUpcomingEvents = () => {
  const saveEvent = useSetAtom(saveUpcomingEventState);
  const { isAdmin } = useCurrentUser();

  const activeEvents = useAtomValue(upcomingEventsByDataViewState);
  const allEvents = useAtomValue(upcomingEventsState);
  const campaignsOnly = useLocation().pathname === '/territories/campaigns';
  const [, setParams] = useSearchParams();
  const dataView = useAtomValue(userDataViewState);

  const events = campaignsOnly
    ? allEvents.filter(
        (event) =>
          eventVisibleInDataView(event, dataView) &&
          event.event_data.category ===
            UpcomingEventCategory.SpecialCampaignWeek
      )
    : activeEvents;

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
      end: addHours(campaignsOnly ? 24 : 1, start).toISOString(),
      description: '',
      type: dataView,
      custom: '',
      category: campaignsOnly
        ? UpcomingEventCategory.SpecialCampaignWeek
        : null,
      duration: campaignsOnly ? UpcomingEventDuration.MultipleDays : null,
      wholeDay: campaignsOnly,
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
      await saveEvent(event);
      handleHideAddEventBox();
      if (campaignsOnly)
        setParams((previous) => {
          const next = new URLSearchParams(previous);
          if (event.event_data._deleted) next.delete('event');
          else next.set('event', event.event_uid);
          return next;
        });
      return true;
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: '',
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
      return false;
    }
  };

  return {
    campaignsOnly,
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
