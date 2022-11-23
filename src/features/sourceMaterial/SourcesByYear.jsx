import { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import { SourceCard } from './';
import { dbGetScheduleListByYear } from '../../indexedDb/dbSourceMaterial';
import { monthNamesState } from '../../states/main';

const SourcesByYear = ({ year }) => {
  const monthNames = useRecoilValue(monthNamesState);

  const [sources, setSources] = useState([]);

  const getMonthlySources = useCallback(async () => {
    const data = await dbGetScheduleListByYear(year);
    let newData = [];
    for (let i = 0; i < data.length; i++) {
      let obj = {};
      obj.value = data[i].value;
      const monthIndex = parseInt(data[i].value.split('/')[0], 10);
      obj.label = `${monthNames[monthIndex - 1]} ${year}`;
      newData.push(obj);
    }
    setSources(newData);
  }, [monthNames, year]);

  useEffect(() => {
    getMonthlySources();
  }, [getMonthlySources]);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '15px', padding: '0 5px 10px 5px' }}>
      {sources.map((schedule) => (
        <SourceCard key={schedule.value} schedule={schedule} />
      ))}
    </Box>
  );
};

export default SourcesByYear;
