import { View } from '@react-pdf/renderer';
import { TemplateUpcomingEventType } from './index.types';
import { decorationsForEvent } from '@features/congregation/upcoming_events/decorations_for_event';
import { cloneElement } from 'react';

const UpcomingEvent = ({ event }: TemplateUpcomingEventType) => {
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
              gap: '2px',
            }}
          >
            {cloneElement(decorationsForEvent[event.event_data.type].icon, {
              size: 14,
            })}
          </View>
        </View>
      </View>
    </View>
  );
};

export default UpcomingEvent;
