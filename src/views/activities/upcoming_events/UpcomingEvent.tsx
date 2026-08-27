import { View, Text } from '@react-pdf/renderer';
import { cloneElement, Fragment } from 'react';
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

  const days = event.dates.map((date, index) => ({ ...date, index }));

  const splitIndex = Math.ceil(days.length / 2);

  const dayColumns = [days.slice(0, splitIndex), days.slice(splitIndex)].filter(
    (column) => column.length > 0
  );

  return (
    <View
      wrap={false}
      style={{
        border: '1px solid #D5DFFD',
        backgroundColor: '#FEFEFE',
        borderRadius: '4px',
        padding: '8px',
      }}
    >
      <View style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <View style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            {cloneElement(decorationsForEvent[event.category].icon, {
              size: 14,
              backgroundColor: 'none',
            })}

            <Text
              style={{ fontWeight: 500, fontSize: '11px', color: '#222222' }}
            >
              {event.category !== UpcomingEventCategory.Custom
                ? t(decorationsForEvent[event.category].translationKey)
                : event.custom}
            </Text>
          </View>

          <Text style={{ fontWeight: 400, fontSize: '9px', color: '#505050' }}>
            {event.description}
          </Text>
        </View>

        {event.duration === UpcomingEventDuration.SingleDay && (
          <UpcomingEventDate
            date={event.date}
            day={event.day}
            title={event.time}
          />
        )}

        {event.duration === UpcomingEventDuration.MultipleDays &&
          event.category !== UpcomingEventCategory.SpecialCampaignWeek && (
            <View style={{ flexDirection: 'row', gap: '12px' }}>
              {dayColumns.map((column, columnIndex) => (
                <View
                  key={column[0].date}
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    gap: '10px',
                    borderLeft: columnIndex > 0 ? '1px solid #E5E9F5' : 'none',
                    paddingLeft: columnIndex > 0 ? '12px' : '0px',
                  }}
                >
                  {column.map((eventDate, indexInColumn) => (
                    <Fragment key={eventDate.date}>
                      <UpcomingEventDate
                        date={eventDate.dateFormatted}
                        day={eventDate.day}
                        title={t('tr_wholeDay')}
                        description={`${t('tr_day')} ${eventDate.index + 1}/${event.dates.length}`}
                      />

                      {indexInColumn + 1 !== column.length && (
                        <View
                          style={{
                            width: '100%',
                            borderBottom: '1px solid #E5E9F5',
                          }}
                        />
                      )}
                    </Fragment>
                  ))}
                </View>
              ))}
            </View>
          )}

        {event.category === UpcomingEventCategory.SpecialCampaignWeek && (
          <UpcomingEventDate
            range={event.datesRange}
            title={t('tr_everyDay')}
            description={t('tr_days', { daysCount: event.dates.length })}
          />
        )}
      </View>
    </View>
  );
};

export default UpcomingEvent;
