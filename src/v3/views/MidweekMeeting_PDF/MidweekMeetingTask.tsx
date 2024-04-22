import React from 'react';
import { Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import InterRegular from '@assets/fonts/Inter-Regular.ttf';
import InterSemiBold from '@assets/fonts/Inter-SemiBold.ttf';
import InterMedium from '@assets/fonts/Inter-Medium.ttf';
import InterLight from '@assets/fonts/Inter-Light.ttf';
import { MidweekMeetingTaskProps } from './midweekMeeting.types';

Font.register({
  family: 'Inter',
  fonts: [
    { src: InterLight, fontWeight: 'light' },
    { src: InterRegular, fontWeight: 'normal' },
    { src: InterMedium, fontWeight: 'medium' },
    { src: InterSemiBold, fontWeight: 'semibold' },
  ],
});

const MidweekMeetingTask = ({
  taskNumber,
  taskTitle,
  taskTime,
  taskConductor,
  textColor,
  part,
}: MidweekMeetingTaskProps) => {
  const styles = StyleSheet.create({
    container: {
      paddingTop: 2,
      paddingBottom: 2,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
  });

  const func = (part, obj) => {
    if (part === 'Apply yourself to the field ministry' && typeof obj === 'object') {
      const mappedArray = Object.entries(obj).map(([_, value]) => {
        return { value };
      });
      return mappedArray;
    }
    return [];
  };

  const participants = func(part, taskConductor);

  return (
    <View style={styles.container}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 4,
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: participants.length > 1 ? 188 : 304,
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Text
            style={{
              fontFamily: 'Inter',
              fontWeight: 'normal',
              fontSize: 9,
              color: textColor === '#3B4CA3' ? '#222222' : textColor,
            }}
          >
            {taskNumber} {taskTitle}
          </Text>
          <Text style={{ fontFamily: 'Inter', fontWeight: 'normal', fontSize: 9, color: '#AAAAAA' }}>{taskTime}</Text>
        </View>
        {participants.length > 0 ? null : (
          <Text style={{ fontFamily: 'Inter', fontWeight: 'light', fontSize: 9, color: '#757575' }}>Conductor:</Text>
        )}
      </View>

      {participants.length > 0 ? (
        <View
          style={
            participants.length > 1
              ? { display: 'flex', flexDirection: 'row', width: 326, gap: 2, paddingRight: 2 }
              : {}
          }
        >
          {participants.map((participant: any, index: number) => (
            <View
              key={index}
              style={{ display: 'flex', flexDirection: 'row', width: 106, gap: 4, paddingBottom: 4, paddingTop: 4 }}
            >
              <Text style={{ fontFamily: 'Inter', fontWeight: 'medium', fontSize: 9, color: '#222222' }}>
                {participant.value.first}
              </Text>
              <Text style={{ fontFamily: 'Inter', fontWeight: 'normal', fontSize: 9, color: '#222222' }}>
                {participant.value.second}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={{ fontFamily: 'Inter', fontWeight: 'medium', fontSize: 9, color: '#222222' }}>
          {typeof taskConductor === 'string' ? taskConductor : null}
        </Text>
      )}
    </View>
  );
};

export default MidweekMeetingTask;
