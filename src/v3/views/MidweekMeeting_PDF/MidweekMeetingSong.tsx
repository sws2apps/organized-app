import React from 'react';
import { Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import InterRegular from '@assets/fonts/Inter-Regular.ttf';
import InterSemiBold from '@assets/fonts/Inter-SemiBold.ttf';
import InterMedium from '@assets/fonts/Inter-Medium.ttf';
import InterLight from '@assets/fonts/Inter-Light.ttf';
import SongSvg from './Svg/SongSvg';
import { MidweekMeetingSongProps } from './midweekMeeting.types';

Font.register({
  family: 'Inter',
  fonts: [
    { src: InterLight, fontWeight: 'light' },
    { src: InterRegular, fontWeight: 'normal' },
    { src: InterMedium, fontWeight: 'medium' },
    { src: InterSemiBold, fontWeight: 'semibold' },
  ],
});

const styles = StyleSheet.create({
  container: {
    paddingTop: 2,
    paddingBottom: 2,

    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  text: {
    fontFamily: 'Inter',
    fontSize: 9,
    fontWeight: 'semibold',
    marginLeft: 2,
  },
  prayer: {
    color: '#757575',
    fontFamily: 'Inter',
    fontSize: 9,
    fontWeight: 'light',
  },
  name: {
    color: '##222222',
    fontFamily: 'Inter',
    fontSize: 9,
    fontWeight: 'medium',
  },
});

const MidweekMeetingSong = ({ prayer, name, songNumber }: MidweekMeetingSongProps) => {
  return (
    <View style={styles.container}>
      <View style={{ display: 'flex', flexDirection: 'row', width: 355, justifyContent: 'space-between', gap: 4 }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          <SongSvg />
          <Text style={styles.text}> Song {songNumber}</Text>
        </View>
        {prayer && <Text style={styles.prayer}>Prayer:</Text>}
      </View>
      {prayer && (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Text style={styles.name}>{name}</Text>
        </View>
      )}
    </View>
  );
};

export default MidweekMeetingSong;
