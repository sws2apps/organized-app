import Drawer from '@components/drawer';
import { useAppTranslation } from '@hooks/index';
import { NotificationContainerType } from './index.types';

const NotificationContainer = ({ onClose, open }: NotificationContainerType) => {
  const { t } = useAppTranslation();

  return (
    <Drawer anchor={'right'} onClose={onClose} open={open} title={t('tr_notifications')}>
      {/* <Stack spacing={2.3}>
        {notifications.map((notification) => (
          <Box key={notification.id}>
            <Stack mb={2.3} spacing={1}>
              <Stack direction={'row'} spacing={1}>
                {NotificationsTypeIcons[notification.type]({
                  color: 'var(--black)',
                })}
                <Typography className={'h3'}>{notification.title}</Typography>
                {!notification.read ? (
                  <Box
                    sx={{
                      ':after': {
                        content: "''",
                        height: '8px',
                        width: 'inherit',

                        borderRadius: '100%',
                        backgroundColor: 'var(--accent-main)',
                      },
                      height: 'inherit',
                      width: '8px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  />
                ) : (
                  <></>
                )}
              </Stack>
              <Typography className={'body-regular'} color={'var(--grey-400)'}>
                {notification.text}
              </Typography>
              {notification.withForm && <RequestForm />}
              <Stack
                direction={'row'}
                justifyContent={notification.read ? 'flex-end' : 'space-between'}
                alignItems={'center'}
              >
                {!notification.read && (
                  <Button disableAutoStretch={true} startIcon={<IconCheck />} variant={'secondary'}>
                    {t('tr_MarkAsRead')}
                  </Button>
                )}
                <Typography color={'var(--grey-350)'} className={'body-small-regular'}>
                  {notification.dateTime}
                </Typography>
              </Stack>
            </Stack>
            <Divider sx={{ backgroundColor: 'var(--accent-200)' }} />
          </Box>
        ))}
      </Stack> */}
    </Drawer>
  );
};

export default NotificationContainer;
