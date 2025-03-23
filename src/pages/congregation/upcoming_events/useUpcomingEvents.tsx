import useCurrentUser from '@hooks/useCurrentUser';
import { upcomingEventsState } from '@states/upcoming_events';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

const useUpcomingEvents = () => {
  const { isAdmin } = useCurrentUser();
  const upcomingEvents = useRecoilValue(upcomingEventsState);

  const [addEventBoxShow, setAddEventBoxShow] = useState(false);

  const handleShowAddEventBox = () => {
    setAddEventBoxShow(true);
  };

  const handleHideAddEventBox = () => {
    setAddEventBoxShow(false);
  };

  const handleAddEventButtonClick = () => {
    handleShowAddEventBox();
  };

  return {
    isAdmin,
    addEventBoxShow,
    upcomingEvents,
    handleHideAddEventBox,
    handleAddEventButtonClick,
  };
};

export default useUpcomingEvents;
