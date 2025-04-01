import { Box } from '@mui/material';
import { UpcomingEventProps } from './index.types';
import useUpcomingEvent from './useUpcomingEvent';
import { cloneElement } from 'react';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import Typography from '@components/typography';
import { UpcomingEventCategory } from '@definition/upcoming_events';
import AddToCalendarButton from '../add_to_calendar_button';

const UpcomingEvent = (props: UpcomingEventProps) => {
  const { t } = useAppTranslation();
  const { tablet600Down } = useBreakpoints();
  const { getEventTime, eventDecoration, timeFormat } = useUpcomingEvent(props);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
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
            width: timeFormat ? '64px' : '90px',
            height: 'auto',
            borderRadius: 'var(--radius-s)',
            padding: '0px 8px 0px 8px',
            backgroundColor: 'var(--accent-150)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            className="h4"
            color="var(--accent-dark)"
            sx={{ textTransform: timeFormat ? 'none' : 'uppercase !important' }}
          >
            {getEventTime}
          </Typography>
        </Box>

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
              flexDirection: 'row',
              gap: '4px',
              alignItems: 'center',
            }}
          >
            {cloneElement(eventDecoration.icon, { color: 'var(--black)' })}
            <Typography className="h4" color="var(--black)">
              {props.data.event_data.type === UpcomingEventCategory.Custom &&
              props.data.event_data.custom
                ? props.data.event_data.custom
                : t(eventDecoration.translationKey)}
            </Typography>
          </Box>
          <Typography className="body-regular" color="var(--grey-400)">
            {props.data.event_data.additional}
          </Typography>
        </Box>
      </Box>
      <AddToCalendarButton
        event={props.data}
        variant={tablet600Down ? 'icon' : 'default'}
      />
    </Box>
  );
};

export default UpcomingEvent;
