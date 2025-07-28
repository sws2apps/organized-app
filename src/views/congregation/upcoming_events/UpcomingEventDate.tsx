import { View, Text } from '@react-pdf/renderer';
import { UpcomingEventDateProps } from './index.types';
import { getCSSPropertyValue } from '@utils/common';
import { generateWeekday } from '@services/i18n/translation';
import { formatLongDateWithShortVarsWithoutYear } from '@utils/date';

const UpcomingEventDate = ({
  date,
  title,
  description,
  dayIndicatorText,
}: UpcomingEventDateProps) => {
  const weekdays = generateWeekday();

  const eventDay = () => {
    const todayIndex = date.getDay();
    const adjustedIndex = todayIndex === 0 ? 6 : todayIndex - 1;

    return weekdays[adjustedIndex];
  };

  return (
    <View
      style={{
        display: 'flex',
        gap: '8px',
        flexDirection: 'row',
      }}
    >
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
        {!dayIndicatorText ? (
          <>
            <Text
              style={{
                fontWeight: 500,
                fontSize: '10px',
                color: '#3B4CA3',
              }}
            >
              {formatLongDateWithShortVarsWithoutYear(date)}
            </Text>
            <Text
              style={{
                fontWeight: 400,
                fontSize: '8px',
                color: '#3B4CA3',
              }}
            >
              {eventDay()}
            </Text>
          </>
        ) : (
          <Text
            style={{
              fontWeight: 500,
              fontSize: '10px',
              color: '#3B4CA3',
            }}
          >
            {dayIndicatorText}
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
        <Text
          style={{
            fontWeight: 500,
            fontSize: '10px',
            color: '#222222',
          }}
        >
          {title}
        </Text>
        {description !== '' && (
          <Text
            style={{
              fontWeight: 400,
              fontSize: '8px',
              color: '#505050',
            }}
          >
            {description}
          </Text>
        )}
      </View>
    </View>
  );
};

export default UpcomingEventDate;
