import { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import { SourceCard } from './';
import { monthNamesState } from '../../states/main';
import { refreshWeeksListState } from '../../states/sourceMaterial';
import { Sources } from '../../classes/Sources';

const SourcesByYear = ({ year }) => {
  const monthNames = useRecoilValue(monthNamesState);
  const refreshWeekList = useRecoilValue(refreshWeeksListState);

  const [sources, setSources] = useState([]);

  const getMonthlySources = useCallback(() => {
    const userSort = localStorage.getItem('monthSort');

    const data = Sources.scheduleListByYear(year, userSort);
    let newData = [];
    for (const item of data) {
      const obj = {};
      obj.value = item.value;
      const monthIndex = parseInt(item.value.split('/')[0], 10);
      obj.label = `${monthNames[monthIndex - 1]} ${year}`;
      newData.push(obj);
    }
    setSources(newData);
  }, [monthNames, year]);

  useEffect(() => {
    getMonthlySources();
  }, [getMonthlySources, refreshWeekList]);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '15px', padding: '0 5px 10px 5px' }}>
      {sources.map((schedule) => (
        <SourceCard key={schedule.value} schedule={schedule} />
      ))}
    </Box>
  );
};

export default SourcesByYear;
