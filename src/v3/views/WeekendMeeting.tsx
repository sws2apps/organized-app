import WeekendMeetingHeader from './WeekendMeeting_PDF/WeekendMeeting_Header';
import WeekendMeetingItem from './WeekendMeeting_PDF/WeekendMeeting_item';
import { StyleSheet, Document, Page } from '@react-pdf/renderer';

// Function to generate meeting data dynamically
const generateMeetingData = () => {
  const meetings = [];
  const titles = [
    'Bible Principles — Can They Help Us to Cope With Todays',
    'Walking With God Brings Blessings Now and Forever',
    'Be a Hearer and a Doer of God’s Word',
  ];
  const locations = ['New York City', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
  const substitutes = ['Sarah Lee', 'Robert Garcia', 'Sophia Rodriguez', 'Amelia Martinez', 'Evelyn Sanchez'];

  for (let i = 0; i < 5; i++) {
    const date = `2024-0${i + 3}-${i + 15}`;
    const chairman = `John Doe${i}`;
    const openingPrayer = `Jane Smith${i}`;
    const studyConductor = `Mark Johnson${i}`;
    const reader = `Emily Brown${i}`;
    const speechTitle = titles[i % titles.length];
    const speechNumber = (i + 100).toString();
    const mainSpeaker = `Michael White${i}`;
    const congregation = locations[i];
    const substituteName = substitutes[i];

    meetings.push({
      date,
      chairman,
      openingPrayer,
      studyConductor,
      reader,
      speechTitle,
      speechNumber,
      mainSpeaker,
      congregation,
      substituteName,
    });
  }

  return meetings;
};

const data = generateMeetingData();

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
