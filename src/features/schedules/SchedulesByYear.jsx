import { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import { dbGetScheduleListByYear } from '../../indexedDb/dbSourceMaterial';
import { ScheduleCard } from './';
import { monthNamesState } from '../../states/main';

const SchedulesByYear = ({ year }) => {
  const monthNames = useRecoilValue(monthNamesState);

  const [schedules, setSchedules] = useState([]);

  const getMonthlySchedules = useCallback(async () => {
    const data = await dbGetScheduleListByYear(year);
    let newData = [];
    for (let i = 0; i < data.length; i++) {
      let obj = {};
      obj.value = data[i].value;
      const monthIndex = parseInt(data[i].value.split('/')[0], 10);
      obj.label = `${monthNames[monthIndex - 1]} ${year}`;
      newData.push(obj);
    }
    setSchedules(newData);
  }, [monthNames, year]);

  useEffect(() => {
    getMonthlySchedules();
  }, [getMonthlySchedules]);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '15px', padding: '0 20px 20px 20px' }}>
      {schedules.map((schedule) => (
        <ScheduleCard key={schedule.value} schedule={schedule} />
      ))}
    </Box>
  );
};

export default SchedulesByYear;
