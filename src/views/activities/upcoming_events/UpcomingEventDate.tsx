import { View, Text } from '@react-pdf/renderer';
import { getCSSPropertyValue } from '@utils/common';
import { UpcomingEventDateProps } from './index.types';

const UpcomingEventDate = ({
  date,
  title,
  description,
  range,
  day,
}: UpcomingEventDateProps) => {
  return (
    <View style={{ display: 'flex', gap: '8px', flexDirection: 'row' }}>
      <View
        style={{
          borderRadius: getCSSPropertyValue('--radius-xs'),
          padding: '4px 12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2px',
          minWidth: '90px',
          backgroundColor: '#F2F5FF',
        }}
      >
        <Text style={{ fontWeight: 500, fontSize: '10px', color: '#3B4CA3' }}>
          {range || date}
        </Text>

        {!range && (
          <Text style={{ fontWeight: 400, fontSize: '8px', color: '#3B4CA3' }}>
            {day}
          </Text>
        )}
      </View>

      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '4px',
        }}
      >
        <Text style={{ fontWeight: 500, fontSize: '10px', color: '#222222' }}>
          {title}
        </Text>

        {description && (
          <Text style={{ fontWeight: 400, fontSize: '8px', color: '#505050' }}>
            {description}
          </Text>
        )}
      </View>
    </View>
  );
};

export default UpcomingEventDate;
