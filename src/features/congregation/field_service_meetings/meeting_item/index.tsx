import { Box, Link } from '@mui/material';
import { IconAddMonth, IconEdit } from '@components/icons';
import Button from '@components/button';
import IconButton from '@components/icon_button';
import GroupBadge from '@components/group_badge';
import Badge from '@components/badge';
import Typography from '@components/typography';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import {
  FieldServiceMeetingFormattedType,
  FIELD_SERVICE_MEETING_CATEGORY_TRANSLATION_KEYS,
  FieldServiceMeetingCategory,
} from '@definition/field_service_meetings';
import { getLocationIcon } from '../locationIcons';

type MeetingItemProps = {
  meeting: FieldServiceMeetingFormattedType;
  canEdit?: boolean;
  onEdit?: () => void;
};

/**
 * Individual field service meeting item display component
 * Shows meeting details with edit capabilities
 */
const MeetingItem = ({ meeting, canEdit, onEdit }: MeetingItemProps) => {
  const { t } = useAppTranslation();
  const { desktopUp } = useBreakpoints();

  const locationIcon = getLocationIcon(meeting.location, 'var(--grey-400)');

  return (
    <Box
      className="meeting-item"
      key={meeting.uid}
      sx={{
        '&:hover .add-to-calendar, &:hover .edit-button': {
          '@media (hover: hover) and (pointer: fine)': {
            opacity: 1,
          },
        },
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
        border: '1px solid var(--accent-300)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        backgroundColor: 'var(--white)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box display="flex" alignItems="center">
          <Typography className="h3">
            {t(
              FIELD_SERVICE_MEETING_CATEGORY_TRANSLATION_KEYS[meeting.category]
            )}
          </Typography>
          {canEdit && (
            <Box className="edit-button" sx={{ opacity: desktopUp ? 0 : 1 }}>
              <IconButton sx={{ marginLeft: '8px' }} onClick={onEdit}>
                <IconEdit color="var(--accent-main)" />
              </IconButton>
            </Box>
          )}
        </Box>
        <Box display="flex" alignItems="center" gap="8px">
          {meeting.groupName && (
            <GroupBadge
              label={meeting.groupName}
              color="group-3"
              variant="outlined"
            />
          )}
          {meeting.category === FieldServiceMeetingCategory.JointMeeting && (
            <GroupBadge
              label={t('tr_fieldServiceMeetingCategory_joint')}
              color="group-3"
              variant="outlined"
            />
          )}
          {meeting.category ===
            FieldServiceMeetingCategory.ServiceOverseerMeeting && (
            <Badge
              text={t('tr_fieldServiceMeetingCategory_serviceOverseer')}
              size="big"
              color="accent"
            />
          )}
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <Box
          sx={{
            backgroundColor: 'var(--accent-150)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-l)',
            display: 'flex',
            alignItems: 'center',
            alignSelf: 'stretch',
            justifyContent: 'center',
            flex: 0,
          }}
        >
          <Typography className="h4" color="var(--accent-dark)">
            {meeting.time}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            gap: '4px',
          }}
        >
          <Typography className="h4">{meeting.conductor}</Typography>
          <Typography className="body-regular" color="var(--grey-400)">
            <Box component="span" display="flex" alignItems="center" gap="4px">
              {locationIcon}
              {meeting.address?.startsWith('http') ? (
                <Link
                  href={meeting.address}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {meeting.address}
                </Link>
              ) : (
                meeting.address
              )}
            </Box>
          </Typography>
          {meeting.additionalInfo && (
            <Typography className="body-small-regular" color="var(--grey-400)">
              {meeting.additionalInfo}
            </Typography>
          )}
        </Box>
        <Box
          className="add-to-calendar"
          sx={{
            display: 'flex',
            flex: 0,
            alignItems: 'center',
            opacity: desktopUp ? 0 : 1,
          }}
        >
          <Button variant="small" startIcon={<IconAddMonth />}>
            <Typography
              className="body-small-regular"
              color="var(--blue-500)"
              noWrap
            >
              {t('tr_addToCalendar')}
            </Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MeetingItem;
