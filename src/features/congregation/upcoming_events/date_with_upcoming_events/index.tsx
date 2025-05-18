import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { DateWithUpcomingEventsProps } from './index.types';
import { IconEdit } from '@components/icons';
import useDateWithUpcomingEvents from './useDateWithUpcomingEvents';
import Divider from '@components/divider';
import EditUpcomingEvent from '../edit_upcoming_event';
import IconButton from '@components/icon_button';
import Tooltip from '@components/tooltip';
import Typography from '@components/typography';
import UpcomingEvent from '../upcoming_event';

const DateWithUpcomingEvents = (props: DateWithUpcomingEventsProps) => {
  const { t } = useAppTranslation();
  const {
    getFormattedDate,
    isAdmin,
    localEvents,
    handleTurnOnEditMode,
    handleTurnOffEditMode,
    handleSaveUpcomingEvents,
    editModeIsOn,
  } = useDateWithUpcomingEvents(props);

  return isAdmin && editModeIsOn ? (
    <EditUpcomingEvent
      data={localEvents}
      type="edit"
      onCancel={handleTurnOffEditMode}
      onSave={handleSaveUpcomingEvents}
    />
  ) : (
    <Box
      sx={{
        border: '1px solid var(--accent-300)',
        borderRadius: 'var(--radius-xl)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        backgroundColor: 'var(--white)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: '24px',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography className="h2" color="var(--black)">
          {getFormattedDate()}
        </Typography>
        {isAdmin && (
          <Tooltip title={t('tr_edit')} delaySpeed="slow">
            <IconButton sx={{ padding: 0 }} onClick={handleTurnOnEditMode}>
              <IconEdit color="var(--accent-main)" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Stack divider={<Divider color="var(--accent-200)" />}>
        {localEvents.map((upcomingEvent) => (
          <UpcomingEvent key={upcomingEvent.event_uid} data={upcomingEvent} />
        ))}
      </Stack>
    </Box>
  );
};

export default DateWithUpcomingEvents;
