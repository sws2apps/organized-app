import { Box, Divider, Stack } from '@mui/material';
import {
  IconAccount,
  IconCheck,
  IconNotifications,
  IconPrepareReport,
  IconTalk,
} from '@components/icons';
import {
  JoinRequestNotificationType,
  NotificationRecordType,
  SpeakerNotificationType,
  UnverifiedReportNotificationType,
} from '@definition/notification';
import { useAppTranslation } from '@hooks/index';
import useNotificationItem from './useNotificationItem';
import Button from '@components/button';
import JoinRequest from '@features/congregation/app_access/join_requests/item';
import SpeakerAccessRequest from '../speakers_access_request';
import TextMarkup from '@components/text_markup';
import Typography from '@components/typography';
import TabLabelWithBadge from '@components/tab_label_with_badge';
import FeatureFlag from '@components/feature_flag';

const NotificationItem = ({
  notification,
}: {
  notification: NotificationRecordType;
}) => {
  const { t } = useAppTranslation();

  const { itemDate, handleMarkAsRead, handleAnchorClick } =
    useNotificationItem(notification);

  return (
    <Box>
      <Stack mb={2.3} spacing={1}>
        <Stack direction="row" spacing={1}>
          {notification.icon === 'talk' && <IconTalk color="var(--black)" />}

          {notification.icon === 'standard' && (
            <IconNotifications color="var(--black)" />
          )}

          {notification.icon === 'reports' && (
            <IconPrepareReport color="var(--black)" />
          )}

          {notification.icon === 'join-requests' && (
            <IconAccount color="var(--black)" />
          )}

          {notification.id !== 'reports-unverified' && (
            <Typography className="h3">{notification.title}</Typography>
          )}

          {notification.id === 'reports-unverified' && (
            <TabLabelWithBadge
              className="h3"
              label={notification.title}
              badgeColor="var(--accent-main)"
              count={(notification as UnverifiedReportNotificationType).count}
            />
          )}

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
          anchorClassName="h4"
          anchorClick={handleAnchorClick}
        />

        {notification.id === 'speakers-request' &&
          (notification as SpeakerNotificationType).congs.map((request) => (
            <SpeakerAccessRequest key={request.request_id} request={request} />
          ))}

        <FeatureFlag flag="REQUEST_ACCESS_CONGREGATION">
          {notification.id === 'join-requests' &&
            (notification as JoinRequestNotificationType).requests.map(
              (request) => <JoinRequest key={request.user} request={request} />
            )}
        </FeatureFlag>

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
