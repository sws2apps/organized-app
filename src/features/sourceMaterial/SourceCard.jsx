import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { currentWeekState } from '../../states/sourceMaterial';
import { getWeeksBySchedule } from '../../indexedDb/dbSchedule';
import {
  userConfirmationActionState,
  userConfirmationMessageState,
  userConfirmationOpenState,
  userConfirmationTitleState,
} from '../../states/main';

const SourceCard = ({ schedule }) => {
  const { t } = useTranslation('ui');

  const navigate = useNavigate();

  const setCurrentWeek = useSetRecoilState(currentWeekState);
  const setConfirmationTitle = useSetRecoilState(userConfirmationTitleState);
  const setConfirmationMessage = useSetRecoilState(userConfirmationMessageState);
  const setConfirmationAction = useSetRecoilState(userConfirmationActionState);
  const setConfirmationOpen = useSetRecoilState(userConfirmationOpenState);

  const [weeks, setWeeks] = useState([]);

  const getWeekBySchedule = useCallback(async () => {
    const data = await getWeeksBySchedule(schedule.value);
    setWeeks(data);
  }, [schedule]);

  const handleEditSource = (week) => {
    setCurrentWeek(week);
    navigate(`/source-materials/${week.value.replaceAll('/', '-')}`);
  };

  const handleWeekDelete = async (week) => {
    setConfirmationTitle(t('sourceMaterial'));
    setConfirmationMessage(t('weekDeleteConfirm'));
    setConfirmationAction(`weekDelete-${week.value}`);
    setConfirmationOpen(true);
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
        <CalendarMonthIcon color="primary" sx={{ fontSize: '40px' }} />
        <Typography variant="h6" sx={{ borderBottom: '1px solid', paddingRight: '60px', paddingBottom: '5px' }}>
          {schedule.label}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', marginLeft: '60px' }}>
        {weeks.map((week) => (
          <Box key={week.value} sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Typography>{week.label}</Typography>
            <IconButton sx={{ padding: 0 }} onClick={() => handleEditSource(week)}>
              <EditIcon color="success" />
            </IconButton>
            <IconButton sx={{ padding: 0 }} onClick={() => handleWeekDelete(week)}>
              <DeleteIcon color="error" />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default SourceCard;
