import { Box, IconButton } from '@mui/material';
import { UpcomingEventProps } from './index.types';
import useUpcomingEvent from './useUpcomingEvent';
import { cloneElement, Fragment } from 'react';
import { useAppTranslation } from '@hooks/index';
import Typography from '@components/typography';
import { UpcomingEventCategory } from '@definition/upcoming_events';
import { IconEdit } from '@components/icons';
import Divider from '@components/divider';
import UpcomingEventDate from '../upcoming_event_date';
import EditUpcomingEvent from '../edit_upcoming_event';

const UpcomingEvent = (props: UpcomingEventProps) => {
  const { t } = useAppTranslation();
  const {
    eventDecoration,
    isAdmin,
    isEdit,
    handleOnSaveEvent,
    handleTurnOffEditMode,
    handleTurnOnEditMode,
    sortedEventDates,
  } = useUpcomingEvent(props);

  return !isEdit ? (
    <Box
      sx={{
        backgroundColor: 'var(--white)',
        border: '1px solid var(--accent-300)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        gap: '16px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '4px',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              {cloneElement(eventDecoration.icon, { color: 'var(--black)' })}
              <Typography className="h3" color="var(--black)">
                {props.data.event_data.type !== UpcomingEventCategory.Custom
                  ? t(eventDecoration.translationKey)
                  : props.data.event_data.custom}
              </Typography>
            </Box>
            {isAdmin && (
              <IconButton sx={{ padding: 0 }} onClick={handleTurnOnEditMode}>
                <IconEdit color="var(--accent-main)" />
              </IconButton>
            )}
          </Box>
          <Typography className="body-regular" color="var(--grey-400)">
            {props.data.event_data.description}
          </Typography>
        </Box>
      </Box>
      <Divider color="var(--accent-200)" />
      {sortedEventDates.map((eventDate, eventDateIndex) => (
        <Fragment key={eventDate.start}>
          <UpcomingEventDate data={eventDate} />
          {eventDateIndex !== sortedEventDates.length - 1 && (
            <Divider color="var(--accent-200)" />
          )}
        </Fragment>
      ))}
    </Box>
  ) : (
    <EditUpcomingEvent
      data={props.data}
      type={'edit'}
      onSave={handleOnSaveEvent}
      onCancel={handleTurnOffEditMode}
    />
  );
};

export default UpcomingEvent;
