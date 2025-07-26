import { Box, IconButton } from '@mui/material';
import { UpcomingEventProps } from './index.types';
import useUpcomingEvent from './useUpcomingEvent';
import { cloneElement, Fragment } from 'react';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import Typography from '@components/typography';
import {
  UpcomingEventCategory,
  UpcomingEventDuration,
} from '@definition/upcoming_events';
import { IconEdit } from '@components/icons';
import Divider from '@components/divider';
import UpcomingEventDate from '../upcoming_event_date';
import EditUpcomingEvent from '../edit_upcoming_event';
import AddToCalendar from '../add_to_calendar';

const UpcomingEvent = (props: UpcomingEventProps) => {
  const { t } = useAppTranslation();
  const { isAdmin } = useCurrentUser();
  const { desktopUp, tabletUp, tablet600Up } = useBreakpoints();
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
    eventDaysCountIndicator,
  } = useUpcomingEvent(props);

  return !isEdit ? (
    <Box
      sx={{
        backgroundColor: 'var(--white)',
        border: '1px solid var(--accent-300)',
        borderRadius: 'var(--radius-xl)',
        padding: tabletUp ? '24px' : '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',

        ...(desktopUp && {
          '.upc-edit-btn': {
            visibility: 'hidden',
          },
          '.upc-add-to-calendar-btn': {
            visibility: 'hidden',
          },
          '&:hover': {
            '.upc-edit-btn': {
              visibility: 'visible',
            },
            '.upc-add-to-calendar-btn': {
              visibility: 'visible',
            },
          },
        }),
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: tablet600Up ? 'row' : 'column',
          gap: '16px',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '4px',
            flexDirection: 'column',
            justifyContent: 'center',
            width: tablet600Up ? 'auto' : '100%',
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
                {props.data.event_data.type !== UpcomingEventCategory.Custom
                  ? t(eventDecoration.translationKey)
                  : props.data.event_data.custom}
              </Typography>
            </Box>
            {isAdmin && (
              <IconButton
                sx={{ padding: 0 }}
                onClick={handleTurnEditMode}
                className="upc-edit-btn"
              >
                <IconEdit color="var(--accent-main)" />
              </IconButton>
            )}
          </Box>
          <Typography className="body-regular" color="var(--grey-400)">
            {props.data.event_data.description}
          </Typography>
        </Box>
        <AddToCalendar event={props.data} />
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
      onCancel={() => {}}
    />
  );
};

export default UpcomingEvent;
