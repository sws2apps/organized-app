import { View, Text } from '@react-pdf/renderer';
import { cloneElement } from 'react';
import {
  UpcomingEventCategory,
  UpcomingEventDuration,
} from '@definition/upcoming_events';
import { decorationsForEvent } from './decoration_for_event';
import { useAppTranslation } from '@hooks/index';
import { UpcomingEventProps } from './index.types';
import UpcomingEventDate from './UpcomingEventDate';
import { useAtomValue } from 'jotai';
import { hour24FormatState } from '@states/settings';
import { formatDate, getDatesBetweenDates } from '@utils/date';

const UpcomingEvent = ({ event }: UpcomingEventProps) => {
  const { t } = useAppTranslation();
  const hour24 = useAtomValue(hour24FormatState);

  const eventDaysCountIndicator = () => {
    const shortMonth = formatDate(eventDates[0], 'LLL');
    const startDay = formatDate(eventDates[0], 'd');
    const endDay = formatDate(eventDates[eventDates.length - 1], 'd');
    return `${shortMonth}. ${startDay}-${endDay}`;
  };

  const eventTime = `${formatDate(new Date(event.event_data.start), hour24 ? 'HH:mm' : 'hh:mm a')} - ${formatDate(new Date(event.event_data.end), hour24 ? 'HH:mm' : 'hh:mm a')}`;
  const eventDates = getDatesBetweenDates(
    new Date(event.event_data.start),
    new Date(event.event_data.end)
  );

  return (
    <View
      style={{
        border: '1px solid #D5DFFD',
        backgroundColor: '#FEFEFE',
        borderRadius: '4px',
        padding: '8px',
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            {cloneElement(decorationsForEvent[event.event_data.type].icon, {
              size: 14,
              backgroundColor: 'none',
            })}
            <Text
              style={{
                fontWeight: 500,
                fontSize: '11px',
                color: '#222222',
              }}
            >
              {event.event_data.type !== UpcomingEventCategory.Custom
                ? t(decorationsForEvent[event.event_data.type].translationKey)
                : event.event_data.custom}
            </Text>
          </View>
          <Text
            style={{
              fontWeight: 400,
              fontSize: '9px',
              color: '#505050',
            }}
          >
            {event.event_data.description}
          </Text>
        </View>
        {event.event_data.duration === UpcomingEventDuration.SingleDay ? (
          <UpcomingEventDate
            date={new Date(event.event_data.start)}
            title={eventTime}
          />
        ) : event.event_data.type !==
          UpcomingEventCategory.SpecialCampaignWeek ? (
          eventDates.map((eventDate, eventDateIndex) => (
            <UpcomingEventDate
              key={new Date(eventDate).toISOString()}
              date={eventDate}
              title={t('tr_wholeDay')}
              description={`${t('tr_day')} ${eventDateIndex + 1}/${eventDates.length}`}
            />
          ))
        ) : (
          <UpcomingEventDate
            date={eventDates[0]}
            title={t('tr_everyDay')}
            description={t('tr_days', { daysCount: eventDates.length })}
            dayIndicatorText={eventDaysCountIndicator()}
          />
        )}
      </View>
    </View>
  );
};

export default UpcomingEvent;
