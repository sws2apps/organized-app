import React from 'react';
import { Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import InterRegular from '../../assets/fonts/Inter-Regular.woff';
import InterMedium from '../../assets/fonts/Inter-Medium.woff';

Font.register({
  family: 'Inter',
  fonts: [
    { src: InterRegular, fontWeight: 'normal' },
    { src: InterMedium, fontWeight: 'medium' },
  ],
});

const styles = StyleSheet.create({
  footer: {
    width: 555,
    height: 66,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 16,
    paddingLeft: 16,
    gap: 8,
    border: '1px solid #D5DFFD',
    borderRadius: 6,
    marginTop: 20,
  },
  containerQr: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  qrCode: {
    width: 50,
    height: 50,
    marginRight: 12,
    backgroundColor: 'red',
  },
  messageQr: {
    width: 323,
    marginRight: 40,
    color: '#505050',
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: 'normal',
  },
  printed: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 6,
    paddingRight: 6,
    gap: 8,
    backgroundColor: '#F2F5FF',
    borderRadius: 2,
  },
  printedText: {
    color: '#606D93',
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: 'medium',
  },
});

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

const WeekendMeetingFooter = () => {
  const currentDate = formatDate(new Date());

  return (
    <View style={styles.footer}>
      <View style={styles.containerQr}>
        <View style={styles.qrCode}></View>
        <Text style={styles.messageQr}>
          Find the latest up-to-date version of this schedule by scanning the QR code or directly in your Organized app.
        </Text>
        <View style={styles.printed}>
          <Text style={styles.printedText}>Printed: {currentDate}</Text>
        </View>
      </View>
    </View>
  );
};

export default WeekendMeetingFooter;
