import { useState } from 'react';
import { TimeAwayType } from '@definition/app';
import { handleUserTimeAwayUpdate } from '@services/dexie/settings';

const useTimeAwayItem = (timeAway: TimeAwayType) => {
  const [startDate, setStartDate] = useState(timeAway.startDate);
  const [endDate, setEndDate] = useState(timeAway.endDate);
  const [comments, setComments] = useState(timeAway.comments);

  const handleUpdateStartDate = async (value) => {
    setStartDate(value);

    const obj = structuredClone(timeAway);
    obj.startDate = new Date(value).toISOString();

    await handleUserTimeAwayUpdate(obj);
  };

  const handleUpdateEndDate = async (value) => {
    setEndDate(value);

    const obj = structuredClone(timeAway);
    obj.endDate = new Date(value).toISOString();

    await handleUserTimeAwayUpdate(obj);
  };

  const handleUpdateComments = async (value) => {
    setComments(value);

    const obj = structuredClone(timeAway);
    obj.comments = value;

    await handleUserTimeAwayUpdate(obj);
  };

  return { startDate, endDate, comments, handleUpdateStartDate, handleUpdateEndDate, handleUpdateComments };
};

export default useTimeAwayItem;
