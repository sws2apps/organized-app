import { useState, useEffect } from 'react';
import { Page, View } from '@react-pdf/renderer';
import { Week } from '@definition/week_type';
import { MeetingDataType } from './index.types';
import styles from './index.styles';
import WeekendMeetingHeader from './WeekendMeetingHeader';
import WeekendMeetingItem from './WeekendMeetingItem';

const MAX_HEIGHT_ON_PAGE = 820;

const calculateItemHeight = (week_type: Week) => {
  let height: number;

  switch (week_type) {
    case Week.NORMAL:
      height = 80;
      break;
    case Week.CO_VISIT:
      height = 70;
      break;
    default:
      height = 50;
  }
  return height;
};

const WeekendMeetingContainer = ({ data }: { data: MeetingDataType[] }) => {
  const [pages, setPages] = useState<MeetingDataType[][]>([]);

  useEffect(() => {
    const tempPages: MeetingDataType[][] = [];
    let currentPage: MeetingDataType[] = [];
    let currentPageHeight = 0;

    data.forEach((meetingData, index) => {
      const itemHeight = calculateItemHeight(meetingData.week_type);

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
