import { Box } from '@mui/material';
import { UpcomingEventProps } from './index.types';
import useUpcomingEvent from './useUpcomingEvent';
import { cloneElement } from 'react';
import { useAppTranslation } from '@hooks/index';
import Typography from '@components/typography';
import { UpcomingEventCategory } from '@definition/upcoming_events';

const UpcomingEvent = (props: UpcomingEventProps) => {
  const { t } = useAppTranslation();
  const { getEventTime, eventDecoration, timeFormat } = useUpcomingEvent(props);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
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
              {props.data.type === UpcomingEventCategory.Custom &&
              props.data.custom
                ? props.data.custom
                : t(eventDecoration.translationKey)}
            </Typography>
          </Box>
          <Typography className="body-regular" color="var(--grey-400)">
            {props.data.additional}
          </Typography>
        </Box>
      </Box>
      {/*
      // TODO: Add on next PR for this page
       <Button startIcon={<IconAddMonth />} variant="small">
        {t('tr_addToCalendar')}
      </Button> */}
    </Box>
  );
};

export default UpcomingEvent;
