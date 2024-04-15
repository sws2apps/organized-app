import { useNavigate } from 'react-router';
import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import Typography from '@mui/material/Typography';
import { isWhatsNewOpenState } from '../../states/main';

const FieldServiceReport = () => {
  const { t } = useTranslation('ui');

  const navigate = useNavigate();

  const setDrawerOpen = useSetRecoilState(isWhatsNewOpenState);

  const openPending = () => {
    setDrawerOpen(false);
    navigate('/pending-field-service-reports');
  };

  return (
    <Box sx={{ display: 'flex', gap: '8px' }}>
      <FactCheckIcon color="success" />
      <Box>
        <Typography>{t('pendingFieldServiceReportsNew')}</Typography>
        <Button sx={{ marginTop: '8px' }} variant="outlined" color="success" onClick={openPending}>
          {t('review')}
        </Button>
      </Box>
    </Box>
  );
};

export default FieldServiceReport;
