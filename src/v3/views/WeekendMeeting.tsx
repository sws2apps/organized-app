import WeekendMeetingHeader from './WeekendMeeting_PDF/WeekendMeeting_Heder';
import WeekendMeetingItem from './WeekendMeeting_PDF/WeekendMeeting_item';
import { StyleSheet, Document, Page } from '@react-pdf/renderer';

const data = [
  {
    date: '2024-03-15',
    chairman: 'John Doe',
    openingPrayer: 'Jane Smith',
    studyConductor: 'Mark Johnson',
    reader: 'Emily Brown',
    speechTitle: 'Bible Principles — Can They Help Us to Cope With Todays',
    speechNumber: '123',
    mainSpeaker: 'Michael White',
    congregation: 'New York City',
    substituteName: 'Sarah Lee',
  },
  {
    date: '2024-04-16',
    chairman: 'Alice Jones',
    openingPrayer: 'David Clark',
    studyConductor: 'Karen Taylor',
    reader: 'Peter Wilson',
    speechTitle: 'Bible Principles — Can They Help Us to Cope With Todays',
    speechNumber: '5',
    mainSpeaker: 'Jennifer Martinez',
    congregation: 'Los Angeles',
    substituteName: 'Robert Garcia',
  },
  {
    date: '2024-05-17',
    chairman: 'Matthew Brown',
    openingPrayer: 'Emma Davis',
    studyConductor: 'James Wilson',
    reader: 'Olivia Taylor',
    speechTitle: 'Walking With God Brings Blessings Now and Forever',
    speechNumber: '34',
    mainSpeaker: 'Daniel Anderson',
    congregation: 'Chicago',
    substituteName: 'Sophia Rodriguez',
  },
  {
    date: '2024-06-18',
    chairman: 'William Thomas',
    openingPrayer: 'Ava Garcia',
    studyConductor: 'Liam Hernandez',
    reader: 'Charlotte Martinez',
    speechTitle: 'Bible Principles—Can They Help Us to Cope With Todays',
    speechNumber: '101',
    mainSpeaker: 'Ethan Gonzalez',
    congregation: 'Houston',
    substituteName: 'Amelia Martinez',
  },
  {
    date: '2024-07-19',
    chairman: 'Mia Lopez',
    openingPrayer: 'Noah Perez',
    studyConductor: 'Isabella Ramirez',
    reader: 'Logan Torres',
    speechTitle: 'Be a Hearer and a Doer of God’s Word',
    speechNumber: '121',
    mainSpeaker: 'Mason Flores',
    congregation: 'Phoenix',
    substituteName: 'Evelyn Sanchez',
  },
];

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    height: '100%',
    width: '100%',
  },
});

const WeekendMeeting = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <WeekendMeetingHeader />
      {data.map((meetingData, index) => (
        <WeekendMeetingItem key={index} meetingData={meetingData} />
      ))}
    </Page>
  </Document>
);

export default WeekendMeeting;
