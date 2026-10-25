import { useMemo } from 'react';
import { Box, Link } from '@mui/material';
import { useAtomValue } from 'jotai';
import {
  IconAddMonth,
  IconEdit,
  IconInfo,
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
  const { tablet600Up } = useBreakpoints();
  const groups = useAtomValue(fieldWithLanguageGroupsState);
  const hasAdditionalInfo = Boolean(meeting.additionalInfo?.trim());
  const isWebAddress = /^https?:\/\//i.test(meeting.address ?? '');
  const categoryLabel = t(
    FIELD_SERVICE_MEETING_CATEGORY_TRANSLATION_KEYS[meeting.category]
  );
  const isOverseerVisit =
    meeting.category === FieldServiceMeetingCategory.ServiceOverseerMeeting;
  const groupLabel =
    meeting.groupName ||
    (meeting.group_id
      ? t('tr_group')
      : isOverseerVisit
        ? t('tr_allGroups')
        : categoryLabel);
  const groupColor = useMemo(
    () => resolveGroupBadgeColor(groups, meeting.group_id),
    [groups, meeting.group_id]
  );

  return (
    <Box
      component="article"
      className="meeting-item"
      aria-label={[...new Set([groupLabel, categoryLabel])].join(' · ')}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        minWidth: 0,
        paddingInlineStart:
          'calc(var(--agenda-group-rail-width) + var(--agenda-group-rail-gap))',
        '&::before': {
          content: '""',
          position: 'absolute',
          insetBlock: 0,
          insetInlineStart: 0,
          width: 'var(--agenda-group-rail-width)',
          borderRadius: 'var(--radius-max)',
          backgroundColor: `var(--${groupColor})`,
        },
      }}
    >
      <Box
        className="meeting-heading"
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          minWidth: 0,
          minHeight: 'var(--agenda-entry-header-height)',
          '@media (pointer: coarse)': {
            minHeight: 'var(--touch-target-size)',
          },
        }}
      >
        <Box
          className="meeting-identity"
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            alignContent: 'center',
            alignSelf: 'stretch',
            gap: '4px 8px',
          }}
        >
          <Typography
            component="h4"
            className="body-small-semibold"
            sx={{ minWidth: 0, overflowWrap: 'anywhere' }}
          >
            {groupLabel}
          </Typography>
          {isOverseerVisit && (
            <GroupBadge label={categoryLabel} variant="outlined" size="small" />
          )}
        </Box>
        {canEdit && (
          <Box
            className="meeting-actions day-agenda-actions"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              flexShrink: 0,
              marginInlineEnd: '-4px',
              '& > div': { display: 'flex' },
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
                <IconAddMonth color="var(--accent-dark)" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('tr_edit')}>
              <IconButton
                className="edit-button"
                aria-label={t('tr_edit')}
                edge={false}
                onClick={onEdit}
              >
                <IconEdit color="var(--accent-dark)" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
      <Box
        className="meeting-details"
        sx={{
          display: 'grid',
          gridTemplateColumns: tablet600Up
            ? 'var(--agenda-detail-columns)'
            : 'minmax(0, 1fr)',
          alignItems: 'start',
          gap: '8px 24px',
          minWidth: 0,
        }}
      >
        <DetailRow
          label={t('tr_conductor')}
          icon={<IconPerson color="var(--grey-400)" />}
          className="body-small-regular"
        >
          {meeting.conductor}
        </DetailRow>
        <DetailRow
          label={t('tr_location')}
          icon={getLocationIcon(meeting.location, 'var(--grey-400)')}
          className="body-small-regular"
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
                color: 'var(--accent-text)',
                textDecorationColor: 'currentColor',
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
          <Box
            className="meeting-note"
            sx={{ gridColumn: '1 / -1', minWidth: 0 }}
          >
            <DetailRow
              label={t('tr_comments')}
              icon={<IconInfo color="var(--text-muted)" />}
              className="body-small-regular"
              color="var(--text-muted)"
              preserveWhitespace
            >
              {meeting.additionalInfo}
            </DetailRow>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MeetingItem;
