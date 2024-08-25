import { useState } from 'react';
import { MeetingType } from '@definition/app';

const useMonthItem = () => {
  const [expanded, setExpanded] = useState(false);

  const meetings: MeetingType[] = ['midweek', 'weekend'];

  const handleToggleExpanded = () => setExpanded((prev) => !prev);

  return { expanded, handleToggleExpanded, meetings };
};

export default useMonthItem;
