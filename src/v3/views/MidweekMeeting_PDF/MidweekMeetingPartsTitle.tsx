import React from 'react';
import { Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import InterSemiBold from '@assets/fonts/Inter-SemiBold.ttf';
import InterMedium from '@assets/fonts/Inter-Medium.ttf';
import { MeetingPartsTitleProps } from './midweekMeeting.types';

Font.register({
  family: 'Inter',
  fonts: [
    { src: InterMedium, fontWeight: 'medium' },
    { src: InterSemiBold, fontWeight: 'semibold' },
  ],
});

const styles = StyleSheet.create({
  container: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: '#FEFEFE',
    fontFamily: 'Inter',
    fontWeight: 'medium',
    fontSize: 9,
    textTransform: 'uppercase',
    marginLeft: 4,
  },
});

const MidweekMeetingPartsTitle = ({ part, color, icon, taskConductor }: MeetingPartsTitleProps) => {
  const func = (obj) => {
    return obj && typeof obj !== 'string' ? Object.keys(obj) : [];
  };

  const keys = func(taskConductor);

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        {icon}
        <Text style={styles.title}>{part}</Text>
      </View>
      {part === 'Apply yourself to the field ministry' && keys.length > 1 && (
        <View
          style={{
            gap: 2,
            marginLeft: keys.length === 3 ? 6 : keys.length === 2 ? 51 : null,
            display: 'flex',
            flexDirection: 'row-reverse',
          }}
        >
          {keys.map((key, index) => (
            <Text
              key={index}
              style={{
                width: keys.length === 2 ? 140 : 106.67,
                fontFamily: 'Inter',
                fontWeight: 'semibold',
                fontSize: 9,
                color: '#FEFEFE',
              }}
            >
              {key}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default MidweekMeetingPartsTitle;
