import { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import { ScheduleCard } from './';
import { monthNamesState } from '../../states/main';
import { refreshWeeksListState } from '../../states/sourceMaterial';
import { Sources } from '../../classes/Sources';

const SchedulesByYear = ({ year }) => {
  const monthNames = useRecoilValue(monthNamesState);
  const refreshWeekList = useRecoilValue(refreshWeeksListState);

  const [schedules, setSchedules] = useState([]);

  const getMonthlySchedules = useCallback(() => {
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
    setSchedules(newData);
  }, [monthNames, year]);

  useEffect(() => {
    getMonthlySchedules();
  }, [getMonthlySchedules, refreshWeekList]);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '15px', padding: '5px' }}>
      {schedules.map((schedule) => (
        <ScheduleCard key={schedule.value} schedule={schedule} />
      ))}
    </Box>
  );
};

export default SchedulesByYear;
