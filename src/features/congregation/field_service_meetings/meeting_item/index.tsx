import { useMemo } from 'react';
import { Box, Link } from '@mui/material';
import { useAtomValue } from 'jotai';
import {
  IconAddMonth,
  IconContactUs,
  IconEdit,
  IconPerson,
} from '@components/icons';
import Card from '@components/card';
import IconButton from '@components/icon_button';
import GroupBadge from '@components/group_badge';
import Badge from '@components/badge';
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

const detailRowSx = {
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  alignItems: 'start',
  gap: '8px',
  minWidth: 0,
  overflowWrap: 'anywhere',
} as const;

const actionButtonSx = {
  '@media (pointer: coarse)': { minWidth: '44px', minHeight: '44px' },
} as const;

const MeetingItem = ({ meeting, canEdit, onEdit }: MeetingItemProps) => {
  const { t } = useAppTranslation();
  const { tabletUp } = useBreakpoints();
  const groups = useAtomValue(fieldWithLanguageGroupsState);

  const locationIcon = getLocationIcon(meeting.location, 'var(--grey-400)');

  // A bare "http…" prefix would also match text that becomes a relative href.
  const isWebAddress = /^https?:\/\//i.test(meeting.address ?? '');

  const groupBadgeColor = useMemo(
    () => resolveGroupBadgeColor(groups, meeting.group_id),
    [groups, meeting.group_id]
  );

  return (
    <Card
      className="meeting-item"
      sx={{ gap: '12px', padding: '16px', minWidth: 0 }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <Typography
          className="h4"
          sx={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}
        >
          {t(FIELD_SERVICE_MEETING_CATEGORY_TRANSLATION_KEYS[meeting.category])}
        </Typography>
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
                sx={actionButtonSx}
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
              sx={actionButtonSx}
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
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          minWidth: 0,
          maxWidth: '100%',
        }}
      >
        {meeting.groupName && (
          <GroupBadge
            label={meeting.groupName}
            color={groupBadgeColor}
            variant="outlined"
          />
        )}
        {meeting.category === FieldServiceMeetingCategory.JointMeeting && (
          <GroupBadge
            label={t('tr_fieldServiceMeetingCategory_joint')}
            color="accent-main"
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

      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            backgroundColor: 'var(--accent-150)',
            padding: tabletUp ? '8px 16px' : '6px 10px',
            borderRadius: 'var(--radius-l)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
            flexShrink: 0,
          }}
        >
          <Typography
            className="body-small-regular"
            color="var(--accent-dark)"
            sx={{ whiteSpace: 'nowrap' }}
          >
            {meeting.datesRange || meeting.date}
          </Typography>
          <Typography className="h4" color="var(--accent-dark)">
            {meeting.time}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minWidth: 0,
            gap: '4px',
          }}
        >
          <Typography component="div" className="body-regular" sx={detailRowSx}>
            <IconPerson color="var(--grey-400)" />
            <Box component="span" sx={{ minWidth: 0 }}>
              {meeting.conductor}
            </Box>
          </Typography>
          <Typography
            component="div"
            className={tabletUp ? 'body-regular' : 'body-small-regular'}
            color="var(--grey-400)"
            sx={detailRowSx}
          >
            {locationIcon}
            <Box component="span" sx={{ minWidth: 0 }}>
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
            </Box>
          </Typography>
          {meeting.additionalInfo && (
            <Typography
              component="div"
              className="body-small-regular"
              color="var(--grey-400)"
              sx={detailRowSx}
            >
              <IconContactUs color="var(--grey-400)" />
              <Box
                component="span"
                sx={{ minWidth: 0, whiteSpace: 'pre-wrap' }}
              >
                {meeting.additionalInfo}
              </Box>
            </Typography>
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default MeetingItem;
