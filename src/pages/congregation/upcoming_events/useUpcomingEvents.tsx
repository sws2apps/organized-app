import { DateUpcomingEventType } from '@definition/upcoming_events';
import useCurrentUser from '@hooks/useCurrentUser';
import { upcomingEventsYearsState } from '@states/upcoming_events';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

const useUpcomingEvents = () => {
  const { isAdmin } = useCurrentUser();
  const upcomingEventsData = useRecoilValue(upcomingEventsYearsState);

  const [addEventBoxShow, setAddEventBoxShow] = useState(false);

  const emptyDateWihoutUpcomingEvents: DateUpcomingEventType = {
    date: '',
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

  return {
    isAdmin,
    addEventBoxShow,
    upcomingEventsData,
    handleHideAddEventBox,
    handleAddEventButtonClick,
  };
};

export default useUpcomingEvents;
