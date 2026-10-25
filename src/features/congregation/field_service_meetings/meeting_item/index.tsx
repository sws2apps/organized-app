import { useMemo } from 'react';
import { Box, Link } from '@mui/material';
import { useAtomValue } from 'jotai';
import { IconAddMonth, IconEdit, IconPerson } from '@components/icons';
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
  const isOverseerVisit =
    meeting.category === FieldServiceMeetingCategory.ServiceOverseerMeeting;
  const groupLabel =
    meeting.groupName ||
    (meeting.group_id
      ? t('tr_group')
      : isOverseerVisit
        ? t('tr_allGroups')
        : categoryLabel);
  const showCategoryBadge =
    isOverseerVisit ||
    (Boolean(meeting.groupName) &&
      meeting.category !== FieldServiceMeetingCategory.RegularMeeting);
  const groupBadgeColor = useMemo(
    () => resolveGroupBadgeColor(groups, meeting.group_id),
    [groups, meeting.group_id]
  );

  return (
    <Box
      component="article"
      className="meeting-item"
      aria-label={[...new Set([groupLabel, categoryLabel])].join(' · ')}
      sx={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) max-content',
        gap: '8px',
        minWidth: 0,
      }}
    >
      <Box
        className="meeting-summary"
        sx={{
          display: tabletUp ? 'flex' : 'contents',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: tabletUp ? '8px 16px' : '8px',
          gridColumn: 1,
          alignSelf: 'start',
          minWidth: 0,
        }}
      >
        <Box
          className="meeting-badges"
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '8px',
            minWidth: 0,
            maxWidth: '100%',
            flex: '0 1 auto',
            gridColumn: 1,
            gridRow: 1,
          }}
        >
          <GroupBadge
            label={groupLabel}
            color={groupBadgeColor}
            variant="outlined"
            size="small"
          />
          {showCategoryBadge && (
            <GroupBadge label={categoryLabel} variant="outlined" size="small" />
          )}
        </Box>
        <Box
          sx={{
            minWidth: 0,
            maxWidth: '100%',
            gridColumn: '1 / -1',
            gridRow: 2,
            width: tabletUp ? 'max-content' : '100%',
            flex: '0 1 auto',
          }}
        >
          <DetailRow
            label={t('tr_location')}
            icon={locationIcon}
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
                  color: 'var(--accent-main)',
                  textDecorationColor: 'var(--accent-main)',
                  '&:hover': { color: 'var(--accent-dark)' },
                }}
              >
                {meeting.address}
              </Link>
            ) : (
              meeting.address ||
              t(
                FIELD_SERVICE_MEETING_LOCATION_TRANSLATION_KEYS[
                  meeting.location
                ]
              )
            )}
          </DetailRow>
        </Box>
      </Box>
      <Box
        className="meeting-actions"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0,
          gridColumn: 2,
          gridRow: tabletUp ? '1 / 3' : 1,
          alignSelf: 'start',
          justifySelf: 'end',
          // Align the icons with the badge while preserving shared button hit areas.
          height: 'var(--icon-size-small)',
          marginBlockEnd: '8px',
          marginInlineEnd: '-8px',
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
      <Box
        className="meeting-secondary"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          gap: '8px 16px',
          gridColumn: tabletUp ? 1 : '1 / -1',
          gridRow: tabletUp ? 2 : 3,
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            minWidth: 0,
            maxWidth: '100%',
            flex: '0 1 auto',
            gridColumn: '1 / -1',
            gridRow: 3,
          }}
        >
          <DetailRow
            label={t('tr_conductor')}
            icon={<IconPerson color="var(--grey-400)" />}
            className="body-small-regular"
          >
            {meeting.conductor}
          </DetailRow>
        </Box>
        {hasAdditionalInfo && (
          <Typography
            component="div"
            role="group"
            aria-label={t('tr_comments')}
            className="body-small-regular"
            color="var(--text-muted)"
            sx={{
              flex: '0 1 auto',
              minWidth: 0,
              overflowWrap: 'anywhere',
              whiteSpace: 'pre-wrap',
            }}
          >
            {meeting.additionalInfo}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default MeetingItem;
