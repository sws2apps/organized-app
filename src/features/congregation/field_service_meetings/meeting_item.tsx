import { Box } from '@mui/material';
import { IconAddMonth, IconAtHome, IconEdit } from '@components/icons';
import Button from '@components/button';
import GroupBadge from '@components/group_badge';
import Badge from '@components/badge';
import Typography from '@components/typography';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { useState } from 'react';
import FieldServiceMeetingForm from './field_service_meeting_form';

import { FieldServiceMeetingFormattedType } from '@definition/field_service_meetings';

type MeetingItemProps = {
  meeting: FieldServiceMeetingFormattedType;
};

const MeetingItem = ({ meeting }: MeetingItemProps) => {
  const { t } = useAppTranslation();
  const { desktopUp } = useBreakpoints();
  const [editMode, setEditMode] = useState(false);

  return (
    <>
      {editMode ? (
        <FieldServiceMeetingForm
          mode="edit"
          handleCloseForm={() => {
            setEditMode(false);
          }}
        />
      ) : (
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
                {meeting.custom ||
                  t(`tr_fieldServiceMeetingCategory_${meeting.category}`)}
              </Typography>
              <Box className="edit-button" sx={{ opacity: desktopUp ? 0 : 1 }}>
                <Button
                  variant="small"
                  sx={{
                    marginLeft: '8px',
                    minHeight: '24px',
                    minWidth: '24px',
                  }}
                  onClick={() => setEditMode(!editMode)}
                >
                  <IconEdit />
                </Button>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap="8px">
              {/* TODO: remove old badge and implement new one */}
              {/* Example badges, adapt as needed for meeting data */}
              {meeting.group && (
                <GroupBadge
                  label={meeting.group}
                  color="group-3"
                  variant="outlined"
                />
              )}
              {meeting.additionalInfo && (
                <Badge
                  text={meeting.additionalInfo}
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
                {/* Format time based on location */}
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
                <Box
                  component="span"
                  display="flex"
                  alignItems="center"
                  gap="4px"
                >
                  <IconAtHome color="var(--grey-400)" />
                  {meeting.address}
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
      )}
    </>
  );
};

export default MeetingItem;
