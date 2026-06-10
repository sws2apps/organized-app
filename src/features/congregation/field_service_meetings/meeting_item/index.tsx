import { useMemo } from 'react';
import { Box, Link } from '@mui/material';
import { useAtomValue } from 'jotai';
import { IconAddMonth, IconEdit } from '@components/icons';
import Button from '@components/button';
import IconButton from '@components/icon_button';
import GroupBadge from '@components/group_badge';
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
 *
 * Layout:
 *  ┌──────────────────────────────────────────────────┐
 *  │ [Title]                              [Edit]       │  ← header
 *  │ [Date/Time pill] [Conductor]   [scope badge]      │  ← content row
 *  │                  [icon  Address]                  │
 *  │                              [Add to calendar →]  │  ← tablet+: right; mobile: below
 *  └──────────────────────────────────────────────────┘
 *
 * Edit and Add-to-calendar are hidden until card hover on pointer devices,
 * always visible on touch devices (@media hover:none).
 */
const MeetingItem = ({ meeting, canEdit, onEdit }: MeetingItemProps) => {
  const { t } = useAppTranslation();
  const { tabletUp } = useBreakpoints();
  const groups = useAtomValue(fieldWithLanguageGroupsState);

  const locationIcon = getLocationIcon(meeting.location, 'var(--grey-400)');

  // Resolve per-group badge colour (sort_index mod 10, 1-based).
  // Falls back to accent-main when there is no specific group.
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

  // Scope badge: badge always answers "who is this meeting for?", never
  // duplicates the title.
  //   Regular  → colour-coded group name
  //   Joint    → "All groups" (accent)
  //   Overseer → colour-coded group name if one is assigned, else "All groups"
  const scopeBadge =
    meeting.category === FieldServiceMeetingCategory.JointMeeting ? (
      <GroupBadge
        label={t('tr_allGroups')}
        color="accent-main"
        variant="outlined"
        size="small"
      />
    ) : meeting.category === FieldServiceMeetingCategory.ServiceOverseerMeeting ? (
      meeting.groupName ? (
        <GroupBadge
          label={meeting.groupName}
          color={groupBadgeColor}
          variant="outlined"
          size="small"
        />
      ) : null
    ) : meeting.groupName ? (
      <GroupBadge
        label={meeting.groupName}
        color={groupBadgeColor}
        variant="outlined"
        size="small"
      />
    ) : null;

  return (
    <Box
      className="meeting-item"
      sx={{
        // Reveal add-to-calendar and edit button on card hover (pointer
        // devices). @media (hover:none) keeps them always visible on touch.
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
        padding: tabletUp ? '16px 24px 24px' : '12px 16px 16px',
        backgroundColor: 'var(--white)',
      }}
    >
      {/* ── Header: title left, edit right ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Typography
          className={tabletUp ? 'h3' : 'h4'}
          sx={{ overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}
        >
          {t(FIELD_SERVICE_MEETING_CATEGORY_TRANSLATION_KEYS[meeting.category])}
        </Typography>

        {canEdit && (
          <IconButton
            className="edit-button"
            aria-label={t('tr_edit')}
            onClick={onEdit}
            sx={{
              flexShrink: 0,
              opacity: 0,
              '@media (hover: none)': { opacity: 1 },
              transition: 'opacity 0.15s ease-in-out',
            }}
          >
            <IconEdit color="var(--accent-main)" />
          </IconButton>
        )}

        {scopeBadge && (
          <Box sx={{ marginLeft: 'auto', flexShrink: 0 }}>
            {scopeBadge}
          </Box>
        )}
      </Box>

      {/* ── Content: tablet+ row (info left, calendar right); mobile column ── */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: tabletUp ? 'row' : 'column',
          gap: '12px',
        }}
      >
        {/* Date/time pill + conductor/address block */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flex: 1,
            alignItems: 'stretch',
            gap: '12px',
          }}
        >
          {/* Date / time pill — stretches to match the text column height */}
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

          {/* Conductor + scope badge + address */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
              minWidth: 0,
              gap: '4px',
            }}
          >
            <Typography className="h4">{meeting.conductor}</Typography>

            {/* Address: text left, icon right */}
            <Typography
              className={tabletUp ? 'body-regular' : 'body-small-regular'}
              color="var(--grey-400)"
              sx={{ overflowWrap: 'break-word' }}
            >
              <Box
                component="span"
                display="flex"
                alignItems="center"
                gap={meeting.address ? '8px' : 0}
                sx={{ minWidth: 0 }}
              >
                {meeting.address && (
                  <Box component="span" sx={{ minWidth: 0 }}>
                    {meeting.address.startsWith('http') ? (
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
                )}
                {locationIcon}
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

        {/* Add-to-calendar: tablet+ inline right (hover-only); mobile full-width */}
        <Box
          className="add-to-calendar"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '0 0 auto',
            width: tabletUp ? 'auto' : '100%',
            opacity: 0,
            '@media (hover: none)': { opacity: 1 },
            transition: 'opacity 0.15s ease-in-out',
          }}
        >
          <Button
            variant="small"
            startIcon={<IconAddMonth />}
            disableAutoStretch={tabletUp}
            onClick={handleAddToCalendar}
            sx={{
              whiteSpace: 'nowrap',
              width: tabletUp ? 'auto' : '100%',
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
