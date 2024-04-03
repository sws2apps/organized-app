import React from 'react';
import { Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import WatchtowerSvg from './WatchtowerSvg';
import InterMedium from '@assets/fonts/Inter-Medium.ttf';

Font.register({
  family: 'Inter',
  fonts: [{ src: InterMedium, fontWeight: 'medium' }],
});

const styles = StyleSheet.create({
  header: {
    paddingTop: 5,
    paddingBottom: 5,
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
    fontFamily: 'Inter',
    fontWeight: 'medium',
    fontSize: 14,
  },
  headerCongregation: {
    color: '#FEFEFE',
    fontFamily: 'Inter',
    fontWeight: 'medium',
    fontSize: 12,
  },
});

const WeekendMeetingHeader = () => {
  return (
    <View style={styles.header}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        <WatchtowerSvg />
        <Text style={styles.headerTittle}>Weekend meeting schedule</Text>
      </View>
      <Text style={styles.headerCongregation}>Congregation name</Text>
    </View>
  );
};

export default WeekendMeetingHeader;
