import { useRecoilValue, useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Typography from '@mui/material/Typography';
import { dbReadNotification } from '../../indexedDb/dbNotifications';
import { appLangState, currentNotificationState, isWhatsNewOpenState } from '../../states/main';
import { themeOptionsState } from '../../states/theme';

const WhatsNewItem = ({ announcement, handlePopoverClose }) => {
  const setWhatsNewOpen = useSetRecoilState(isWhatsNewOpenState);
  const setCurrent = useSetRecoilState(currentNotificationState);

  const appLang = useRecoilValue(appLangState);
  const theme = useRecoilValue(themeOptionsState);

  const handleView = async () => {
    handlePopoverClose();
    setCurrent(announcement);
    await dbReadNotification(announcement.notification_id);
    setWhatsNewOpen(true);
  };

  return (
    <Box
      sx={{
        padding: '5px',
        borderRadius: '8px',
        boxShadow: '0 3px 5px 2px rgba(23, 32, 42, .3)',
        backgroundColor: theme.whatsNewBgSecondary,
        marginBottom: '10px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <NotificationsActiveIcon color="success" sx={{ fontSize: '30px', marginRight: '10px' }} />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Box>
            <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
              {announcement.content[appLang.toUpperCase()].title}
            </Typography>
            <Typography sx={{ fontSize: '12px' }}>{announcement.content[appLang.toUpperCase()].desc}</Typography>
          </Box>
          <IconButton onClick={handleView}>
            <OpenInNewIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default WhatsNewItem;
