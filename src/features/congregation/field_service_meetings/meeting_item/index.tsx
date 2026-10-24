import { useMemo } from 'react';
import { Box, Link } from '@mui/material';
import { useAtomValue } from 'jotai';
import { IconAddMonth, IconEdit } from '@components/icons';
import Button from '@components/button';
import Card from '@components/card';
import IconButton from '@components/icon_button';
import GroupBadge from '@components/group_badge';
import Badge from '@components/badge';
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
  const { desktopUp, tabletUp } = useBreakpoints();
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
      sx={{
        gap: '12px',
        padding: '16px',
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            minWidth: 0,
            flex: '1 1 auto',
          }}
        >
          <Typography
            className="h4"
            sx={{
              overflowWrap: 'anywhere',
            }}
          >
            {t(
              FIELD_SERVICE_MEETING_CATEGORY_TRANSLATION_KEYS[meeting.category]
            )}
          </Typography>
          {canEdit && (
            <Box
              className="edit-button"
              sx={{
                flexShrink: 0,
              }}
            >
              <IconButton
                aria-label={t('tr_edit')}
                sx={{ marginLeft: '8px' }}
                onClick={onEdit}
              >
                <IconEdit color="var(--accent-main)" />
              </IconButton>
            </Box>
          )}
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
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: desktopUp ? 'row' : 'column',
          gap: '12px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flex: 1,
            alignItems: 'flex-start',
            gap: '12px',
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
              // Let long links wrap instead of widening the row.
              minWidth: 0,
              gap: '4px',
            }}
          >
            <Typography
              className="body-regular"
              sx={{ overflowWrap: 'anywhere' }}
            >
              {meeting.conductor}
            </Typography>
            <Typography
              className={tabletUp ? 'body-regular' : 'body-small-regular'}
              color="var(--grey-400)"
              sx={{ overflowWrap: 'anywhere' }}
            >
              <Box
                component="span"
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '4px',
                  minWidth: 0,
                  '& svg': { flexShrink: 0 },
                }}
              >
                {locationIcon}
                <Box component="span" sx={{ flex: 1, minWidth: 0 }}>
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
              </Box>
            </Typography>
            {meeting.additionalInfo && (
              <Typography
                className="body-small-regular"
                color="var(--grey-400)"
                sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
              >
                {meeting.additionalInfo}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Actions stay visible on pointer, touch and keyboard devices. */}
        <Box
          className="add-to-calendar"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '0 0 auto',
            width: desktopUp ? 'auto' : '100%',
          }}
        >
          <Button
            variant="small"
            startIcon={<IconAddMonth />}
            disableAutoStretch={desktopUp}
            onClick={() => fieldServiceMeetingCalendarExport(meeting, t)}
            sx={{
              whiteSpace: 'normal',
              width: desktopUp ? 'auto' : '100%',
            }}
          >
            {t('tr_addToCalendar')}
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default MeetingItem;
