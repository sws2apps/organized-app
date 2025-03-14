import { Box } from '@mui/material';
import { DateWithUpcomingEventsProps } from './index.types';
import useDateWithUpcomingEvents from './useDateWithUpcomingEvents';
import Typography from '@components/typography';
import Tooltip from '@components/tooltip';
import { useAppTranslation } from '@hooks/index';
import IconButton from '@components/icon_button';
import { IconEdit } from '@components/icons';
import UpcomingEvent from '../upcoming_event';
import Divider from '@components/divider';
import { Fragment } from 'react';

const DateWithUpcomingEvents = (props: DateWithUpcomingEventsProps) => {
  const { t } = useAppTranslation();
  const { getFormattedDate, isAdmin, localEvents } =
    useDateWithUpcomingEvents(props);

  return (
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
          {getFormattedDate}
        </Typography>
        {isAdmin && (
          <Tooltip title={t('tr_edit')} delaySpeed="slow">
            <IconButton sx={{ padding: 0 }}>
              <IconEdit color="var(--accent-main)" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      {localEvents.map((upcomingEvent, index) => (
        <Fragment key={index}>
          <UpcomingEvent data={upcomingEvent} />
          {index !== props.data.events.length - 1 && (
            <Divider color="var(--accent-200)" />
          )}
        </Fragment>
      ))}
    </Box>
  );
};

export default DateWithUpcomingEvents;
