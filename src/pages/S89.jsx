import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { S89Selector, S89Template } from '../features/schedules';
import { currentScheduleState, s89DataState } from '../states/schedule';

const S89 = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const currentSchedule = useRecoilValue(currentScheduleState);
  const s89Data = useRecoilValue(s89DataState);

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (currentSchedule === '' || currentSchedule.value?.length === '') {
      navigate('/schedules');
    }
  }, [navigate, currentSchedule]);

  return (
    <Box>
      <Box sx={{ marginBottom: '20px' }}>
        <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{t('schedule.s89')}</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <S89Selector setIsGenerating={(value) => setIsGenerating(value)} />

        <Box sx={{ maxWidth: '500px', overflow: 'auto' }}>
          {isGenerating && (
            <Box sx={{ width: '280px' }}>
              <CircularProgress
                color="secondary"
                size={60}
                disableShrink={true}
                sx={{
                  display: 'flex',
                  margin: '60px auto',
                }}
              />
            </Box>
          )}
          {!isGenerating && s89Data.length > 0 && <S89Template />}
        </Box>
      </Box>
    </Box>
  );
};

export default S89;
