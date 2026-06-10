import { useMemo } from 'react';
import { Box, Link } from '@mui/material';
import { useAtomValue } from 'jotai';
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
import { buildCalendarEvent, downloadCalendarEvent } from '@utils/icalendar';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import type { GroupBadgeProps } from '@components/group_badge/index.types';
import { getLocationIcon } from '../locationIcons';
import { getGroupBadgeColor } from '../groupBadgeColor';

type MeetingItemProps = {
  meeting: FieldServiceMeetingFormattedType;
  canEdit?: boolean;
  onEdit?: () => void;
};

/**
 * Individual field service meeting item display component.
 * Shows meeting details with edit capabilities.
 *
 * Layout:
 *  ┌──────────────────────────────────────────────────┐
 *  │ [Title (h3/h4)] [Edit]      [GroupBadge/Badge]   │  ← header row
 *  │ [Date/Time]  [Conductor + Address]                │  ← always horizontal
 *  │                              [Add to calendar →]  │  ← below on mobile
 *  └──────────────────────────────────────────────────┘
 */
const MeetingItem = ({ meeting, canEdit, onEdit }: MeetingItemProps) => {
  const { t } = useAppTranslation();
  const { desktopUp, tabletUp } = useBreakpoints();
  const groups = useAtomValue(fieldWithLanguageGroupsState);

  const locationIcon = getLocationIcon(meeting.location, 'var(--grey-400)');

  // Resolve the real per-group badge colour — same mapping as the month view
  // (sort_index mod 10, 1-based). Falls back to accent-main for joint /
  // service-overseer meetings that have no specific group.
  const groupBadgeColor = useMemo((): GroupBadgeProps['color'] => {
    if (!meeting.group_id) return 'accent-main';
    const group = groups.find((g) => g.group_id === meeting.group_id);
    if (!group) return 'accent-main';
    return getGroupBadgeColor(group.group_data.sort_index);
  }, [groups, meeting.group_id]);

  const handleAddToCalendar = () => {
    const summary = t(
      FIELD_SERVICE_MEETING_CATEGORY_TRANSLATION_KEYS[meeting.category]
    );

    const descriptionParts: string[] = [];
    if (meeting.conductor) {
      descriptionParts.push(`${t('tr_conductor')}: ${meeting.conductor}`);
    }
    if (meeting.additionalInfo) descriptionParts.push(meeting.additionalInfo);

    const content = buildCalendarEvent({
      uid: meeting.uid,
      start: meeting.startISO,
      end: meeting.endISO,
      summary,
      description: descriptionParts.join('\n'),
      location: meeting.address,
    });

    downloadCalendarEvent(content, 'field-service-meeting.ics');
  };

  return (
    <Box
      className="meeting-item"
      sx={{
        // Reveal add-to-calendar and edit button on hover (desktop only —
        // pointer:fine ensures touch devices always show them).
        '&:hover .add-to-calendar, &:hover .edit-button': {
          '@media (hover: hover) and (pointer: fine)': {
            opacity: 1,
          },
        },
        display: 'flex',
        gap: '12px',
        flexDirection: 'column',
        border: '1px solid var(--accent-300)',
        borderRadius: 'var(--radius-xl)',
        padding: tabletUp ? '24px' : '16px',
        backgroundColor: 'var(--white)',
      }}
    >
      {/* ── Header: title + edit  /  badge(s) ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <Box display="flex" alignItems="center" sx={{ minWidth: 0 }}>
          <Typography
            className={tabletUp ? 'h3' : 'h4'}
            sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {t(FIELD_SERVICE_MEETING_CATEGORY_TRANSLATION_KEYS[meeting.category])}
          </Typography>
          {canEdit && (
            <Box
              className="edit-button"
              sx={{
                opacity: desktopUp ? 0 : 1,
                transition: 'opacity 0.15s ease-in-out',
                flexShrink: 0,
              }}
            >
              <IconButton aria-label={t('tr_edit')} sx={{ marginLeft: '8px' }} onClick={onEdit}>
                <IconEdit color="var(--accent-main)" />
              </IconButton>
            </Box>
          )}
        </Box>

        <Box display="flex" alignItems="center" gap="8px" sx={{ flexShrink: 0 }}>
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
      </Box>

      {/* ── Content: outer flex switches direction at desktop breakpoint ── */}
      {/*   • below desktopUp: column → date+info row on top, action below  */}
      {/*   • desktopUp:       row    → date+info on left, action on right  */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: desktopUp ? 'row' : 'column',
          gap: '12px',
        }}
      >
        {/* Inner horizontal row: date/time pill + conductor/address */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flex: 1,
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          {/* Date / time pill */}
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

          {/* Conductor + address / link */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              // Allow the column to shrink so long links/addresses wrap
              // instead of forcing the row wider than the viewport.
              minWidth: 0,
              gap: '4px',
            }}
          >
            <Typography className="h4">{meeting.conductor}</Typography>
            <Typography
              className={tabletUp ? 'body-regular' : 'body-small-regular'}
              color="var(--grey-400)"
              sx={{ overflowWrap: 'break-word' }}
            >
              <Box
                component="span"
                display="flex"
                alignItems="center"
                gap="4px"
                sx={{ minWidth: 0 }}
              >
                {locationIcon}
                {meeting.address?.startsWith('http') ? (
                  <Link
                    href={meeting.address}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'var(--accent-main)',
                      textDecorationColor: 'var(--accent-main)',
                      '&:hover': { color: 'var(--accent-dark)' },
                    }}
                  >
                    {meeting.address}
                  </Link>
                ) : (
                  meeting.address
                )}
              </Box>
            </Typography>
            {meeting.additionalInfo && (
              <Typography
                className="body-small-regular"
                color="var(--grey-400)"
              >
                {meeting.additionalInfo}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Add-to-calendar action.
            Desktop: in-line, hidden until hover (small auto-sized button).
            Mobile/tablet: full-width centered button below the info row. */}
        <Box
          className="add-to-calendar"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '0 0 auto',
            width: desktopUp ? 'auto' : '100%',
            opacity: desktopUp ? 0 : 1,
            transition: 'opacity 0.15s ease-in-out',
          }}
        >
          <Button
            variant="small"
            startIcon={<IconAddMonth />}
            disableAutoStretch={desktopUp}
            onClick={handleAddToCalendar}
            sx={{
              whiteSpace: 'nowrap',
              width: desktopUp ? 'auto' : '100%',
            }}
          >
            {t('tr_addToCalendar')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MeetingItem;
