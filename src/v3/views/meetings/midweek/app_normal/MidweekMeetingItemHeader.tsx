import React from 'react';
import { Text, View, StyleSheet, Font, Svg, Path } from '@react-pdf/renderer';
import InterSemiBold from '@assets/fonts/Inter-SemiBold.ttf';

import { MidweekMeetingItemHeaderProps } from './midweekMeeting.types';

Font.register({
  family: 'Inter',
  fonts: [{ src: InterSemiBold, fontWeight: 'semibold' }],
});

const styles = StyleSheet.create({
  header: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 15,
    paddingLeft: 15,
    backgroundColor: '#6876BE',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,

    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  meetingHeader: {
    color: '#FEFEFE',
    fontFamily: 'Inter',
    fontWeight: 'semibold',
    fontSize: 10,
    marginLeft: 5,
  },
});

const MidweekMeetingItemHeader = ({
  date,
  WeeklyBibleReading,
}: MidweekMeetingItemHeaderProps) => {
  return (
    <View style={styles.header}>
      <Svg viewBox="0 0 24 24" style={{ width: 16, height: 16 }}>
        <Path
          d="M5.3077 21.5006C4.80257 21.5006 4.375 21.3256 4.025 20.9756C3.675 20.6256 3.5 20.198 3.5 19.6929V6.30833C3.5 5.8032 3.675 5.37563 4.025 5.02563C4.375 4.67563 4.80257 4.50063 5.3077 4.50063H6.69233V2.38525H8.23075V4.50063H15.8077V2.38525H17.3076V4.50063H18.6923C19.1974 4.50063 19.625 4.67563 19.975 5.02563C20.325 5.37563 20.5 5.8032 20.5 6.30833V19.6929C20.5 20.198 20.325 20.6256 19.975 20.9756C19.625 21.3256 19.1974 21.5006 18.6923 21.5006H5.3077ZM5.3077 20.0006H18.6923C18.7692 20.0006 18.8397 19.9686 18.9038 19.9045C18.9679 19.8403 19 19.7698 19 19.6929V10.3083H4.99997V19.6929C4.99997 19.7698 5.03202 19.8403 5.09612 19.9045C5.16024 19.9686 5.23077 20.0006 5.3077 20.0006ZM4.99997 8.80835H19V6.30833C19 6.2314 18.9679 6.16087 18.9038 6.09675C18.8397 6.03265 18.7692 6.0006 18.6923 6.0006H5.3077C5.23077 6.0006 5.16024 6.03265 5.09612 6.09675C5.03202 6.16087 4.99997 6.2314 4.99997 6.30833V8.80835Z"
          fill="#FEFEFE"
        />
      </Svg>
      <Text style={styles.meetingHeader}>
        {date} | {WeeklyBibleReading}
      </Text>
    </View>
  );
};

export default MidweekMeetingItemHeader;
