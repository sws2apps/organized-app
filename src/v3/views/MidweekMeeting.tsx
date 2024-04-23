import { StyleSheet, Document, Page } from '@react-pdf/renderer';
import MidweekMeetingHeader from './MidweekMeeting_PDF/MidweekMeetingHeader';
import MidweekMeetingItem from './MidweekMeeting_PDF/MidweekMeetingItem';
const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#ffffff',
    height: '100%',
    width: '100%',
  },
});

const meetingData = {
  meetingStartTime: '18:30',
  date: '8 November 2023',
  WeeklyBibleReading: '2 Corinthians 4-6',
};

const tasks = [
  {
    part: 'Start of Meeting',
    taskTitle: 'Song',
    taskTime: '(5 min.)',
    prayer: true,
    name: 'Carrington Alan',
    songNumber: '102',
  },
  {
    part: 'Start of Meeting',
    taskTitle: 'Opening words',
    taskTime: '(1 min.)',
    taskConductor: 'Carrington Alan',
  },
  {
    part: 'Treasures from God’s Word',
    taskTitle: 'Comfort Those Who Are Dealing With Anxiety',
    taskTime: '(10 min.)',
    taskConductor: 'Carrington Alan',
    taskNumber: '1.',
  },
  {
    part: 'Treasures from God’s Word',
    taskTitle: 'Spiritual Gems',
    taskTime: '(10 min.)',
    taskConductor: 'Carrington Alan',
    taskNumber: '2.',
  },
  {
    part: 'Treasures from God’s Word',
    taskTitle: 'Bible reading',
    taskTime: '(4 min.)',
    taskConductor: 'Carrington Alan',
    taskNumber: '3.',
  },
  {
    part: 'Apply yourself to the field ministry',
    taskTitle: 'Starting a Conversation',
    taskTime: '(3 min.)',
    taskConductor:
      // 'Carrington Alan',
      {
        'Main hall': { first: 'Koss V.', second: 'Stiverson M.' },
        'Auxillilary classroom 1': { first: 'Koss V.', second: 'Stiverson M.' },
        // 'Auxillilary classroom 2': { first: 'Koss V.', second: 'Stiverson M.' },
      },
    taskNumber: '4.',
  },
  {
    part: 'Apply yourself to the field ministry',
    taskTitle: 'Following Up',
    taskTime: '(3 min.)',
    taskConductor:
      //  'Carrington Alan',
      {
        'Main hall': { first: 'Koss V.', second: 'Stiverson M.' },
        'Auxillilary classroom 1': { first: 'Koss V.', second: 'Stiverson M.' },
        // 'Auxillilary classroom 2': { first: 'Koss V.', second: 'Stiverson M.' },
      },
    taskNumber: '5.',
  },
  {
    part: 'Apply yourself to the field ministry',
    taskTitle: 'Explaining Your Beliefs',
    taskTime: '(3 min.)',
    taskConductor:
      // 'Carrington Alan',
      {
        'Main hall': { first: 'Koss V.' },
        'Auxillilary classroom 1': { first: 'Koss V.' },
        // 'Auxillilary classroom 2': { first: 'Koss V.', second: 'Stiverson M.' },
      },
    taskNumber: '6.',
  },
  {
    part: 'Living as christians',
    taskTitle: 'Song',
    taskTime: '(3 min.)',
    songNumber: '102',
  },
  {
    part: 'Living as christians',
    taskTitle: 'Be Prepared for Situations That Require Medical or Surgical Care',
    taskTime: '(10 min.)',
    taskConductor: 'Carrington Alan',
    taskNumber: '7.',
  },
  {
    part: 'Living as christians',
    taskTitle: 'Local needs',
    taskTime: '(5 min.)',
    taskConductor: 'Carrington Alan',
    taskNumber: '8.',
  },
  {
    part: 'Living as christians',
    taskTitle: 'Congregation Bible Study',
    taskTime: '(30 min.)',
    taskConductor: 'Carrington Alan',
    taskNumber: '9.',
  },
  {
    part: 'Living as christians',
    taskTitle: 'Song',
    taskTime: '(0 min.)',
    prayer: true,
    name: 'Carrington Alan',
    songNumber: '102',
  },
];

const MidweekMeeting = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <MidweekMeetingHeader />
        <MidweekMeetingItem meetingData={meetingData} tasks={tasks} />
      </Page>
    </Document>
  );
};

export default MidweekMeeting;
