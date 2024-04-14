import { useState } from 'react';
import { dbAppSettingsTimeAwayUpdate } from '@services/dexie/settings';
import { TimeAwayType } from '@definition/person';

const useTimeAwayItem = (timeAway: TimeAwayType) => {
  const [startDate, setStartDate] = useState(timeAway.startDate);
  const [endDate, setEndDate] = useState(timeAway.endDate);
  const [comments, setComments] = useState(timeAway.comments);

  const handleUpdateStartDate = async (value) => {
    setStartDate(value);

    const obj = structuredClone(timeAway);
    obj.startDate = { value: new Date(value).toISOString(), updatedAt: new Date().toISOString() };

    await dbAppSettingsTimeAwayUpdate(obj);
  };

  const handleUpdateEndDate = async (value) => {
    setEndDate(value);

    const obj = structuredClone(timeAway);
    obj.endDate = { value: new Date(value).toISOString(), updatedAt: new Date().toISOString() };

    await dbAppSettingsTimeAwayUpdate(obj);
  };

  const handleUpdateComments = async (value) => {
    setComments(value);

    const obj = structuredClone(timeAway);
    obj.comments = { value, updatedAt: new Date().toISOString() };

    await dbAppSettingsTimeAwayUpdate(obj);
  };

  return { startDate, endDate, comments, handleUpdateStartDate, handleUpdateEndDate, handleUpdateComments };
};

export default useTimeAwayItem;
