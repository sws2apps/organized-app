import { IconNotifications } from '@icons/index';
import { Badge } from '@mui/material';
import useAppNotification from './useAppNotification';
import ButtonIcon from '@components/icon_button';
import NotificationContainer from './container';

const AppNotification = () => {
  const { handleCloseNotification, handleOpenNotification, open, count } =
    useAppNotification();

  return (
    <>
      <ButtonIcon
        onClick={handleOpenNotification}
        onDoubleClick={handleCloseNotification}
        backgroundColor={open ? 'var(--accent-200)' : 'none'}
      >
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
