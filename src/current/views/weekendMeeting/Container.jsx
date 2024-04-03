import { useState, useEffect } from 'react';
import { Page, View } from '@react-pdf/renderer';
import WeekendMeetingHeader from './Header';
import WeekendMeetingItem from './Row';
import styles from './styles';

const MAX_HEIGHT_ON_PAGE = 850;

const calculateItemHeight = (meetingData) => {
  const { week_type } = meetingData;

  let height;
  switch (week_type) {
    case 1:
      height = 80;
      break;
    case 2:
      height = 70;
      break;
    default:
      height = 50;
  }
  return height;
};

const WeekendMeetingContainer = ({ data }) => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const tempPages = [];
    let currentPage = [];
    let currentPageHeight = 0;

    data.forEach((meetingData, index) => {
      const itemHeight = calculateItemHeight(meetingData);

      if (currentPageHeight + itemHeight <= MAX_HEIGHT_ON_PAGE) {
        currentPage.push(meetingData);
        currentPageHeight += itemHeight;
      } else {
        tempPages.push(currentPage);
        currentPage = [meetingData];
        currentPageHeight = itemHeight;
      }

      if (index === data.length - 1 && currentPage.length > 0) {
        tempPages.push(currentPage);
      }
    });

    setPages(tempPages);
  }, [data]);

  return (
    <>
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
        </Page>
      ))}
    </>
  );
};

export default WeekendMeetingContainer;
