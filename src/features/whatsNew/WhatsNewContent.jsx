import { useRecoilState, useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import { countNotificationsState, isWhatsNewOpenState } from '../../states/main';
import { pendingFieldServiceReportsCountState } from '../../states/report';
import Announcements from './Announcements';
import FieldServiceReport from './FieldServiceReport';

const WhatsNewContent = () => {
  const { t } = useTranslation('ui');

  const [drawerOpen, setDrawerOpen] = useRecoilState(isWhatsNewOpenState);

  const cnNews = useRecoilValue(countNotificationsState);
  const cnPendingReports = useRecoilValue(pendingFieldServiceReportsCountState);

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawerOpen(open);
  };

  return (
    <SwipeableDrawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
      <Box
        sx={{
          paddingTop: '50px',
          borderBottom: '1px outset',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography sx={{ padding: '20px', textTransform: 'uppercase', fontWeight: 'bold' }}>
          {t('announcements')}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '20px' }}>
          <IconButton color="error" aria-label="close" onClick={() => setDrawerOpen(false)}>
            <CloseIcon sx={{ fontSize: '30px' }} />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ minWidth: '350px', maxWidth: '650px', padding: '20px' }}>
        {cnNews + cnPendingReports === 0 && <Typography>{t('nothingNew')}</Typography>}
        <Announcements />
        {cnPendingReports > 0 && <FieldServiceReport />}
      </Box>
    </SwipeableDrawer>
  );
};

export default WhatsNewContent;
