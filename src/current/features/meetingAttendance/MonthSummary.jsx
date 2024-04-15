import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Setting } from '../../classes/Setting';
import MeetingSummary from './MeetingSummary';

const MonthSummary = ({ month, serviceYear }) => {
  const [monthName, setMonthName] = useState('');

  useEffect(() => {
    setMonthName(Setting.monthNames()[month]);
  }, [month]);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '15px',
        border: '1px solid',
        padding: '10px',
        flexWrap: 'wrap',
        borderRadius: '8px',
      }}
    >
      <Typography sx={{ width: '100px', fontWeight: 'bold' }}>{monthName}</Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '30px',
          flexWrap: 'wrap',
        }}
      >
        <MeetingSummary type="midweek" month={month} serviceYear={serviceYear} />
        <MeetingSummary type="weekend" month={month} serviceYear={serviceYear} />
      </Box>
    </Box>
  );
};

export default MonthSummary;
