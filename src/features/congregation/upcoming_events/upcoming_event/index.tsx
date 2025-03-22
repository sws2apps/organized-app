import { Box } from '@mui/material';
import { UpcomingEventProps } from './index.types';
import useUpcomingEvent from './useUpcomingEvent';
import { cloneElement } from 'react';
import { useAppTranslation } from '@hooks/index';
import Typography from '@components/typography';
import { UpcomingEventType } from '@definition/upcoming_events';
import Button from '@components/button';
import { IconAddMonth } from '@components/icons';

const UpcomingEvent = (props: UpcomingEventProps) => {
  const { t } = useAppTranslation();
  const { getEventTime, eventDecoration } = useUpcomingEvent(props);

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
            width: '64px',
            height: 'auto',
            borderRadius: 'var(--radius-s)',
            padding: '0px 8px 0px 8px',
            backgroundColor: 'var(--accent-150)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography className="h4" color="var(--accent-dark)">
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
              {props.data.type.value === UpcomingEventType.Custom &&
              props.data.custom
                ? props.data.custom.value
                : t(eventDecoration.translationKey)}
            </Typography>
          </Box>
          <Typography className="body-regular" color="var(--grey-400)">
            {props.data.additional.value}
          </Typography>
        </Box>
      </Box>
      <Button startIcon={<IconAddMonth />} variant="small">
        {t('tr_addToCalendar')}
      </Button>
    </Box>
  );
};

export default UpcomingEvent;
