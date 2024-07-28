import { useState } from 'react';
import { dbAppSettingsTimeAwayUpdate } from '@services/dexie/settings';
import { TimeAwayType } from '@definition/person';

const useTimeAwayItem = (timeAway: TimeAwayType) => {
  const [start_date, setStartDate] = useState(timeAway.start_date);
  const [end_date, setEndDate] = useState(timeAway.end_date);
  const [comments, setComments] = useState(timeAway.comments);

  const handleUpdateStartDate = async (value) => {
    setStartDate(value);

    const obj = structuredClone(timeAway);
    obj.start_date = {
      value: new Date(value).toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await dbAppSettingsTimeAwayUpdate(obj);
  };

  const handleUpdateEndDate = async (value) => {
    setEndDate(value);

    const obj = structuredClone(timeAway);
    obj.end_date = {
      value: new Date(value).toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await dbAppSettingsTimeAwayUpdate(obj);
  };

  const handleUpdateComments = async (value) => {
    setComments(value);

    const obj = structuredClone(timeAway);
    obj.comments = { value, updatedAt: new Date().toISOString() };

    await dbAppSettingsTimeAwayUpdate(obj);
  };

  return {
    start_date,
    end_date,
    comments,
    handleUpdateStartDate,
    handleUpdateEndDate,
    handleUpdateComments,
  };
};

export default useTimeAwayItem;
