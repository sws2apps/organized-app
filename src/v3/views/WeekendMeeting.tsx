import React, { useState, useEffect } from 'react';
import { StyleSheet, Document, Page, View } from '@react-pdf/renderer';
import WeekendMeetingHeader from './WeekendMeeting_PDF/WeekendMeeting_Header';
import WeekendMeetingItem from './WeekendMeeting_PDF/WeekendMeeting_item';
import WeekendMeetingFooter from './WeekendMeeting_PDF/WeekendMeeting_Footer';

//Function to generate meeting data dynamically

const generateMeetingData = () => {
  const meetings = [];
  const titles = [
    'Bible Principles — Can They Help Us to Cope With Todays',
    'Walking With God Brings Blessings Now and Forever',
    'Be a Hearer and a Doer of God’s Word',
  ];
  const locations = ['New York City', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
  const substitutes = ['Sarah Lee', 'Robert Garcia', 'Sophia Rodriguez', 'Amelia Martinez', 'Evelyn Sanchez'];

  for (let i = 0; i < 7; i++) {
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

    const weekType = 'Normal week';

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
      weekType,
    });
  }

  meetings.push(
    { date: '2024-03-25', text: 'Week of Circuit Assembly text', weekType: 'Week of Circuit Assembly' },
    {
      date: '2024-09-29',
      text: 'John Doe',
      weekType: 'Visit of the circuit overseer',
      chairman: 'John Doe',
      openingPrayer: 'John Doe',
      studyConductor: 'John Doe',
    }
  );

  return meetings;
};

const data = generateMeetingData();

const sortedData = data.slice().sort((a, b) => {
  return a.date.localeCompare(b.date);
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    height: '100%',
    width: '100%',
  },
});

const MAX_HEIGHT_ON_PAGE = 710;

const WeekendMeeting = () => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const tempPages = [];
    let currentPage = [];
    let currentPageHeight = 0;

    sortedData.forEach((meetingData, index) => {
      const itemHeight = calculateItemHeight(meetingData);

      if (currentPageHeight + itemHeight <= MAX_HEIGHT_ON_PAGE) {
        currentPage.push(meetingData);
        currentPageHeight += itemHeight;
      } else {
        tempPages.push(currentPage);
        currentPage = [meetingData];
        currentPageHeight = itemHeight;
      }

      if (index === sortedData.length - 1 && currentPage.length > 0) {
        tempPages.push(currentPage);
      }
    });

    setPages(tempPages);
  }, []);

  const calculateItemHeight = (meetingData) => {
    const { weekType } = meetingData;

    let height;
    switch (weekType) {
      case 'Normal week':
        height = 80;
        break;
      case 'Visit of the circuit overseer':
        height = 70;
        break;
      default:
        height = 50;
    }
    return height;
  };

  return (
    <Document>
      {pages.map((pageData, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          <WeekendMeetingHeader />
          <View>
            {pageData.map((meetingData, itemIndex) => (
              <WeekendMeetingItem
                key={itemIndex}
                meetingData={meetingData}
                isLastItem={itemIndex === pageData.length - 1}
              />
            ))}
          </View>
          <WeekendMeetingFooter />
        </Page>
      ))}
    </Document>
  );
};

export default WeekendMeeting;
