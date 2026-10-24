import { useMemo } from 'react';
import { Box, Link } from '@mui/material';
import { useAtomValue } from 'jotai';
import {
  IconAddMonth,
  IconContactUs,
  IconEdit,
  IconPerson,
} from '@components/icons';
import DetailRow from '@components/detail_row';
import IconButton from '@components/icon_button';
import GroupTitle from '@components/group_title';
import Tooltip from '@components/tooltip';
import Typography from '@components/typography';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import {
  FIELD_SERVICE_MEETING_CATEGORY_TRANSLATION_KEYS,
  FIELD_SERVICE_MEETING_LOCATION_TRANSLATION_KEYS,
  FieldServiceMeetingCategory,
} from '@definition/field_service_meetings';
import { fieldServiceMeetingCalendarExport } from '@services/app/field_service_meeting_calendar';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import { MeetingItemProps } from '@features/congregation/field_service_meetings/meeting_item/index.types';
import { getLocationIcon } from '@features/congregation/field_service_meetings/location_icons';
import { resolveGroupBadgeColor } from '@features/congregation/field_service_meetings/group_badge_color';

const MeetingItem = ({ meeting, canEdit, onEdit }: MeetingItemProps) => {
  const { t } = useAppTranslation();
  const { tabletUp } = useBreakpoints();
  const groups = useAtomValue(fieldWithLanguageGroupsState);
  const locationIcon = getLocationIcon(meeting.location, 'var(--grey-400)');
  const isWebAddress = /^https?:\/\//i.test(meeting.address ?? '');
  const categoryLabel = t(
    FIELD_SERVICE_MEETING_CATEGORY_TRANSLATION_KEYS[meeting.category]
  );
  const groupBadgeColor = useMemo(
    () => resolveGroupBadgeColor(groups, meeting.group_id),
    [groups, meeting.group_id]
  );

  return (
    <Box
      component="article"
      className="meeting-item"
      aria-label={[meeting.groupName, categoryLabel]
        .filter(Boolean)
        .join(' · ')}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '8px',
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'center',
            flex: 1,
            minWidth: 0,
            gap: '4px',
          }}
        >
          <GroupTitle
            label={meeting.groupName || categoryLabel}
            color={groupBadgeColor}
          />
          {meeting.groupName &&
            meeting.category !== FieldServiceMeetingCategory.RegularMeeting && (
              <Typography
                className="body-small-regular"
                color="var(--grey-400)"
              >
                {categoryLabel}
              </Typography>
            )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0,
          }}
        >
          {canEdit && (
            <Tooltip title={t('tr_edit')}>
              <IconButton
                className="edit-button"
                aria-label={t('tr_edit')}
                edge={false}
                onClick={onEdit}
              >
                <IconEdit color="var(--accent-main)" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={t('tr_addToCalendar')}>
            <IconButton
              className="add-to-calendar"
              aria-label={t('tr_addToCalendar')}
              edge={false}
              onClick={() => fieldServiceMeetingCalendarExport(meeting, t)}
            >
              <IconAddMonth color="var(--accent-main)" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          minWidth: 0,
        }}
      >
        <DetailRow
          label={t('tr_conductor')}
          icon={<IconPerson color="var(--grey-400)" />}
        >
          {meeting.conductor}
        </DetailRow>
        <DetailRow
          label={t('tr_location')}
          icon={locationIcon}
          className={tabletUp ? 'body-regular' : 'body-small-regular'}
          color="var(--grey-400)"
        >
          {isWebAddress ? (
            <Link
              href={meeting.address}
              target="_blank"
              rel="noopener noreferrer"
              title={meeting.address}
              sx={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
                overflowWrap: 'anywhere',
                textOverflow: 'ellipsis',
                color: 'var(--accent-main)',
                textDecorationColor: 'var(--accent-main)',
                '&:hover': { color: 'var(--accent-dark)' },
              }}
            >
              {meeting.address}
            </Link>
          ) : (
            meeting.address ||
            t(FIELD_SERVICE_MEETING_LOCATION_TRANSLATION_KEYS[meeting.location])
          )}
        </DetailRow>
        {meeting.additionalInfo && (
          <DetailRow
            label={t('tr_comments')}
            icon={<IconContactUs color="var(--grey-400)" />}
            className="body-small-regular"
            color="var(--grey-400)"
            preserveWhitespace
          >
            {meeting.additionalInfo}
          </DetailRow>
        )}
      </Box>
    </Box>
  );
};

export default MeetingItem;
