import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { assignmentsHistoryState } from '@states/schedules';

const useAssignmentsHistory = () => {
  const { id } = useParams();

  const history = useRecoilValue(assignmentsHistoryState);

  const [expanded, setExpanded] = useState(true);

  const assignmentsHistory = history.filter(
    (record) => record.assignment.person === id
  );

  const handleToggleExpand = () => setExpanded((prev) => !prev);

  return { expanded, handleToggleExpand, assignmentsHistory };
};

export default useAssignmentsHistory;
