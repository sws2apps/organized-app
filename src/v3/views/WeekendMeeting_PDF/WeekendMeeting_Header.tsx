import React from 'react';
import { Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import WatchtowerImg from '@assets/img/illustration_watchtower.png';
import InterMedium from '@assets/fonts/Inter-Medium.ttf';

Font.register({
  family: 'Inter',
  fonts: [{ src: InterMedium, fontWeight: 'medium' }],
});

const styles = StyleSheet.create({
  header: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 16,
    paddingLeft: 16,
    backgroundColor: '#6876BE',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  headerTittle: {
    color: '#FEFEFE',
    font: 'Inter',
    fontWeight: 'medium',
    fontSize: 14,
  },
  headerCongregation: {
    color: '#FEFEFE',
    font: 'Inter',
    fontWeight: 'medium',
    fontSize: 12,
  },
  img: {
    width: 18,
    height: 18,
    fill: '#FEFEFE',
  },
});

const WeekendMeetingHeader = () => {
  return (
    <View style={styles.header}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        <Image src={WatchtowerImg} style={styles.img} />
        <Text style={styles.headerTittle}>Weekend meeting schedule</Text>
      </View>
      <Text style={styles.headerTittle}>Congregation name</Text>
    </View>
  );
};

export default WeekendMeetingHeader;
