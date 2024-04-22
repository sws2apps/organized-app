import React from 'react';
import { Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import InterRegular from '@assets/fonts/Inter-Regular.ttf';
import { MidweekMeetingTimeProps } from './midweekMeeting.types';

Font.register({
  family: 'Inter',
  fonts: [{ src: InterRegular, fontWeight: 'normal' }],
});

const MidweekMeetingTime = ({ time, textColor }: MidweekMeetingTimeProps) => {
  const getBGColor = (color) => {
    switch (color) {
      case '#3B4CA3':
        return '#F2F5FF';
      case '#2A6B77':
        return '#3C7F8B14';
      case '#956711':
        return '#C2820014';
      case '#942926':
        return '#B82B1014';
      default:
        return null;
    }
  };

  const style = StyleSheet.create({
    container: {
      width: 32,
      paddingTop: 4,
      paddingBottom: 4,
      backgroundColor: getBGColor(textColor),
    },
    time: {
      fontFamily: 'Inter',
      fontSize: 8,
      fontWeight: 'normal',
      color: textColor,
      textAlign: 'center',
    },
  });

  return (
    <View style={style.container}>
      <Text style={style.time}>{time}</Text>
    </View>
  );
};

export default MidweekMeetingTime;
