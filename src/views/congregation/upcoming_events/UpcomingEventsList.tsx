import { View, Text } from '@react-pdf/renderer';
import { UpcomingEventsListType } from './index.types';
import { UpcomingEventType } from '@definition/upcoming_events';

const UpcomingEventsList = ({ events }: UpcomingEventsListType) => {
  const sortEventsByYear = (events: UpcomingEventType[]) => {
    const yearMap = new Map<number, UpcomingEventType[]>();

    for (const event of events) {
      if (event._deleted) continue;

      const dateStr = event.event_data?.start;
      if (!dateStr) continue;

      const year = new Date(dateStr).getFullYear();

      if (!yearMap.has(year)) {
        yearMap.set(year, []);
      }

      yearMap.get(year)!.push(event);
    }

    const sortedYears = Array.from(yearMap.keys()).sort((a, b) => a - b);

    return sortedYears.map((year) => yearMap.get(year)!);
  };

  const sortedEvents = sortEventsByYear(events);

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {sortedEvents.map((events) => (
        <View
          key={new Date(events[0].event_data.start).getFullYear()}
          style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
        >
          <View
            style={{
              border: '1px solid #D5DFFD',
              padding: '5px 8px',
              borderRadius: '4px',
              backgroundColor: '#F2F5FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontWeight: 600,
                fontSize: '12px',
                color: '#5065D0',
              }}
            >
              {new Date(events[0].event_data.start).getFullYear()}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default UpcomingEventsList;
