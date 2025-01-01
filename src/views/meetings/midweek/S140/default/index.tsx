import { Document, Font, Page, View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import { S140Type } from '../shared/index.types';
import { Week } from '@definition/week_type';
import styles from './index.styles';
import FontBold from '@assets/fonts/Inter-SemiBold.ttf';
import FontRegular from '@assets/fonts/Inter-Regular.ttf';
import S140Header from './S140Header';
import S140WeekTitle from './S140WeekTitle';
import S140PartMiniLabel from './S140PartMiniLabel';
import S140Person from './S140Person';
import S140WeekInfoLabel from './S140WeekInfoLabel';
import S140Time from './S140Time';
import S140SourceSimple from './S140SourceSimple';
import S140SourceExtended from './S140SourceExtended';
import S140MeetingPartHeading from './S140MeetingPartHeading';
import S140SourceComplex from './S140SourceComplex';
import S140AYF from './S140AYF';
import S140LC from './S140LC';

Font.register({
  family: 'Inter',
  format: 'truetype',
  fonts: [{ src: FontRegular }, { src: FontBold }],
});

const ScheduleS140 = ({
  data,
  class_count,
  cong_name,
  cong_number,
  lang,
}: S140Type) => {
  const { t } = useAppTranslation();

  const minLabel = t('tr_minLabel');

  return (
    <>
      {data.length > 0 && (
        <Document
          author="sws2apps"
          title={t('tr_midweekMeetingPrint')}
          creator="Organized"
          producer="sws2apps (by react-pdf)"
        >
          <Page size="A4" style={styles.body}>
            {/* S-140 Header */}
            <S140Header
              cong_name={cong_name}
              cong_number={cong_number}
              lang={lang}
            />

            {data.map((meetingData, index) => (
              <View
                key={`week-${meetingData.weekOf}`}
                style={styles.weekContainer}
                break={index > 0 && index % 2 === 0}
              >
                <View style={styles.rowBase}>
                  <S140WeekTitle title={meetingData.schedule_title} />
                  {!meetingData.no_meeting && (
                    <>
                      <S140PartMiniLabel
                        part={`${t('tr_chairman', { lng: lang })}:`}
                      />
                      <S140Person person={meetingData.chairman_A_name} />
                    </>
                  )}
                </View>
                <View style={{ ...styles.rowBase, marginBottom: '10px' }}>
                  <S140WeekInfoLabel weekLabel={meetingData.week_type_name} />
                  {!meetingData.no_meeting && class_count === 2 && (
                    <>
                      <S140PartMiniLabel
                        part={`${t('tr_auxClassCounselor', { lng: lang })}:`}
                      />
                      <S140Person person={meetingData.chairman_B_name} />
                    </>
                  )}
                </View>

                {!meetingData.no_meeting && (
                  <>
                    {/* 3rd row for song, opening prayer */}
                    <View style={styles.rowBase}>
                      <S140Time time={meetingData.timing.pgm_start} />
                      <S140SourceSimple
                        source={meetingData.song_first}
                        bulletColor={'#2a6b77'}
                      />
                      <S140PartMiniLabel
                        part={`${t('tr_prayer', { lng: lang })}:`}
                      />
                      <S140Person person={meetingData.opening_prayer_name} />
                    </View>

                    {/* 4th row for opening comments */}
                    <View style={styles.rowBase}>
                      <S140Time time={meetingData.timing.opening_comments} />
                      <S140SourceExtended
                        source={t('tr_openingComments', { lng: lang })}
                        time={`1 ${minLabel}`}
                        bulletColor={'#2a6b77'}
                      />
                      <S140PartMiniLabel part="" />
                      <S140Person person="" />
                    </View>

                    {meetingData.week_type !== Week.ASSEMBLY &&
                      meetingData.week_type !== Week.CONVENTION && (
                        <>
                          {/* TGW, Classroom heading */}
                          <S140MeetingPartHeading
                            meetingPart={'tr_treasuresPart'}
                            backgroundColor={'#2a6b77'}
                            classroomHeading={true}
                            meetingData={meetingData}
                            class_count={class_count}
                            lang={lang}
                          />

                          {/* TGW Talk */}
                          <View style={styles.rowBase}>
                            <S140Time time={meetingData.timing.tgw_talk} />
                            <S140SourceExtended
                              source={meetingData.tgw_talk_src}
                              time={meetingData.tgw_talk_time}
                              bulletColor={'#2a6b77'}
                            />
                            <S140PartMiniLabel part="" />
                            <S140Person person={meetingData.tgw_talk_name} />
                          </View>

                          {/* TGW Gems */}
                          <View style={styles.rowBase}>
                            <S140Time time={meetingData.timing.tgw_gems} />
                            <S140SourceExtended
                              source={meetingData.tgw_gems_src}
                              time={meetingData.tgw_gems_time}
                              bulletColor={'#2a6b77'}
                            />
                            <S140PartMiniLabel part="" />
                            <S140Person person={meetingData.tgw_gems_name} />
                          </View>

                          {/* Bible Reading */}
                          <View style={styles.rowBase}>
                            <S140Time
                              time={meetingData.timing.tgw_bible_reading}
                            />
                            <S140SourceComplex
                              source={meetingData.tgw_bible_reading_src}
                              time={`4 ${minLabel}`}
                              bulletColor={'#2a6b77'}
                              partLabel={`${t('tr_student', { lng: lang })}:`}
                            />
                            <S140Person
                              person={
                                class_count === 1
                                  ? ''
                                  : meetingData.tgw_bible_reading_B_name
                              }
                            />
                            <S140Person
                              person={meetingData.tgw_bible_reading_A_name}
                            />
                          </View>

                          {/* AYF Heading */}
                          <S140MeetingPartHeading
                            meetingPart={'tr_applyFieldMinistryPart'}
                            backgroundColor={'#a56803'}
                            classroomHeading={true}
                            meetingData={meetingData}
                            class_count={class_count}
                            lang={lang}
                          />

                          {/* AYF Parts */}
                          <S140AYF
                            meetingData={meetingData}
                            class_count={class_count}
                          />

                          {/* LC Heading */}
                          <S140MeetingPartHeading
                            meetingPart={'tr_livingPart'}
                            backgroundColor={'#942926'}
                            classroomHeading={false}
                            meetingData={meetingData}
                            class_count={class_count}
                            lang={lang}
                          />

                          {/* Middle Song */}
                          <View style={styles.rowBase}>
                            <S140Time
                              time={meetingData.timing.lc_middle_song}
                            />
                            <S140SourceSimple
                              source={meetingData.lc_middle_song}
                              bulletColor="#942926"
                            />
                            <S140PartMiniLabel part="" />
                            <S140Person person="" />
                          </View>

                          {/* LC Parts */}
                          <S140LC meetingData={meetingData} />

                          {/* When CO visits: Concluding Comments */}
                          {meetingData.week_type === Week.CO_VISIT && (
                            <>
                              {/* Concluding Comments */}
                              <View style={styles.rowBase}>
                                <S140Time
                                  time={meetingData.timing.concluding_comments}
                                />
                                <S140SourceExtended
                                  source={t('tr_concludingComments', {
                                    lng: lang,
                                  })}
                                  time={`3 ${minLabel}`}
                                  bulletColor="#942926"
                                />
                                <S140PartMiniLabel part="" />
                                <S140Person
                                  person={meetingData.chairman_A_name}
                                />
                              </View>

                              {/* Talk by CO */}
                              <View style={styles.rowBase}>
                                <S140Time time={meetingData.timing.co_talk} />
                                <S140SourceExtended
                                  source={meetingData.lc_co_talk}
                                  time={`30 ${minLabel}`}
                                  bulletColor="#942926"
                                />
                                <S140PartMiniLabel part="" />
                                <S140Person person={meetingData.co_name} />
                              </View>
                            </>
                          )}

                          {/* Normal Week */}
                          {meetingData.week_type === Week.NORMAL && (
                            <>
                              {/* CBS */}
                              <View
                                style={{
                                  ...styles.rowBase,
                                  marginBottom: '3px',
                                }}
                              >
                                <S140Time time={meetingData.timing.cbs} />
                                <S140SourceExtended
                                  source={meetingData.lc_cbs_title}
                                  time={meetingData.lc_cbs_time}
                                  bulletColor="#942926"
                                />
                                <S140PartMiniLabel
                                  part={meetingData.lc_cbs_label}
                                />
                                <S140Person person={meetingData.lc_cbs_name} />
                              </View>

                              {/* Concluding Comments */}
                              <View style={styles.rowBase}>
                                <S140Time
                                  time={meetingData.timing.concluding_comments}
                                />
                                <S140SourceExtended
                                  source={t('tr_concludingComments', {
                                    lng: lang,
                                  })}
                                  time={`3 ${minLabel}`}
                                  bulletColor="#942926"
                                />
                                <S140PartMiniLabel part="" />
                                <S140Person
                                  person={meetingData.chairman_A_name}
                                />
                              </View>
                            </>
                          )}

                          {/* Concluding Song, Prayer */}
                          <View style={styles.rowBase}>
                            <S140Time time={meetingData.timing.pgm_end} />
                            <S140SourceSimple
                              source={meetingData.lc_concluding_song}
                              bulletColor="#942926"
                            />
                            <S140PartMiniLabel
                              part={`${t('tr_prayer', { lng: lang })}:`}
                            />
                            <S140Person
                              person={meetingData.lc_concluding_prayer}
                            />
                          </View>
                        </>
                      )}
                  </>
                )}
              </View>
            ))}
          </Page>
        </Document>
      )}
    </>
  );
};

export default ScheduleS140;
