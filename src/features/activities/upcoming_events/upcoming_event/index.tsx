import { cloneElement, Fragment } from 'react';
import { Box, IconButton } from '@mui/material';
import { IconEdit } from '@components/icons';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import {
  UpcomingEventCategory,
  UpcomingEventDuration,
} from '@definition/upcoming_events';
import { UpcomingEventProps } from './index.types';
import useUpcomingEvent from './useUpcomingEvent';
import Divider from '@components/divider';
import EditUpcomingEvent from '../edit_upcoming_event';
import Typography from '@components/typography';
import UpcomingEventDate from '../upcoming_event_date';

const UpcomingEvent = (props: UpcomingEventProps) => {
  const { t } = useAppTranslation();

  const { isAdmin } = useCurrentUser();

  const { desktopUp, tabletUp } = useBreakpoints();

  const {
    eventDecoration,
    isEdit,
    eventDates,
    eventTime,
    handleTurnEditMode,
    handleOnSaveEvent,
    prevDay,
    dayIndicatorMaxWidth,
    dayIndicatorRefs,
    generateDatesRange,
    showEditIcon,
    handleMouseEnter,
    handleMouseLeave,
  } = useUpcomingEvent(props);

  if (isEdit) {
    return (
      <EditUpcomingEvent
        data={props.data}
        type={'edit'}
        onSave={handleOnSaveEvent}
        onCancel={() => {}}
      />
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: 'var(--white)',
        border: '1px solid var(--accent-300)',
        borderRadius: 'var(--radius-xl)',
        padding: tabletUp ? '24px' : '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
            width: desktopUp ? 'auto' : '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              justifyContent: 'space-between',
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
                {props.data.event_data.category !== UpcomingEventCategory.Custom
                  ? t(eventDecoration.translationKey)
                  : props.data.event_data.custom}
              </Typography>
            </Box>

            {isAdmin && (!desktopUp || showEditIcon) && (
              <IconButton sx={{ padding: 0 }} onClick={handleTurnEditMode}>
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

      {props.data.event_data.duration === UpcomingEventDuration.SingleDay && (
        <UpcomingEventDate
          date={new Date(props.data.event_data.start)}
          title={eventTime}
          disabled={false}
        />
      )}

      {props.data.event_data.category ===
        UpcomingEventCategory.SpecialCampaignWeek && (
        <UpcomingEventDate
          date={eventDates[0]}
          title={t('tr_everyDay')}
          disabled={eventDates[eventDates.length - 1] <= prevDay()}
          description={t('tr_days', { daysCount: eventDates.length })}
          datesRange={generateDatesRange()}
        />
      )}

      {props.data.event_data.duration === UpcomingEventDuration.MultipleDays &&
        props.data.event_data.category !==
          UpcomingEventCategory.SpecialCampaignWeek &&
        eventDates.map((eventDate, eventDateIndex) => (
          <Fragment key={eventDate.toISOString()}>
            <UpcomingEventDate
              date={eventDate}
              title={t('tr_wholeDay')}
              disabled={eventDate <= prevDay()}
              description={`${t('tr_day')} ${eventDateIndex + 1}/${eventDates.length}`}
              dayIndicatorRef={(element: HTMLDivElement) => {
                dayIndicatorRefs.current[eventDateIndex] = element;
              }}
              dayIndicatorSharedWidth={dayIndicatorMaxWidth}
            />

            {eventDateIndex + 1 !== eventDates.length && (
              <Divider color="var(--accent-200)" />
            )}
          </Fragment>
        ))}
    </Box>
  );
};

export default UpcomingEvent;
