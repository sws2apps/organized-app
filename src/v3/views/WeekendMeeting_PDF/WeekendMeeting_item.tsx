import React from 'react';
import { Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import InterRegular from '../../assets/fonts/Inter-Regular.woff';
import InterSemiBold from '../../assets/fonts/Inter-SemiBold.woff';
import InterMedium from '../../assets/fonts/Inter-Medium.woff';
import InterLight from '../../assets/fonts/Inter-Light.woff';
import { WeekendMeetingItemProps } from './weekendMeeting.types';

Font.register({
  family: 'Inter',
  fonts: [
    { src: InterRegular, fontWeight: 'normal' },
    { src: InterSemiBold, fontWeight: 'bold' },
    { src: InterMedium, fontWeight: 'medium' },
    { src: InterLight, fontWeight: 'light' },
  ],
});

const styles = StyleSheet.create({
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    borderBottom: '1px solid #D5DFFD',
    borderRight: '1px solid #D5DFFD',
    borderLeft: '1px solid #D5DFFD',
  },
  date: {
    backgroundColor: '#F2F5FF',
    width: 56,
    paddingLeft: 4,
    paddingRight: 4,
    borderRight: '1px solid #D5DFFD',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'Inter',
    fontWeight: 'semibold',
  },
  dateText: {
    color: '#3B4CA3',
    fontSize: 9,
    textAlign: 'center',
  },
  meetingParts: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    paddingTop: 8,
    paddingBottom: 8,
    width: 189,
  },
  meetingRole: {
    width: 90,
    color: '#757575',
    fontSize: 9,
    fontFamily: 'Inter',
  },
  name: {
    color: '#222222',
    fontSize: 10,
    fontFamily: 'Inter',
  },
  roleContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  lineHorizontal: {
    width: 189,
    borderBottom: '1px solid #D5DFFD',
  },
  lineVertical: {
    marginTop: 10,
    marginBottom: 10,
    borderLeft: '1px solid #D5DFFD',
  },
  speechContainer: {
    width: 270,
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    gap: 4,
  },
  titleContainer: {
    width: 270,
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  speechTitle: {
    width: 230,
    color: '#3B4CA3',
    fontSize: 10,
    fontFamily: 'Inter',
    fontWeight: 'semibold',
  },
  speechNumber: {
    color: '#AAAAAA',
    fontSize: 10,
    fontFamily: 'Inter',
    fontWeight: 'medium',
  },
  speakerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  speaker: {
    fontSize: 10,
    fontFamily: 'Inter',
    fontWeight: 'medium',
    color: '#222222',
  },
  mainSpeaker: {
    fontSize: 10,
    fontFamily: 'Inter',
    fontWeight: 'medium',
    color: '#222222',
  },
  congregation: {
    fontSize: 10,
    fontFamily: 'Inter',
    fontWeight: 'light',
    color: '#222222',
  },
  substituteSpeaker: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    gap: 2,
    backgroundColor: '#F2F5FF',
    borderRadius: 2,
  },
  substitute: {
    fontSize: 8,
    fontFamily: 'Inter',
    fontWeight: 'light',
    color: '#222222',
  },
  substituteName: {
    fontSize: 8,
    fontFamily: 'Inter',
    fontWeight: 'medium',
    color: '#222222',
  },
});

const WeekendMeetingItem = ({
  meetingData: {
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
    text,
  },
  isLastItem,
}: WeekendMeetingItemProps) => {
  const formatDate = (inputDate) => {
    const months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
    const [year, month, day] = inputDate.split('-');
    const monthAbbreviation = months[parseInt(month, 10) - 1];
    return `${day} ${monthAbbreviation} ${year}`;
  };
  const formattedDate = formatDate(date);
  console.log(isLastItem);

  let content;

  if (weekType === 'Normal week') {
    content = (
      <>
        <View style={styles.meetingParts}>
          <View>
            {chairman && (
              <View style={styles.roleContainer}>
                <Text style={styles.meetingRole}>Chairman:</Text>
                <Text style={styles.name}>{chairman}</Text>
              </View>
            )}
            {openingPrayer && (
              <View style={styles.roleContainer}>
                <Text style={styles.meetingRole}>Opening prayer:</Text>
                <Text style={styles.name}>{openingPrayer}</Text>
              </View>
            )}
          </View>
          <View style={styles.lineHorizontal} />
          <View>
            {studyConductor && (
              <View style={styles.roleContainer}>
                <Text style={styles.meetingRole}>Study conductor:</Text>
                <Text style={styles.name}>{studyConductor}</Text>
              </View>
            )}
            {reader && (
              <View style={styles.roleContainer}>
                <Text style={styles.meetingRole}>Reader:</Text>
                <Text style={styles.name}>{reader}</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.lineVertical} />
        <View style={styles.speechContainer}>
          <View style={styles.titleContainer}>
            {speechTitle && <Text style={styles.speechTitle}>{speechTitle}</Text>}
            {speechNumber && <Text style={styles.speechNumber}>№{speechNumber}</Text>}
          </View>
          <View style={styles.speakerContainer}>
            <View style={styles.mainSpeaker}>
              {mainSpeaker && <Text style={styles.speaker}>{mainSpeaker}</Text>}
              {congregation && <Text style={styles.congregation}>{congregation}</Text>}
            </View>
            {substituteName && (
              <View style={styles.substituteSpeaker}>
                <Text style={styles.substitute}>Substitute:</Text>
                <Text style={styles.substituteName}>{substituteName}</Text>
              </View>
            )}
          </View>
        </View>
      </>
    );
  } else if (weekType === 'Visit of the circuit overseer') {
    content = (
      <>
        <View style={styles.meetingParts}>
          <View>
            {chairman && (
              <View style={styles.roleContainer}>
                <Text style={styles.meetingRole}>Chairman:</Text>
                <Text style={styles.name}>{chairman}</Text>
              </View>
            )}
            {openingPrayer && (
              <View style={styles.roleContainer}>
                <Text style={styles.meetingRole}>Opening prayer:</Text>
                <Text style={styles.name}>{openingPrayer}</Text>
              </View>
            )}
          </View>
          <View style={styles.lineHorizontal} />
          <View>
            {studyConductor && (
              <View style={styles.roleContainer}>
                <Text style={styles.meetingRole}>Study conductor:</Text>
                <Text style={styles.name}>{studyConductor}</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.lineVertical} />
        <View style={styles.speechContainer}>
          {weekType && (
            <View style={styles.titleContainer}>
              <Text style={styles.speechTitle}>{weekType}</Text>
            </View>
          )}
          <View style={styles.speakerContainer}>
            {text && (
              <View style={styles.mainSpeaker}>
                <Text style={styles.speaker}>{text}</Text>
              </View>
            )}
          </View>
        </View>
      </>
    );
  } else {
    content = (
      <>
        <View style={styles.meetingParts}></View>
        <View style={styles.lineVertical} />
        <View style={styles.speechContainer}>
          {weekType && (
            <View style={styles.titleContainer}>
              <Text style={styles.speechTitle}>{weekType}</Text>
            </View>
          )}
          <View style={styles.speakerContainer}>
            {text && (
              <View style={styles.mainSpeaker}>
                <Text style={styles.speaker}>{text}</Text>
              </View>
            )}
          </View>
        </View>
      </>
    );
  }

  return (
    <View style={[styles.itemContainer, isLastItem && { borderBottomLeftRadius: 6, borderBottomRightRadius: 6 }]}>
      <View style={[styles.date, isLastItem && { borderBottomLeftRadius: 6 }]}>
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>
      {content}
    </View>
  );
};

export default WeekendMeetingItem;
