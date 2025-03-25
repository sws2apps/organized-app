import {
  UpcomingEventCategory,
  UpcomingEventType,
} from '@definition/upcoming_events';
import useCurrentUser from '@hooks/useCurrentUser';
import { dbUpcomingEventBulkSave } from '@services/dexie/upcoming_events';
import { upcomingEventsState } from '@states/upcoming_events';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

const useUpcomingEvents = () => {
  const { isAdmin } = useCurrentUser();
  const upcomingEvents = useRecoilValue(upcomingEventsState);

  const [addEventBoxShow, setAddEventBoxShow] = useState(false);

  const emptyEvent = {
    event_uid: crypto.randomUUID(),
    time: new Date(),
    date: new Date(),
    additional: '',
    custom: '',
    type: UpcomingEventCategory.CircuitOverseerWeek,
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
