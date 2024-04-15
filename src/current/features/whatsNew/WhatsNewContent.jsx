import { useRecoilState, useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import Announcements from './Announcements';
import CongregationSpeakersRequests from './CongregationSpeakersRequests';
import CongregationSpeakersRequestApproved from './CongregationSpeakersRequestApproved';
import FieldServiceReport from './FieldServiceReport';
import { countNotificationsState, isWhatsNewOpenState } from '../../states/main';
import { pendingFieldServiceReportsCountState } from '../../states/report';
import { congSpeakersRequestsStateCountState, congSpeakersRequestsUpdateCountState } from '../../states/congregation';

const WhatsNewContent = () => {
  const { t } = useTranslation('ui');

  const [drawerOpen, setDrawerOpen] = useRecoilState(isWhatsNewOpenState);

  const cnNews = useRecoilValue(countNotificationsState);
  const cnPendingReports = useRecoilValue(pendingFieldServiceReportsCountState);
  const cnSpeakersRequests = useRecoilValue(congSpeakersRequestsStateCountState);
  const cnSpeakersRequestsApproved = useRecoilValue(congSpeakersRequestsUpdateCountState);

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
        {cnNews + cnPendingReports + cnSpeakersRequests + cnSpeakersRequestsApproved === 0 && (
          <Typography sx={{ marginBottom: '15px', borderBottom: '1px outset', paddingBottom: '15px' }}>
            {t('nothingNew')}
          </Typography>
        )}
        <Announcements />
        {cnPendingReports > 0 && <FieldServiceReport />}
        {cnSpeakersRequests > 0 && <CongregationSpeakersRequests />}
        {cnSpeakersRequestsApproved > 0 && <CongregationSpeakersRequestApproved />}
      </Box>
    </SwipeableDrawer>
  );
};

export default WhatsNewContent;
