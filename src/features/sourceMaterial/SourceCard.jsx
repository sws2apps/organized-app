import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { currentWeekState } from '../../states/sourceMaterial';
import { getWeeksBySchedule } from '../../indexedDb/dbSchedule';

const SourceCard = ({ schedule }) => {
  const navigate = useNavigate();

  const setCurrentWeek = useSetRecoilState(currentWeekState);

  const [weeks, setWeeks] = useState([]);

  const getWeekBySchedule = useCallback(async () => {
    const data = await getWeeksBySchedule(schedule.value);
    setWeeks(data);
  }, [schedule]);

  const handleEditSource = (week) => {
    setCurrentWeek(week);
    navigate(`/source-materials/${week.value.replaceAll('/', '-')}`);
  };

  useEffect(() => {
    getWeekBySchedule();
  }, [getWeekBySchedule]);

  return (
    <Paper
      elevation={3}
      sx={{
        padding: '10px',
        height: '280px',
        width: '280px',
        boxSizing: 'content-box',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
        <CalendarMonthIcon color="primary" sx={{ fontSize: '60px' }} />
        <Typography variant="h6" sx={{ borderBottom: '1px solid', paddingRight: '40px', paddingBottom: '5px' }}>
          {schedule.label}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', marginLeft: '80px' }}>
        {weeks.map((week) => (
          <Box key={week.value} sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Typography>{week.label}</Typography>
            <IconButton sx={{ padding: 0 }} onClick={() => handleEditSource(week)}>
              <EditIcon color="success" />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default SourceCard;
