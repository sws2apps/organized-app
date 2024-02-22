import WeekendMeetingHeder from './WeekendMeeting_PDF/WeekendMeeting_Heder';
import { StyleSheet, Document, Page } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
    height: '100%',
    width: '100%',
  },
});

// Create Document Component
const WeekendMeeting = () => (
  <Document style={{ width: '100%', height: '100%' }}>
    <Page size="A4" style={styles.page}>
      <WeekendMeetingHeder />
    </Page>
  </Document>
);

export default WeekendMeeting;
