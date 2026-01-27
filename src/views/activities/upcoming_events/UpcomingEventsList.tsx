import { View, Text } from '@react-pdf/renderer';
import { UpcomingEventsListProps } from './index.types';
import UpcomingEvent from './UpcomingEvent';

const UpcomingEventsList = ({ events }: UpcomingEventsListProps) => {
  return (
    <View style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {events.map((events) => (
        <View
          key={events[0].year}
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
              style={{ fontWeight: 600, fontSize: '12px', color: '#5065D0' }}
            >
              {events[0].year}
            </Text>
          </View>

          {events.map((eventData) => (
            <UpcomingEvent key={eventData.uid} event={eventData} />
          ))}
        </View>
      ))}
    </View>
  );
};

export default UpcomingEventsList;
