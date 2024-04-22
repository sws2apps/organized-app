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

const MidweekMeetingPartsTitle = ({ part, color, icon, taskConductor }: MeetingPartsTitleProps) => {
  const styles = StyleSheet.create({
    container: {
      paddingTop: 2,
      paddingBottom: 2,
      paddingRight: 5,
      paddingLeft: 15,
      backgroundColor: color,
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
    mainHall: {
      width: 106.67,
      fontFamily: 'Inter',
      fontWeight: 'semibold',
      fontSize: 9,
      color: '#FEFEFE',
    },
  });

  const func = (obj) => {
    return obj && typeof obj !== 'string' ? Object.keys(obj) : [];
  };

  const keys = func(taskConductor);

  return (
    <View style={styles.container}>
      {icon}
      <Text style={styles.title}>{part}</Text>
      {part === 'Apply yourself to the field ministry' && keys.length > 1 && (
        <View style={{ width: 324, gap: 2, display: 'flex', flexDirection: 'row', marginLeft: 8 }}>
          {keys.map((key, index) => (
            <Text key={index} style={styles.mainHall}>
              {key}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default MidweekMeetingPartsTitle;
