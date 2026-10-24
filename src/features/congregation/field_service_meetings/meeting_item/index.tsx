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
import GroupBadge from '@components/group_badge';
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
  const hasAdditionalInfo = Boolean(meeting.additionalInfo?.trim());
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
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) max-content',
        gap: '8px',
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          display: 'contents',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gridColumn: 1,
            gridRow: 1,
            minWidth: 0,
            gap: '4px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              minWidth: 0,
            }}
          >
            <GroupBadge
              label={meeting.groupName || categoryLabel}
              color={groupBadgeColor}
              variant="outlined"
              size="small"
            />
            <Box sx={{ minWidth: 0, flex: '0 1 auto' }}>
              <DetailRow
                label={t('tr_conductor')}
                icon={<IconPerson color="var(--grey-400)" />}
                className="body-small-regular"
              >
                {meeting.conductor}
              </DetailRow>
            </Box>
          </Box>
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
            gridColumn: 2,
            gridRow: '1 / 3',
            alignSelf: 'start',
            '& button': {
              minWidth: 'var(--touch-target-size)',
              minHeight: 'var(--touch-target-size)',
            },
            '& button > svg': {
              width: 'var(--icon-size-small)',
              height: 'var(--icon-size-small)',
            },
          }}
        >
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
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          minWidth: 0,
          gridColumn: 1,
          gridRow: 2,
        }}
      >
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
        {hasAdditionalInfo && (
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
