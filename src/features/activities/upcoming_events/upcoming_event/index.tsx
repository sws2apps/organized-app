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
import AddToCalendar from '../add_to_calendar';
import Typography from '@components/typography';
import UpcomingEventDate from '../upcoming_event_date';

const UpcomingEvent = (props: UpcomingEventProps) => {
  const { t } = useAppTranslation();

  const { isAdmin } = useCurrentUser();
  const { desktopUp, tabletUp, tablet600Up } = useBreakpoints();

  const {
    eventDecoration,
    isEdit,
    handleTurnEditMode,
    handleOnSaveEvent,
    dayIndicatorMaxWidth,
    dayIndicatorRefs,
    showEditIcon,
    handleMouseEnter,
    handleMouseLeave,
    eventFormatted,
    previousDay,
  } = useUpcomingEvent(props);

  if (isEdit) {
    return (
      <EditUpcomingEvent
        data={props.data}
        type={'edit'}
        onSave={handleOnSaveEvent}
        onCancel={handleTurnEditMode}
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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
        <AddToCalendar event={props.data} />
      </Box>

      <Divider color="var(--accent-200)" />

      {props.data.event_data.duration === UpcomingEventDuration.SingleDay && (
        <UpcomingEventDate
          title={eventFormatted.time}
          date={eventFormatted.date}
          day={eventFormatted.day}
          disabled={false}
        />
      )}

      {props.data.event_data.category ===
        UpcomingEventCategory.SpecialCampaignWeek && (
        <UpcomingEventDate
          title={t('tr_everyDay')}
          range={eventFormatted.datesRange}
          disabled={eventFormatted.start <= previousDay}
          description={t('tr_days', { daysCount: eventFormatted.dates.length })}
        />
      )}

      {props.data.event_data.duration === UpcomingEventDuration.MultipleDays &&
        props.data.event_data.category !==
          UpcomingEventCategory.SpecialCampaignWeek &&
        eventFormatted.dates.map((eventDate, eventDateIndex) => (
          <Fragment key={eventDate.date}>
            <UpcomingEventDate
              date={eventDate.dateFormatted}
              day={eventDate.day}
              title={t('tr_wholeDay')}
              disabled={eventDate.date <= previousDay}
              description={`${t('tr_day')} ${eventDateIndex + 1}/${eventFormatted.dates.length}`}
              dayIndicatorRef={(element: HTMLDivElement) => {
                dayIndicatorRefs.current[eventDateIndex] = element;
              }}
              dayIndicatorSharedWidth={dayIndicatorMaxWidth}
            />

            {eventDateIndex + 1 !== eventFormatted.dates.length && (
              <Divider color="var(--accent-200)" />
            )}
          </Fragment>
        ))}
    </Box>
  );
};

export default UpcomingEvent;
