import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import WhatsNewItem from './WhatsNewItem';
import { appNotificationsState } from '../../states/main';
import { themeOptionsState } from '../../states/theme';

const WhatsNewContent = ({ id, open, anchorEl, handleClose }) => {
  const { t } = useTranslation('ui');

  const notifications = useRecoilValue(appNotificationsState);
  const theme = useRecoilValue(themeOptionsState);

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      sx={{ marginTop: '10px' }}
    >
      <Box
        sx={{
          backgroundColor: theme.whatsNewBg,
          maxWidth: '400px',
          padding: '10px',
        }}
      >
        {notifications.length > 0 && (
          <>
            {notifications.map((notification) => (
              <WhatsNewItem key={notification.id} announcement={notification} handlePopoverClose={handleClose} />
            ))}
          </>
        )}
        {notifications.length === 0 && <Typography sx={{ fontSize: '14px' }}>{t('nothingNew')}</Typography>}
      </Box>
    </Popover>
  );
};

export default WhatsNewContent;
