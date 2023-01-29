import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { dbCountAssignmentsInfo } from '../../indexedDb/dbSchedule';
import {
  currentWeekSchedState,
  dlgAssDeleteOpenState,
  isDeleteSchedState,
  reloadWeekSummaryState,
} from '../../states/schedule';

const WeekSummaryItem = ({ week, schedule }) => {
  const { t } = useTranslation('ui');
  const navigate = useNavigate();

  const setDlgAssDeleteOpen = useSetRecoilState(dlgAssDeleteOpenState);
  const setIsDeleteSched = useSetRecoilState(isDeleteSchedState);
  const setCurrentWeek = useSetRecoilState(currentWeekSchedState);

  const reloadSummary = useRecoilValue(reloadWeekSummaryState);

  const [assInfo, setAssInfo] = useState({ total: 0, assigned: 0 });
  const [progress, setProgress] = useState(0);

  const getAssignmentsInfo = useCallback(async () => {
    const data = await dbCountAssignmentsInfo(week.value);
    const vPg = (data.assigned * 100) / data.total;
    setAssInfo(data);
    setProgress(vPg);
  }, [week]);

  const handleEditAssignment = () => {
    navigate(`/schedules/${schedule}/${week.value.replaceAll('/', '-')}`);
  };

  const handleDeleteWeek = () => {
    setCurrentWeek(week);
    setIsDeleteSched(false);
    setDlgAssDeleteOpen(true);
  };

  useEffect(() => {
    getAssignmentsInfo();
  }, [getAssignmentsInfo, reloadSummary]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '30px',
        borderBottom: '1px outset',
        paddingBottom: '20px',
        maxWidth: '1200px',
      }}
    >
      <Box>
        <Typography variant="caption">{t('week')}</Typography>
        <Typography variant="h6">{week.label}</Typography>
      </Box>
      <Box>
        <Typography variant="caption">{t('assignedParts')}</Typography>
        <Box sx={{ display: 'flex', gap: '3px', alignItems: 'center', justifyContent: 'space-between' }}>
          <LinearProgress color="success" variant="determinate" value={progress} sx={{ width: '90px' }} />
          <Typography sx={{ fontWeight: 'bold' }}>{`${assInfo.assigned}/${assInfo.total}`}</Typography>
        </Box>
      </Box>
      {assInfo.total > 0 && (
        <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button variant="outlined" startIcon={<EditIcon color="success" />} onClick={handleEditAssignment}>
            {t('edit')}
          </Button>
          <Button variant="outlined" startIcon={<DeleteIcon color="error" />} onClick={handleDeleteWeek}>
            {t('delete')}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default WeekSummaryItem;
