import React from 'react';
import { Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import InterMedium from '@assets/fonts/Inter-Medium.ttf';

Font.register({
  family: 'Inter',
  fonts: [{ src: InterMedium, fontWeight: 'medium' }],
});

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTittle: {
    color: '#222222',
    fontFamily: 'Inter',
    fontWeight: 'medium',
    fontSize: 14,
  },
  headerCongregation: {
    color: '#222222',
    fontFamily: 'Inter',
    fontWeight: 'medium',
    fontSize: 12,
  },
});

const MidweekMeetingHeader = () => {
  return (
    <View style={styles.header}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        <Text style={styles.headerTittle}>Midweek meeting schedule</Text>
      </View>
      <Text style={styles.headerCongregation}>Congregation name</Text>
    </View>
  );
};

export default MidweekMeetingHeader;
