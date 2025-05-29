import { Box, IconButton } from '@mui/material';
import { UpcomingEventProps } from './index.types';
import useUpcomingEvent from './useUpcomingEvent';
import { cloneElement, Fragment } from 'react';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import Typography from '@components/typography';
import {
  UpcomingEventCategory,
  UpcomingEventDuration,
} from '@definition/upcoming_events';
import { IconEdit } from '@components/icons';
import Divider from '@components/divider';
import UpcomingEventDate from '../upcoming_event_date';
import EditUpcomingEvent from '../edit_upcoming_event';

const UpcomingEvent = (props: UpcomingEventProps) => {
  const { t } = useAppTranslation();
  const { isAdmin } = useCurrentUser();
  const {
    eventDecoration,
    isEdit,
    eventDates,
    eventTime,
    handleTurnOnEditMode,
    handleOnSaveEvent,
    prevDay,
    dayIndicatorMaxWidth,
    dayIndicatorRefs,
    eventDaysCountIndicator,
  } = useUpcomingEvent(props);

  return !isEdit ? (
    <Box
      sx={{
        backgroundColor: 'var(--white)',
        border: '1px solid var(--accent-300)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
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
      {props.data.event_data.duration === UpcomingEventDuration.SingleDay ? (
        <UpcomingEventDate
          date={new Date(props.data.event_data.start)}
          title={eventTime}
          disabled={false}
        />
      ) : props.data.event_data.type !==
        UpcomingEventCategory.SpecialCampaignWeek ? (
        eventDates.map((eventDate, eventDateIndex) => (
          <Fragment key={eventDate.toISOString()}>
            <UpcomingEventDate
              date={eventDate}
              title={t('tr_wholeDay')}
              disabled={eventDate <= prevDay()}
              description={`${t('tr_day')} ${eventDateIndex + 1}/${eventDates.length}`}
              dayIndicatorRef={(element) =>
                (dayIndicatorRefs.current[eventDateIndex] = element)
              }
              dayIndicatorSharedWidth={dayIndicatorMaxWidth}
            />
            {eventDateIndex + 1 !== eventDates.length && (
              <Divider color="var(--accent-200)" />
            )}
          </Fragment>
        ))
      ) : (
        <UpcomingEventDate
          date={eventDates[0]}
          title={t('tr_everyDay')}
          disabled={eventDates[eventDates.length - 1] <= prevDay()}
          description={t('tr_days', { daysCount: eventDates.length })}
          dayIndicatorText={eventDaysCountIndicator()}
        />
      )}
    </Box>
  ) : (
    <EditUpcomingEvent
      data={props.data}
      type={'edit'}
      onSave={handleOnSaveEvent}
      onCancel={null}
    />
  );
};

export default UpcomingEvent;
