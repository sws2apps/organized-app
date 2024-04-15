import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { S89Selector } from '../features/schedules';
import { currentScheduleState } from '../states/schedule';

const S89 = () => {
  const { t } = useTranslation('ui');
  const navigate = useNavigate();

  const currentSchedule = useRecoilValue(currentScheduleState);

  useEffect(() => {
    if (currentSchedule === '' || currentSchedule.value?.length === '') {
      navigate('/schedules');
    }
  }, [navigate, currentSchedule]);

  return (
    <Box>
      <Box sx={{ marginBottom: '20px' }}>
        <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{t('s89')}</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <S89Selector />
      </Box>
    </Box>
  );
};

export default S89;
