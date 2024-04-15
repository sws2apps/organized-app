import { useTranslation } from 'react-i18next';
import { Document, Font, Page, StyleSheet, View } from '@react-pdf/renderer';
import { Setting } from '../classes/Setting';
import RobotoBold from '../fonts/Roboto-Bold.ttf';
import RobotoRegular from '../fonts/Roboto-Regular.ttf';
import { WeekTypeList } from '../classes/WeekType';
import { checkLCAssignments } from '../utils/sourceMaterial';
import S140Header from './S140/S140Header';
import S140MeetingPartHeading from './S140/S140MeetingPartHeading';
import S140Person from './S140/S140Person';
import S140PartMiniLabel from './S140/S140PartMiniLabel';
import S140WeekTitle from './S140/S140WeekTitle';
import S140WeekInfoLabel from './S140/S140WeekInfoLabel';
import S140Time from './S140/S140Time';
import S140SourceSimple from './S140/S140SourceSimple';
import S140SourceExtended from './S140/S140SourceExtended';
import S140SourceComplex from './S140/S140SourceComplex';

Font.register({
  family: 'Roboto',
  format: 'truetype',
  fonts: [{ src: RobotoRegular }, { src: RobotoBold }],
});

const styles = StyleSheet.create({
  body: {
    paddingTop: 20,
    paddingBottom: 25,
    paddingHorizontal: 20,
    fontFamily: 'Roboto',
    fontSize: '10px',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    borderBottom: '3px solid black',
    paddingBottom: '2px',
    marginBottom: '12px',
  },
  headerMidweekMeeting: {
    fontSize: '16px',
  },
  weekContainer: {
    marginBottom: '20px',
  },
  miniLabelBase: {
    color: '#424949',
    fontSize: '7px',
    fontWeight: 'bold',
  },
  rowBase: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: '1px',
  },
  personLabel: {
    color: 'black',
    fontSize: '9px',
    padding: '0 0 0 8px',
    width: '130px',
  },
  weekInfoLabel: {
    fontWeight: 'bold',
    color: 'darkblue',
    fontSize: '11px',
    width: '295px',
  },
  meetingTimeLabel: {
    fontWeight: 'bold',
    color: '#424949',
    fontSize: '8px',
    width: '25px',
    marginRight: '5px',
  },
  bulletPoint: {
    fontSize: '16px',
    fontWeight: 'bold',
    width: '8px',
    marginTop: '-3px',
  },
  meetingPartText: {
    fontSize: '9px',
  },
  meetingSectionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '10px',
    padding: '2px 0 2px 6px',
    width: '295px',
    textTransform: 'uppercase',
    borderRadius: '2px',
  },
});

const S140 = ({ data, currentSchedule }) => {
  const { t } = useTranslation('source');

  const { source_lang, schedule_useFullname, class_count, opening_prayer_MM_autoAssign, midweek_meeting_useExactDate } =
    Setting;

  const schedYear = +currentSchedule.value.split('/')[1];

  const minLabel = t('minuteShortLabel', { lng: source_lang, ns: 'ui' });

  const getAssignedChairman = (weekItem, stuClass, scheduleUseFullname) => {
    if (scheduleUseFullname) {
      if (stuClass === 'A') return weekItem.scheduleData.chairmanMM_A_name;
      if (stuClass !== 'A') return weekItem.scheduleData.chairmanMM_B_name;
    }

    if (!scheduleUseFullname) {
      if (stuClass === 'A') return weekItem.scheduleData.chairmanMM_A_dispName;
      if (stuClass !== 'A') return weekItem.scheduleData.chairmanMM_B_dispName;
    }
  };

  const getAssignedOpeningPrayer = (weekItem) => {
    if (schedule_useFullname) {
      return opening_prayer_MM_autoAssign
        ? weekItem.scheduleData.chairmanMM_A_name
        : weekItem.scheduleData.opening_prayerMM_name;
    }

    if (!schedule_useFullname) {
      return opening_prayer_MM_autoAssign
        ? weekItem.scheduleData.chairmanMM_A_dispName
        : weekItem.scheduleData.opening_prayerMM_dispName;
    }
  };

  const getWeekInfoLabel = (weekItem) => {
    if (weekItem.scheduleData.week_type !== 1) {
      return WeekTypeList.getLabel(weekItem.scheduleData.week_type);
    }

    if (weekItem.scheduleData.noMMeeting) return t('noMMeeting', { lng: source_lang });

    return '';
  };

  const getAssignedBRead = (weekItem, stuClass, scheduleUseFullname) => {
    if (scheduleUseFullname) {
      if (stuClass === 'A') return weekItem.scheduleData.bRead_stu_A_name;
      if (stuClass !== 'A') return weekItem.scheduleData.bRead_stu_B_name;
    }

    if (!scheduleUseFullname) {
      if (stuClass === 'A') return weekItem.scheduleData.bRead_stu_A_dispName;
      if (stuClass !== 'A') return weekItem.scheduleData.bRead_stu_B_dispName;
    }
  };

  const getAssignedAYFPerson = (weekItem, fldType, fldStu, fldAss, stuClass, scheduleUseFullname) => {
    if (
      weekItem.sourceData[fldType] === 101 ||
      weekItem.sourceData[fldType] === 102 ||
      weekItem.sourceData[fldType] === 103 ||
      weekItem.sourceData[fldType] === 104 ||
      weekItem.sourceData[fldType] === 108 ||
      (weekItem.sourceData[fldType] >= 140 && weekItem.sourceData[fldType] < 170) ||
      (weekItem.sourceData[fldType] >= 170 && weekItem.sourceData[fldType] < 200) ||
      weekItem.sourceData[fldType] === 123 ||
      weekItem.sourceData[fldType] === 124 ||
      weekItem.sourceData[fldType] === 125 ||
      weekItem.sourceData[fldType] === 126 ||
      weekItem.sourceData[fldType] === 127
    ) {
      let src = weekItem.scheduleData[fldStu];
      if (
        weekItem.scheduleData[fldAss] &&
        weekItem.scheduleData[fldAss] !== '' &&
        weekItem.scheduleData[fldAss] !== 'undefined'
      ) {
        src += scheduleUseFullname ? '\u000A' : '/';
        src += weekItem.scheduleData[fldAss];
      }

      return src;
    }

    if (
      weekItem.sourceData[fldType] === 105 ||
      weekItem.sourceData[fldType] === 106 ||
      weekItem.sourceData[fldType] === 107 ||
      weekItem.sourceData[fldType] === 117
    ) {
      if (scheduleUseFullname) {
        if (stuClass === 'A') return weekItem.scheduleData.chairmanMM_A_name;
        if (stuClass !== 'A') return weekItem.scheduleData.chairmanMM_B_name;
      }

      if (!scheduleUseFullname) {
        if (stuClass === 'A') return weekItem.scheduleData.chairmanMM_A_dispName;
        if (stuClass !== 'A') return weekItem.scheduleData.chairmanMM_B_dispName;
      }
    }

    return '';
  };

  const getAYFType = (weekItem, fldType, fldSrc, fldTypeName) => {
    if (weekItem.sourceData[fldType] === 107) return weekItem.sourceData[fldSrc];
    if (weekItem.sourceData[fldType] === 127) return weekItem.sourceData[fldSrc];
    return weekItem.sourceData[fldTypeName];
  };

  const getAYFDuration = (weekItem, fldType, fldTime) => {
    if (
      weekItem.sourceData[fldType] === 105 ||
      weekItem.sourceData[fldType] === 106 ||
      weekItem.sourceData[fldType] === 107 ||
      weekItem.sourceData[fldType] === 117 ||
      weekItem.sourceData[fldType] === 127
    ) {
      return `${weekItem.sourceData[fldTime]} ${minLabel}`;
    }

    if (
      weekItem.sourceData[fldType] === 101 ||
      weekItem.sourceData[fldType] === 102 ||
      weekItem.sourceData[fldType] === 103 ||
      weekItem.sourceData[fldType] === 104 ||
      weekItem.sourceData[fldType] === 108 ||
      (weekItem.sourceData[fldType] >= 140 && weekItem.sourceData[fldType] < 170) ||
      (weekItem.sourceData[fldType] >= 170 && weekItem.sourceData[fldType] < 200) ||
      weekItem.sourceData[fldType] === 123 ||
      weekItem.sourceData[fldType] === 124 ||
      weekItem.sourceData[fldType] === 125 ||
      weekItem.sourceData[fldType] === 126
    ) {
      return t('partLessTime', { duration: weekItem.sourceData[fldTime], lng: source_lang });
    }
  };

  const ayfLabel = (weekItem, fldType, scheduleUseFullname, fldExplain) => {
    if (
      weekItem.sourceData[fldType] === 101 ||
      weekItem.sourceData[fldType] === 102 ||
      weekItem.sourceData[fldType] === 103 ||
      weekItem.sourceData[fldType] === 108 ||
      (weekItem.sourceData[fldType] >= 140 && weekItem.sourceData[fldType] < 170) ||
      (weekItem.sourceData[fldType] >= 170 && weekItem.sourceData[fldType] < 200) ||
      weekItem.sourceData[fldType] === 123 ||
      weekItem.sourceData[fldType] === 124 ||
      weekItem.sourceData[fldType] === 125 ||
      (weekItem.sourceData[fldType] === 126 && !weekItem.sourceData[fldExplain])
    ) {
      if (scheduleUseFullname) {
        let label = `${t('student', { lng: source_lang })}:`;
        label += scheduleUseFullname ? '\u000A' : '/';
        label += `${t('assistant', { lng: source_lang })}:`;

        return label;
      }

      return t('studentAssistant', { lng: source_lang });
    }

    if (
      weekItem.sourceData[fldType] === 104 ||
      (weekItem.sourceData[fldType] === 126 && weekItem.sourceData[fldExplain])
    ) {
      return t('student', { lng: source_lang }) + ':';
    }

    return '';
  };

  const getLCPartSource = (weekItem, fldSrc, fldSrcOverride) => {
    if (weekItem.sourceData[fldSrcOverride] !== '') {
      return weekItem.sourceData[fldSrcOverride];
    }

    return weekItem.sourceData[fldSrc];
  };

  const getLCPartTime = (weekItem, fldTime, fldTimeOverride) => {
    if (weekItem.sourceData[fldTimeOverride] !== '') {
      return weekItem.sourceData[fldTimeOverride];
    }

    return weekItem.sourceData[fldTime];
  };

  const getAssignedLCPerson = (weekItem, fldPers, fldSrc) => {
    const noAssign = checkLCAssignments(weekItem.sourceData[fldSrc]);

    if (!noAssign) return weekItem.scheduleData[fldPers];

    return schedule_useFullname ? weekItem.scheduleData.chairmanMM_A_name : weekItem.scheduleData.chairmanMM_A_dispName;
  };

  const getCBSTime = (weekItem) => {
    if (weekItem.sourceData.mwb_lc_cbs_time_override !== '') {
      return weekItem.sourceData.mwb_lc_cbs_time_override;
    }

    return 30;
  };

  const getCOTalkTitle = (weekItem) => {
    if (weekItem.sourceData.mwb_co_talk_title !== '') {
      return weekItem.sourceData.mwb_co_talk_title;
    }

    return t('coTalk', { lng: source_lang });
  };

  const cbsLabel = (weekItem, scheduleUseFullname) => {
    let src = `${t('cbsConductor', { lng: source_lang, ns: 'source' })}:`;
    if (weekItem.scheduleData.cbs_reader_dispName && weekItem.scheduleData.cbs_reader_dispName !== '') {
      src += scheduleUseFullname ? '\u000A' : '/';
      src += `${t('cbsReader', { lng: source_lang, ns: 'source' })}:`;
    }

    return src;
  };

  const getAssignedCBS = (weekItem, scheduleUseFullname) => {
    let src = scheduleUseFullname
      ? weekItem.scheduleData.cbs_conductor_name
      : weekItem.scheduleData.cbs_conductor_dispName;
    if (weekItem.scheduleData.cbs_reader_dispName && weekItem.scheduleData.cbs_reader_dispName !== '') {
      src += scheduleUseFullname ? '\u000A' : '/';
      src += scheduleUseFullname ? weekItem.scheduleData.cbs_reader_name : weekItem.scheduleData.cbs_reader_dispName;
    }

    return src;
  };

  const getConcludingSong = (weekItem) => {
    let src = t('song', { lng: source_lang });

    if (weekItem.scheduleData.week_type === 2) {
      src += ` ${weekItem.sourceData.mwb_song_conclude_override}`;
      return src;
    }

    if (isNaN(weekItem.sourceData.mwb_song_conclude)) return weekItem.sourceData.mwb_song_conclude;

    src += ` ${weekItem.sourceData.mwb_song_conclude}`;
    return src;
  };

  const getWeekDate = (weekItem) => {
    let value = '';

    if (midweek_meeting_useExactDate) {
      value = weekItem.sourceData.meeting_date;
    }

    if (!midweek_meeting_useExactDate) {
      value = weekItem.sourceData.mwb_week_date_locale;
    }

    return value;
  };

  return (
    <>
      {data.length > 0 && currentSchedule.value !== '' && (
        <Document
          author="sws2apps"
          title={currentSchedule.value.replace('/', '-')}
          creator="Congregation Program for Everyone (CPE)"
          producer="sws2apps (by react-pdf)"
        >
          <Page size="A4" style={styles.body}>
            {/* S-140 Header */}
            <S140Header />

            {data.map((weekItem, weekIndex) => {
              let maxLc = [];
              if (weekItem.sourceData.mwb_lc_count_override) {
                maxLc = Array.from({ length: weekItem.sourceData.mwb_lc_count_override }, (a, b) => b + 1);
              } else {
                maxLc = Array.from({ length: weekItem.sourceData.mwb_lc_count }, (a, b) => b + 1);
              }

              return (
                <View
                  key={`week-${weekItem.week}`}
                  style={styles.weekContainer}
                  break={weekIndex === 2 || weekIndex === 4}
                >
                  <View style={styles.rowBase}>
                    <S140WeekTitle
                      title={`${getWeekDate(weekItem)} | ${weekItem.sourceData.mwb_weekly_bible_reading}`}
                    />
                    {!weekItem.scheduleData.noMMeeting && (
                      <>
                        <S140PartMiniLabel
                          part={`${t('chairmanMidweekMeeting', {
                            lng: source_lang,
                            ns: 'source',
                          })}:`}
                        />
                        <S140Person person={getAssignedChairman(weekItem, 'A', schedule_useFullname)} />
                      </>
                    )}
                  </View>
                  <View style={{ ...styles.rowBase, marginBottom: '10px' }}>
                    <S140WeekInfoLabel weekLabel={getWeekInfoLabel(weekItem)} />
                    {!weekItem.scheduleData.noMMeeting && (
                      <>
                        <S140PartMiniLabel
                          part={class_count === 2 ? `${t('auxClassCounselor', { lng: source_lang })}:` : ''}
                        />
                        <S140Person
                          person={class_count === 2 ? getAssignedChairman(weekItem, 'B', schedule_useFullname) : ''}
                        />
                      </>
                    )}
                  </View>
                  {!weekItem.scheduleData.noMMeeting && (
                    <>
                      {/* 3rd row for song, opening prayer */}
                      <View style={styles.rowBase}>
                        <S140Time time={weekItem.sourceData.pgmStart} />
                        <S140SourceSimple
                          source={`${t('song', { lng: source_lang })} ${weekItem.sourceData.mwb_song_first}`}
                          bulletColor={schedYear < 2024 ? '#656164' : '#2a6b77'}
                        />
                        <S140PartMiniLabel part={`${t('prayerMidweekMeeting', { lng: source_lang })}:`} />
                        <S140Person person={getAssignedOpeningPrayer(weekItem)} />
                      </View>

                      {/* 4th row for opening comments */}
                      <View style={styles.rowBase}>
                        <S140Time time={weekItem.sourceData.openingComments} />
                        <S140SourceExtended
                          source={t('openingComments', { lng: source_lang })}
                          time={`1 ${minLabel}`}
                          bulletColor={schedYear < 2024 ? '#656164' : '#2a6b77'}
                        />
                        <S140PartMiniLabel part="" />
                        <S140Person person="" />
                      </View>

                      {!weekItem.scheduleData.noMMeeting &&
                        weekItem.scheduleData.week_type !== 3 &&
                        weekItem.scheduleData.week_type !== 4 && (
                          <>
                            {/* TGW, Classroom heading */}
                            <S140MeetingPartHeading
                              meetingPart={'treasuresPart'}
                              backgroundColor={schedYear < 2024 ? '#656164' : '#2a6b77'}
                              classroomHeading={true}
                              weekItem={weekItem}
                            />

                            {/* TGW Talk */}
                            <View style={styles.rowBase}>
                              <S140Time time={weekItem.sourceData.tgwTalk} />
                              <S140SourceExtended
                                source={weekItem.sourceData.mwb_tgw_talk}
                                time={`10 ${minLabel}`}
                                bulletColor={schedYear < 2024 ? '#656164' : '#2a6b77'}
                              />
                              <S140PartMiniLabel part="" />
                              <S140Person
                                person={
                                  schedule_useFullname
                                    ? weekItem.scheduleData.tgw_talk_name
                                    : weekItem.scheduleData.tgw_talk_dispName
                                }
                              />
                            </View>

                            {/* TGW Gems */}
                            <View style={styles.rowBase}>
                              <S140Time time={weekItem.sourceData.tgwGems} />
                              <S140SourceExtended
                                source={t('tgwGems', { lng: source_lang, ns: 'source' })}
                                time={`10 ${minLabel}`}
                                bulletColor={schedYear < 2024 ? '#656164' : '#2a6b77'}
                              />
                              <S140PartMiniLabel part="" />
                              <S140Person
                                person={
                                  schedule_useFullname
                                    ? weekItem.scheduleData.tgw_gems_name
                                    : weekItem.scheduleData.tgw_gems_dispName
                                }
                              />
                            </View>

                            {/* Bible Reading */}
                            <View style={styles.rowBase}>
                              <S140Time time={weekItem.sourceData.bibleReading} />
                              <S140SourceComplex
                                source={t('bibleReading', { lng: source_lang, ns: 'source' })}
                                time={`4 ${minLabel}`}
                                bulletColor={schedYear < 2024 ? '#656164' : '#2a6b77'}
                                partLabel={`${t('student', { lng: source_lang })}:`}
                              />
                              <S140Person
                                person={class_count === 1 ? '' : getAssignedBRead(weekItem, 'B', schedule_useFullname)}
                              />
                              <S140Person person={getAssignedBRead(weekItem, 'A', schedule_useFullname)} />
                            </View>

                            {/* AYF Heading */}
                            <S140MeetingPartHeading
                              meetingPart={'applyFieldMinistryPart'}
                              backgroundColor={'#a56803'}
                              classroomHeading={true}
                              weekItem={weekItem}
                            />

                            {/* AYF Parts */}
                            {[1, 2, 3, 4].map((index) => {
                              const fldTypeName = 'mwb_ayf_part' + index + '_type_name';
                              const fldType = 'mwb_ayf_part' + index + '_type';
                              const fldTime = 'mwb_ayf_part' + index + '_time';
                              const fldSrc = 'mwb_ayf_part' + index;
                              const fldExplain = 'mwb_ayf_part' + index + '_explainTalk';
                              const fldStuA = schedule_useFullname
                                ? 'ass' + index + '_stu_A_name'
                                : 'ass' + index + '_stu_A_dispName';
                              const fldAssA = schedule_useFullname
                                ? 'ass' + index + '_ass_A_name'
                                : 'ass' + index + '_ass_A_dispName';
                              const fldStuB = schedule_useFullname
                                ? 'ass' + index + '_stu_B_name'
                                : 'ass' + index + '_stu_B_dispName';
                              const fldAssB = schedule_useFullname
                                ? 'ass' + index + '_ass_B_name'
                                : 'ass' + index + '_ass_B_dispName';
                              const fldAyfPart = 'ayf' + index;

                              return (
                                <View key={`ayf-${index}`}>
                                  {weekItem.sourceData[fldType] !== '' && (
                                    <View style={{ ...styles.rowBase, marginBottom: '2px' }}>
                                      <S140Time time={weekItem.sourceData[fldAyfPart]} />
                                      <S140SourceComplex
                                        source={getAYFType(weekItem, fldType, fldSrc, fldTypeName)}
                                        time={getAYFDuration(weekItem, fldType, fldTime)}
                                        bulletColor="#a56803"
                                        partLabel={ayfLabel(weekItem, fldType, schedule_useFullname, fldExplain)}
                                      />
                                      <S140Person
                                        person={
                                          class_count === 1
                                            ? ''
                                            : getAssignedAYFPerson(
                                                weekItem,
                                                fldType,
                                                fldStuB,
                                                fldAssB,
                                                'B',
                                                schedule_useFullname
                                              )
                                        }
                                      />
                                      <S140Person
                                        person={getAssignedAYFPerson(
                                          weekItem,
                                          fldType,
                                          fldStuA,
                                          fldAssA,
                                          'A',
                                          schedule_useFullname
                                        )}
                                      />
                                    </View>
                                  )}
                                </View>
                              );
                            })}

                            {/* LC Heading */}
                            <S140MeetingPartHeading
                              meetingPart={'livingPart'}
                              backgroundColor={'#942926'}
                              classroomHeading={false}
                              weekItem={weekItem}
                            />

                            {/* Middle Song */}
                            <View style={styles.rowBase}>
                              <S140Time time={weekItem.sourceData.middleSong} />
                              <S140SourceSimple
                                source={`${t('song', { lng: source_lang })} ${weekItem.sourceData.mwb_song_middle}`}
                                bulletColor="#942926"
                              />
                              <S140PartMiniLabel part="" />
                              <S140Person person="" />
                            </View>

                            {/* LC Parts */}
                            {maxLc.map((index) => {
                              const fldTime = 'mwb_lc_part' + index + '_time';
                              const fldTimeOverride = 'mwb_lc_part' + index + '_time_override';
                              const fldSrc = 'mwb_lc_part' + index;
                              const fldSrcOverride = 'mwb_lc_part' + index + '_override';
                              const fldPers = schedule_useFullname
                                ? 'lc_part' + index + '_name'
                                : 'lc_part' + index + '_dispName';
                              const fldLcPart = 'lc' + index;

                              return (
                                <View key={`lc-${index}`}>
                                  {(weekItem.sourceData[fldSrc] !== '' ||
                                    weekItem.sourceData[fldSrcOverride] !== '') && (
                                    <View style={styles.rowBase}>
                                      <S140Time time={weekItem.sourceData[fldLcPart]} />
                                      <S140SourceExtended
                                        source={getLCPartSource(weekItem, fldSrc, fldSrcOverride)}
                                        time={`${getLCPartTime(weekItem, fldTime, fldTimeOverride)} ${minLabel}`}
                                        bulletColor="#942926"
                                      />
                                      <S140PartMiniLabel part="" />
                                      <S140Person person={getAssignedLCPerson(weekItem, fldPers, fldSrc)} />
                                    </View>
                                  )}
                                </View>
                              );
                            })}

                            {/* When CO visits: Concluding Comments */}
                            {weekItem.scheduleData.week_type === 2 && (
                              <>
                                {/* Concluding Comments */}
                                <View style={styles.rowBase}>
                                  <S140Time time={weekItem.sourceData.concludingComments} />
                                  <S140SourceExtended
                                    source={t('concludingComments', { lng: source_lang })}
                                    time={`3 ${minLabel}`}
                                    bulletColor="#942926"
                                  />
                                  <S140PartMiniLabel part="" />
                                  <S140Person
                                    person={
                                      schedule_useFullname
                                        ? weekItem.scheduleData.chairmanMM_A_name
                                        : weekItem.scheduleData.chairmanMM_A_dispName
                                    }
                                  />
                                </View>

                                {/* Talk by CO */}
                                <View style={styles.rowBase}>
                                  <S140Time time={weekItem.sourceData.coTalk} />
                                  <S140SourceExtended
                                    source={getCOTalkTitle(weekItem)}
                                    time={`30 ${minLabel}`}
                                    bulletColor="#942926"
                                  />
                                  <S140PartMiniLabel part="" />
                                  <S140Person
                                    person={schedule_useFullname ? Setting.co_name : Setting.co_displayName}
                                  />
                                </View>
                              </>
                            )}

                            {/* Normal Week */}
                            {weekItem.scheduleData.week_type === 1 && (
                              <>
                                {/* CBS */}
                                <View style={{ ...styles.rowBase, marginBottom: '3px' }}>
                                  <S140Time time={weekItem.sourceData.cbs} />
                                  <S140SourceExtended
                                    source={t('cbs', { lng: source_lang })}
                                    time={`${getCBSTime(weekItem)} ${minLabel}`}
                                    bulletColor="#942926"
                                  />
                                  <S140PartMiniLabel part={cbsLabel(weekItem, schedule_useFullname)} />
                                  <S140Person person={getAssignedCBS(weekItem, schedule_useFullname)} />
                                </View>

                                {/* Concluding Comments */}
                                <View style={styles.rowBase}>
                                  <S140Time time={weekItem.sourceData.concludingComments} />
                                  <S140SourceExtended
                                    source={t('concludingComments', { lng: source_lang })}
                                    time={`3 ${minLabel}`}
                                    bulletColor="#942926"
                                  />
                                  <S140PartMiniLabel part="" />
                                  <S140Person
                                    person={
                                      schedule_useFullname
                                        ? weekItem.scheduleData.chairmanMM_A_name
                                        : weekItem.scheduleData.chairmanMM_A_dispName
                                    }
                                  />
                                </View>
                              </>
                            )}

                            {/* Concluding Song, Prayer */}
                            <View style={styles.rowBase}>
                              <S140Time time={weekItem.sourceData.pgmEnd} />
                              <S140SourceSimple source={getConcludingSong(weekItem)} bulletColor="#942926" />
                              <S140PartMiniLabel part={`${t('prayerMidweekMeeting', { lng: source_lang })}:`} />
                              <S140Person
                                person={
                                  schedule_useFullname
                                    ? weekItem.scheduleData.closing_prayerMM_name
                                    : weekItem.scheduleData.closing_prayerMM_dispName
                                }
                              />
                            </View>
                          </>
                        )}
                    </>
                  )}
                </View>
              );
            })}
          </Page>
        </Document>
      )}
    </>
  );
};

export default S140;
