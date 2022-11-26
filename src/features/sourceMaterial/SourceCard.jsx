import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import dateFormat from 'dateformat';
import Box from '@mui/material/Box';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { dbGetWeekListBySched } from '../../indexedDb/dbSourceMaterial';
import { shortDateFormatState } from '../../states/main';
import { currentWeekState } from '../../states/sourceMaterial';

const SourceCard = ({ schedule }) => {
  const navigate = useNavigate();

  const setCurrentWeek = useSetRecoilState(currentWeekState);

  const shortDateFormat = useRecoilValue(shortDateFormatState);

  const [weeks, setWeeks] = useState([]);

  const getWeekBySchedule = useCallback(async () => {
    let data = await dbGetWeekListBySched(schedule.value);
    let newData = [];
    for (let i = 0; i < data.length; i++) {
      const weekDate = data[i].weekOf;
      const day = weekDate.split('/')[1];
      const month = weekDate.split('/')[0];
      const year = weekDate.split('/')[2];
      const newDate = new Date(year, +month - 1, day);
      const dateFormatted = dateFormat(newDate, shortDateFormat);
      let obj = {};
      obj.value = data[i].value;
      obj.label = dateFormatted;
      newData.push(obj);
    }

    setWeeks(newData);
  }, [schedule, shortDateFormat]);

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
