import { Box, Divider, Stack } from '@mui/material';
import { IconCheck } from '@components/icons';
import { NotificationRecordType } from '@definition/notification';
import { useAppTranslation } from '@hooks/index';
import useNotificationItem from './useNotificationItem';
import Button from '@components/button';
import TextMarkup from '@components/text_markup';
import Typography from '@components/typography';
import SpeakerAccessRequest from '../speakers_access_request';

const NotificationItem = ({
  notification,
}: {
  notification: NotificationRecordType;
}) => {
  const { t } = useAppTranslation();

  const { itemDate, handleMarkAsRead } = useNotificationItem(notification);

  return (
    <Box>
      <Stack mb={2.3} spacing={1}>
        <Stack direction="row" spacing={1}>
          {notification.icon}
          <Typography className="h3">{notification.title}</Typography>
          {!notification.read && (
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
          )}
        </Stack>

        <TextMarkup
          content={notification.description}
          className="body-regular"
          color="var(--grey-400)"
          tagClassNames={{ strong: 'h4' }}
        />

        {notification.type === 'speakers-request' &&
          notification.options &&
          notification.options.map((request) => (
            <SpeakerAccessRequest key={request.request_id} request={request} />
          ))}

        <Stack
          direction="row"
          justifyContent={
            notification.enableRead && !notification.read
              ? 'space-between'
              : 'flex-end'
          }
          alignItems={'center'}
        >
          {notification.enableRead && !notification.read && (
            <Button
              disableAutoStretch={true}
              startIcon={<IconCheck />}
              variant={'secondary'}
              onClick={handleMarkAsRead}
            >
              {t('tr_markAsRead')}
            </Button>
          )}
          <Typography
            color={'var(--grey-350)'}
            className={'body-small-regular'}
          >
            {itemDate}
          </Typography>
        </Stack>
      </Stack>

      <Divider sx={{ backgroundColor: 'var(--accent-200)' }} />
    </Box>
  );
};

export default NotificationItem;
