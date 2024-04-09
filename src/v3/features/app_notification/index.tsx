import { IconNotifications, IconCheck, IconTalk, IconMap } from '@icons/index';
import { Badge, Box, Divider, Stack } from '@mui/material';
import ButtonIcon from '@components/icon_button';
import Button from '@components/button';
import Drawer from '@components/drawer';
import Typography from '@components/typography';
import useAppNotification from './useAppNotification';

const NotificationsTypeIcons = {
  request: (props) => <IconTalk {...props} />,
  reminder: (props) => <IconNotifications {...props} />,
  territory: (props) => <IconMap {...props} />,
};

const notifications = [
  {
    id: 1,
    type: 'request',
    title: 'Request for your speakers list',
    text: 'The following congregations requested access to view your outgoing speakers list:',
    dateTime: '12.11.2023 16:15',
    read: false,
  },
  {
    id: 2,
    type: 'reminder',
    title: 'Adjustments to Field Service Reporting',
    text: 'As you may already know, the way how publishers report their field service activities have been changed. Therefore, we are currently working to update Organized to support this latest adjustment. We appreciate your patience while this work is being done.',
    dateTime: '11.11.2023 02:52',
    read: false,
  },
  {
    id: 3,
    type: 'request',
    title: 'Your request accepted',
    text: 'The New-York-North (18226) congregation accepted your request to view their outgoing speakers list. Navigate to the Visiting Speakers page to sync the speakers list.',
    dateTime: '10.11.2023 11:05',
    read: false,
  },
  {
    id: 4,
    type: 'territory',
    title: 'Anna Netherleed returned the territory',
    text: 'Territory O25 has been covered and returned. The households number submitted by the publisher is 152. Please update the territory info if needed.',
    dateTime: '12.10.2023 22:16',
    read: true,
  },
  {
    id: 5,
    type: 'reminder',
    title: 'Some news about the app redesign',
    text: 'As you may already know, the way how publishers report their field service activities have been changed. Therefore, we are currently working to update Organized.',
    dateTime: '25.01.2023 09:05',
    read: true,
  },
];

const AppNotification = () => {
  const { handleCloseNotification, handleOpenNotification, open } = useAppNotification();

  return (
    <>
      <ButtonIcon onClick={handleOpenNotification}>
        <Badge
          badgeContent={2}
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
      <Drawer anchor={'right'} onClose={handleCloseNotification} open={open} title={'What’s new'}>
        <Stack spacing={2.3}>
          {notifications.map((notification) => (
            <Box key={notification.id}>
              <Stack mb={2.3} spacing={1}>
                <Stack direction={'row'} spacing={1}>
                  {NotificationsTypeIcons[notification.type]({
                    color: notification.read ? 'var(--black)' : 'var(--accent-dark)',
                  })}
                  <Typography className={'h3'} color={notification.read ? 'var(--black)' : 'var(--accent-dark)'}>
                    {notification.title}
                  </Typography>
                </Stack>
                <Typography className={'body-regular'} color={'var(--grey-400)'}>
                  {notification.text}
                </Typography>
                <Stack
                  direction={'row'}
                  justifyContent={notification.read ? 'flex-end' : 'space-between'}
                  alignItems={'center'}
                >
                  {!notification.read && (
                    <Button disableAutoStretch={true} startIcon={<IconCheck />} variant={'secondary'}>
                      Mark as read
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
        </Stack>
      </Drawer>
    </>
  );
};

export default AppNotification;
