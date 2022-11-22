import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import dateFormat from 'dateformat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { monthNamesState, shortDateFormatState } from '../states/main';
import { dbGetWeekListBySched } from '../indexedDb/dbSourceMaterial';
import { WeekSummaryItem } from '../features/schedules';

const ScheduleDetails = () => {
  const { schedule } = useParams();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const monthNames = useRecoilValue(monthNamesState);
  const shortDateFormat = useRecoilValue(shortDateFormatState);

  const [weeks, setWeeks] = useState([]);

  const scheduleFormatted = schedule.replace('-', '/');
  const monthIndex = parseInt(scheduleFormatted.split('/')[0], 10);
  const scheduleName = `${monthNames[monthIndex - 1]} ${scheduleFormatted.split('/')[1]}`;

  const getWeekBySchedule = useCallback(async () => {
    let data = await dbGetWeekListBySched(scheduleFormatted);
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
  }, [scheduleFormatted, shortDateFormat]);

  const handleNavigateSchedule = () => {
    navigate('/schedules');
  };

  useEffect(() => {
    getWeekBySchedule();
  }, [getWeekBySchedule]);

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
        <IconButton onClick={handleNavigateSchedule}>
          <ArrowBackIcon sx={{ fontSize: '30px' }} />
        </IconButton>
        <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
          {`${t('dashboard.schedule')} > ${scheduleName}`}
        </Typography>
      </Box>

      <Typography variant="h4">{t('schedule.weeksList')}</Typography>

      <Box sx={{ display: 'flex', gap: '20px', flexDirection: 'column', marginTop: '25px' }}>
        {weeks.map((week) => (
          <WeekSummaryItem key={week.value} week={week} schedule={schedule} />
        ))}
      </Box>
    </Box>
  );
};

export default ScheduleDetails;
