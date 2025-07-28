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

const UpcomingEvent = ({ event }: UpcomingEventProps) => {
  const { t } = useAppTranslation();

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
            {cloneElement(decorationsForEvent[event.type].icon, {
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
              {event.type !== UpcomingEventCategory.Custom
                ? t(decorationsForEvent[event.type].translationKey)
                : event.custom}
            </Text>
          </View>
          <Text
            style={{
              fontWeight: 400,
              fontSize: '9px',
              color: '#505050',
            }}
          >
            {event.description}
          </Text>
        </View>
        {event.duration === UpcomingEventDuration.SingleDay ? (
          <UpcomingEventDate date={new Date(event.start)} title={event.time} />
        ) : event.type !== UpcomingEventCategory.SpecialCampaignWeek ? (
          event.dates.map((eventDate, eventDateIndex) => (
            <UpcomingEventDate
              key={new Date(eventDate).toISOString()}
              date={eventDate}
              title={t('tr_wholeDay')}
              description={`${t('tr_day')} ${eventDateIndex + 1}/${event.dates.length}`}
            />
          ))
        ) : (
          <UpcomingEventDate
            date={event.dates[0]}
            title={t('tr_everyDay')}
            description={t('tr_days', { daysCount: event.dates.length })}
            dayIndicatorText={event.eventDaysCountIndicator}
          />
        )}
      </View>
    </View>
  );
};

export default UpcomingEvent;
