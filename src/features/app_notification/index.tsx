import { IconNotifications } from '@icons/index';
import { Badge, SxProps, Theme } from '@mui/material';
import useAppNotification from './useAppNotification';
import ButtonIcon from '@components/icon_button';
import NotificationContainer from './container';

const AppNotification = ({ sx }: { sx?: SxProps<Theme> }) => {
  const {
    handleCloseNotification,
    handleToggleNotificationState,
    open,
    count,
  } = useAppNotification();

  return (
    <>
      <ButtonIcon onClick={handleToggleNotificationState} sx={sx}>
        <Badge
          badgeContent={count}
          slotProps={{
            badge: {
              style: {
                backgroundColor: 'var(--accent-main)',
                color: 'white',
                textAlign: 'center',
                top: '4px',
                right: '4px',
              },
              className: 'label-small-medium',
            },
          }}
        >
          <IconNotifications color="var(--black)" />
        </Badge>
      </ButtonIcon>

      <NotificationContainer onClose={handleCloseNotification} open={open} />
    </>
  );
};

export default AppNotification;
