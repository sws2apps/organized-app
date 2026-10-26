import { useMemo } from 'react';
import { Box, Link } from '@mui/material';
import { useAtomValue } from 'jotai';
import { IconEdit } from '@components/icons';
import LabeledDetail from '@components/labeled_detail';
import InfoNote from '@components/info_note';
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
  let groupLabel = meeting.groupName;
  if (!groupLabel) {
    groupLabel = categoryLabel;
    if (isOverseerVisit) groupLabel = t('tr_allGroups');
    if (meeting.group_id) groupLabel = t('tr_group');
  }
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
        display: 'grid',
        gridTemplateColumns: canEdit ? 'minmax(0, 1fr) auto' : 'minmax(0, 1fr)',
        gap: 'var(--detail-row-gap) var(--agenda-group-rail-gap)',
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
          alignItems: 'center',
          gap: '12px',
          minWidth: 0,
          minHeight: 'var(--agenda-entry-header-height)',
          gridColumn: 1,
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
            gap: '4px 8px',
          }}
        >
          <Typography
            component="h4"
            className="h4"
            sx={{ minWidth: 0, overflowWrap: 'anywhere' }}
          >
            {groupLabel}
          </Typography>
          {isOverseerVisit && (
            <GroupBadge label={categoryLabel} variant="outlined" size="small" />
          )}
        </Box>
      </Box>
      {canEdit && (
        <Box
          className="meeting-actions day-agenda-actions"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            alignSelf: 'start',
            height: 'var(--agenda-entry-header-height)',
            gridColumn: 2,
            gridRow: 1,
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
      <Box
        className="meeting-details"
        sx={{
          display: 'grid',
          gridColumn: '1 / -1',
          gridTemplateColumns: tablet600Up
            ? 'var(--agenda-detail-columns)'
            : 'minmax(0, 1fr)',
          alignItems: 'start',
          gap: 'var(--detail-row-gap) var(--detail-column-gap)',
          minWidth: 0,
        }}
      >
        <LabeledDetail
          label={t('tr_conductor')}
          valueClassName="body-small-semibold"
        >
          {meeting.conductor}
        </LabeledDetail>
        <LabeledDetail
          label={t('tr_location')}
          valueClassName="body-small-semibold"
          icon={getLocationIcon(meeting.location, 'var(--grey-400)')}
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
        </LabeledDetail>
        {hasAdditionalInfo && (
          <Box
            className="meeting-note"
            sx={{ gridColumn: '1 / -1', minWidth: 0 }}
          >
            <InfoNote
              variant="subtle"
              showIcon={false}
              label={t('tr_comments')}
              message={meeting.additionalInfo}
              preserveWhitespace
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MeetingItem;
