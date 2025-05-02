import {
  UpcomingEventCategory,
  UpcomingEventType,
} from '@definition/upcoming_events';
import useCurrentUser from '@hooks/useCurrentUser';
import { dbUpcomingEventBulkSave } from '@services/dexie/upcoming_events';
import { upcomingEventsState } from '@states/upcoming_events';
import { useState } from 'react';
import { useAtomValue } from 'jotai';

const useUpcomingEvents = () => {
  const { isAdmin } = useCurrentUser();
  const upcomingEvents = useAtomValue(upcomingEventsState);

  const [addEventBoxShow, setAddEventBoxShow] = useState(false);

  const emptyEvent = {
    event_uid: crypto.randomUUID(),
    event_data: {
      start_time: '',
      end_time: '',
      additional: '',
      scope: '',
      custom: '',
      type: UpcomingEventCategory.CircuitOverseerWeek,
    },
    _deleted: false,
    updatedAt: new Date().toISOString(),
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
    } catch (err) {
      throw new Error(err);
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
