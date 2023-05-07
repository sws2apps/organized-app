import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Document, Font, Page, StyleSheet, Text, View, usePDF } from '@react-pdf/renderer';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Typography from '@mui/material/Typography';
import WaitingPage from '../components/WaitingPage';
import { Setting } from '../classes/Setting';
import RobotoBold from '../fonts/Roboto-Bold.ttf';
import RobotoRegular from '../fonts/Roboto-Regular.ttf';
import { WeekTypeList } from '../classes/WeekType';
import { checkLCAssignments } from '../utils/sourceMaterial';

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

const S140MainView = ({ data, currentSchedule }) => {
  const { t } = useTranslation('source');

  const { cong_name, cong_number, source_lang, schedule_useFullname, class_count } = Setting;

  const midweekMeetingPrint = t('midweekMeetingPrint', { lng: source_lang });

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

  const getWeekInfoLabel = (weekItem) => {
    if (weekItem.scheduleData.week_type !== 1) {
      return WeekTypeList.getLabel(weekItem.scheduleData.week_type);
    }

    if (weekItem.scheduleData.noMeeting) return t('noMeeting', { lng: source_lang });

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
      (weekItem.sourceData[fldType] >= 170 && weekItem.sourceData[fldType] < 200)
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
    return weekItem.sourceData[fldTypeName];
  };

  const getAYFDuration = (weekItem, fldType, fldTime) => {
    if (
      weekItem.sourceData[fldType] === 105 ||
      weekItem.sourceData[fldType] === 106 ||
      weekItem.sourceData[fldType] === 107 ||
      weekItem.sourceData[fldType] === 117
    ) {
      return `${weekItem.sourceData[fldTime]} min.`;
    }

    if (
      weekItem.sourceData[fldType] === 101 ||
      weekItem.sourceData[fldType] === 102 ||
      weekItem.sourceData[fldType] === 103 ||
      weekItem.sourceData[fldType] === 104 ||
      weekItem.sourceData[fldType] === 108 ||
      (weekItem.sourceData[fldType] >= 140 && weekItem.sourceData[fldType] < 170) ||
      (weekItem.sourceData[fldType] >= 170 && weekItem.sourceData[fldType] < 200)
    ) {
      return t('partLessTime', { duration: weekItem.sourceData[fldTime], lng: source_lang });
    }
  };

  const ayfLabel = (weekItem, fldType, scheduleUseFullname) => {
    if (
      weekItem.sourceData[fldType] === 101 ||
      weekItem.sourceData[fldType] === 102 ||
      weekItem.sourceData[fldType] === 103 ||
      weekItem.sourceData[fldType] === 108 ||
      (weekItem.sourceData[fldType] >= 140 && weekItem.sourceData[fldType] < 170) ||
      (weekItem.sourceData[fldType] >= 170 && weekItem.sourceData[fldType] < 200)
    ) {
      if (scheduleUseFullname) {
        let label = `${t('student', { lng: source_lang })}:`;
        label += scheduleUseFullname ? '\u000A' : '/';
        label += `${t('assistant', { lng: source_lang })}:`;

        return label;
      }

      return t('studentAssistant', { lng: source_lang });
    }

    if (weekItem.sourceData[fldType] === 104) {
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
    if (weekItem.sourceData.cbs_time_override !== '') {
      return weekItem.sourceData.cbs_time_override;
    }

    return 30;
  };

  const getCOTalkTitle = (weekItem) => {
    if (weekItem.sourceData.co_talk_title !== '') {
      return weekItem.sourceData.co_talk_title;
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
      src += ` ${weekItem.sourceData.songConclude_src_override}`;
      return src;
    }

    if (isNaN(weekItem.sourceData.songConclude_src)) return weekItem.sourceData.songConclude_src;

    src += ` ${weekItem.sourceData.songConclude_src}`;
    return src;
  };

  return (
    <Document
      author="sws2apps"
      title={currentSchedule.value.replace('/', '-')}
      creator="Congregation Program for Everyone (CPE)"
      producer="sws2apps (by react-pdf)"
    >
      <Page size="A4" style={styles.body}>
        {/* S-140 Header */}
        <View style={styles.header} fixed>
          <Text>{`${cong_name.toUpperCase()} (${cong_number})`}</Text>
          <Text style={styles.headerMidweekMeeting}>{midweekMeetingPrint}</Text>
        </View>

        {data.map((weekItem, weekIndex) => {
          let maxLc = [];
          if (weekItem.sourceData.lcCount_override) {
            maxLc = Array.from({ length: weekItem.sourceData.lcCount_override }, (a, b) => b + 1);
          } else {
            maxLc = Array.from({ length: weekItem.sourceData.lcCount }, (a, b) => b + 1);
          }

          return (
            <View key={`week-${weekItem.week}`} style={styles.weekContainer} break={weekIndex === 2 || weekIndex === 4}>
              <View style={styles.rowBase}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: '11px',
                    color: 'black',
                    textTransform: 'uppercase',
                    width: '295px',
                  }}
                >
                  {`${weekItem.sourceData.weekDate_src} | ${weekItem.sourceData.weeklyBibleReading_src}`}
                </Text>
                {!weekItem.scheduleData.noMeeting && (
                  <>
                    <Text style={{ ...styles.miniLabelBase, textAlign: 'right', width: '130px' }}>
                      {`${t('chairmanMidweekMeeting', {
                        lng: source_lang,
                        ns: 'source',
                      })}:`}
                    </Text>
                    <Text style={styles.personLabel}>{getAssignedChairman(weekItem, 'A', schedule_useFullname)}</Text>
                  </>
                )}
              </View>
              <View style={{ ...styles.rowBase, marginBottom: '10px' }}>
                <Text style={styles.weekInfoLabel}>{getWeekInfoLabel(weekItem)}</Text>
                {!weekItem.scheduleData.noMeeting && (
                  <>
                    <Text style={{ ...styles.miniLabelBase, textAlign: 'right', width: '130px' }}>
                      {class_count === 2 ? `${t('auxClassCounselor', { lng: source_lang })}:` : ''}
                    </Text>
                    <Text style={styles.personLabel}>
                      {class_count === 2 ? getAssignedChairman(weekItem, 'B', schedule_useFullname) : ''}
                    </Text>
                  </>
                )}
              </View>
              {!weekItem.scheduleData.noMeeting && (
                <>
                  {/* 3rd row for song, opening prayer */}
                  <View style={styles.rowBase}>
                    <Text style={styles.meetingTimeLabel}>{weekItem.sourceData.pgmStart}</Text>
                    <View style={{ width: '270px', flexDirection: 'row', alignItems: 'flex-start', marginTop: '-1px' }}>
                      <Text style={{ ...styles.bulletPoint, color: '#656164' }}>{'\u2022'}</Text>
                      <Text style={styles.meetingPartText}>{`${t('song', { lng: source_lang })} ${
                        weekItem.sourceData.songFirst_src
                      }`}</Text>
                    </View>
                    <Text style={{ ...styles.miniLabelBase, textAlign: 'right', width: '130px' }}>
                      {`${t('prayerMidweekMeeting', { lng: source_lang })}:`}
                    </Text>
                    <Text style={styles.personLabel}>
                      {schedule_useFullname
                        ? weekItem.scheduleData.opening_prayer_name
                        : weekItem.scheduleData.opening_prayer_dispName}
                    </Text>
                  </View>

                  {/* 4th row for opening comments */}
                  <View style={styles.rowBase}>
                    <Text style={styles.meetingTimeLabel}>{weekItem.sourceData.openingComments}</Text>
                    <View style={{ width: '270px', flexDirection: 'row', alignItems: 'flex-start', marginTop: '-1px' }}>
                      <Text style={{ ...styles.bulletPoint, color: '#656164' }}>{'\u2022'}</Text>
                      <Text style={styles.meetingPartText}>
                        {t('openingComments', { lng: source_lang })} <Text style={{ fontSize: '8px' }}>(1 min.)</Text>
                      </Text>
                    </View>
                    <Text style={{ ...styles.miniLabelBase, width: '130px' }}></Text>
                    <Text style={styles.personLabel}></Text>
                  </View>

                  {!weekItem.scheduleData.noMeeting &&
                    weekItem.scheduleData.week_type !== 3 &&
                    weekItem.scheduleData.week_type !== 4 && (
                      <>
                        {/* TGW, Classroom heading */}
                        <View
                          style={{
                            ...styles.rowBase,
                            alignItems: 'flex-end',
                            justifyContent: 'flex-start',
                            marginBottom: '5px',
                          }}
                        >
                          <Text style={{ ...styles.meetingSectionText, backgroundColor: '#656164' }}>
                            {t('treasuresPart', { lng: source_lang })}
                          </Text>
                          <Text style={{ ...styles.miniLabelBase, width: '130px', padding: '0 10px' }}>
                            {class_count === 2 && weekItem.scheduleData.week_type !== 2
                              ? t('auxClass', { lng: source_lang })
                              : ''}
                          </Text>
                          <Text style={{ ...styles.miniLabelBase, width: '130px', padding: '0 10px' }}>
                            {t('mainHall', { lng: source_lang })}
                          </Text>
                        </View>

                        {/* TGW Talk */}
                        <View style={styles.rowBase}>
                          <Text style={styles.meetingTimeLabel}>{weekItem.sourceData.tgwTalk}</Text>
                          <View
                            style={{
                              width: '270px',
                              flexDirection: 'row',
                              alignItems: 'flex-start',
                              marginTop: '-1px',
                            }}
                          >
                            <Text style={{ ...styles.bulletPoint, color: '#656164' }}>{'\u2022'}</Text>
                            <Text style={styles.meetingPartText}>
                              {weekItem.sourceData.tgwTalk_src} <Text style={{ fontSize: '8px' }}>(10 min.)</Text>
                            </Text>
                          </View>
                          <Text style={{ ...styles.miniLabelBase, width: '130px' }}></Text>
                          <Text style={styles.personLabel}>
                            {schedule_useFullname
                              ? weekItem.scheduleData.tgw_talk_name
                              : weekItem.scheduleData.tgw_talk_dispName}
                          </Text>
                        </View>

                        {/* TGW Gems */}
                        <View style={styles.rowBase}>
                          <Text style={styles.meetingTimeLabel}>{weekItem.sourceData.tgwGems}</Text>
                          <View
                            style={{
                              width: '270px',
                              flexDirection: 'row',
                              alignItems: 'flex-start',
                              marginTop: '-1px',
                            }}
                          >
                            <Text style={{ ...styles.bulletPoint, color: '#656164' }}>{'\u2022'}</Text>
                            <Text style={styles.meetingPartText}>
                              {t('tgwGems', { lng: source_lang, ns: 'source' })}{' '}
                              <Text style={{ fontSize: '8px' }}>(10 min.)</Text>
                            </Text>
                          </View>
                          <Text style={{ ...styles.miniLabelBase, width: '130px' }}></Text>
                          <Text style={styles.personLabel}>
                            {schedule_useFullname
                              ? weekItem.scheduleData.tgw_gems_name
                              : weekItem.scheduleData.tgw_gems_dispName}
                          </Text>
                        </View>

                        {/* Bible Reading */}
                        <View style={styles.rowBase}>
                          <Text style={styles.meetingTimeLabel}>{weekItem.sourceData.bibleReading}</Text>
                          <View
                            style={{
                              width: '270px',
                              flexDirection: 'row',
                              alignItems: 'flex-start',
                              marginTop: '-1px',
                              justifyContent: 'space-between',
                            }}
                          >
                            <View style={{ flexDirection: 'row' }}>
                              <Text style={{ ...styles.bulletPoint, color: '#656164' }}>{'\u2022'}</Text>
                              <Text style={styles.meetingPartText}>
                                {t('bibleReading', { lng: source_lang, ns: 'source' })}{' '}
                                <Text style={{ fontSize: '8px' }}>(4 min.)</Text>
                              </Text>
                            </View>
                            <Text style={{ ...styles.miniLabelBase, marginTop: '3px', textAlign: 'right' }}>
                              {`${t('student', { lng: source_lang })}:`}
                            </Text>
                          </View>
                          <Text style={styles.personLabel}>
                            {class_count === 1 ? '' : getAssignedBRead(weekItem, 'B', schedule_useFullname)}
                          </Text>
                          <Text style={styles.personLabel}>
                            {getAssignedBRead(weekItem, 'A', schedule_useFullname)}
                          </Text>
                        </View>

                        {/* AYF Heading */}
                        <View
                          style={{
                            ...styles.rowBase,
                            alignItems: 'flex-end',
                            justifyContent: 'flex-start',
                            marginBottom: '5px',
                          }}
                        >
                          <Text style={{ ...styles.meetingSectionText, backgroundColor: '#a56803' }}>
                            {t('applyFieldMinistryPart', { lng: source_lang })}
                          </Text>
                          <Text style={{ ...styles.miniLabelBase, width: '130px', padding: '0 10px' }}>
                            {class_count === 2 && weekItem.scheduleData.week_type !== 2
                              ? t('auxClass', { lng: source_lang })
                              : ''}
                          </Text>
                          <Text style={{ ...styles.miniLabelBase, width: '130px', padding: '0 10px' }}>
                            {t('mainHall', { lng: source_lang })}
                          </Text>
                        </View>

                        {/* AYF Parts */}
                        {[1, 2, 3, 4].map((index) => {
                          const fldTypeName = 'ass' + index + '_type_name';
                          const fldType = 'ass' + index + '_type';
                          const fldTime = 'ass' + index + '_time';
                          const fldSrc = 'ass' + index + '_src';
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
                                  <Text style={styles.meetingTimeLabel}>{weekItem.sourceData[fldAyfPart]}</Text>
                                  <View
                                    style={{
                                      width: '270px',
                                      flexDirection: 'row',
                                      alignItems: 'flex-start',
                                      marginTop: '-1px',
                                      justifyContent: 'space-between',
                                    }}
                                  >
                                    <View style={{ flexDirection: 'row' }}>
                                      <Text style={{ ...styles.bulletPoint, color: '#a56803' }}>{'\u2022'}</Text>
                                      <Text style={styles.meetingPartText}>
                                        {getAYFType(weekItem, fldType, fldSrc, fldTypeName)}{' '}
                                        <Text style={{ fontSize: '8px' }}>{`(${getAYFDuration(
                                          weekItem,
                                          fldType,
                                          fldTime
                                        )})`}</Text>
                                      </Text>
                                    </View>
                                    <Text style={{ ...styles.miniLabelBase, marginTop: '3px', textAlign: 'right' }}>
                                      {ayfLabel(weekItem, fldType, schedule_useFullname)}
                                    </Text>
                                  </View>
                                  <Text style={styles.personLabel}>
                                    {class_count === 2 &&
                                      getAssignedAYFPerson(
                                        weekItem,
                                        fldType,
                                        fldStuB,
                                        fldAssB,
                                        'B',
                                        schedule_useFullname
                                      )}
                                  </Text>
                                  <Text style={styles.personLabel}>
                                    {getAssignedAYFPerson(
                                      weekItem,
                                      fldType,
                                      fldStuA,
                                      fldAssA,
                                      'A',
                                      schedule_useFullname
                                    )}
                                  </Text>
                                </View>
                              )}
                            </View>
                          );
                        })}

                        {/* LC Heading */}
                        <View
                          style={{
                            ...styles.rowBase,
                            alignItems: 'flex-end',
                            justifyContent: 'flex-start',
                            marginBottom: '5px',
                          }}
                        >
                          <Text style={{ ...styles.meetingSectionText, backgroundColor: '#942926' }}>
                            {t('livingPart', { lng: source_lang })}
                          </Text>
                          <Text style={{ ...styles.miniLabelBase, width: '130px' }}></Text>
                          <Text style={{ ...styles.miniLabelBase, width: '130px' }}></Text>
                        </View>

                        {/* Middle Song */}
                        <View style={styles.rowBase}>
                          <Text style={styles.meetingTimeLabel}>{weekItem.sourceData.middleSong}</Text>
                          <View
                            style={{
                              width: '270px',
                              flexDirection: 'row',
                              alignItems: 'flex-start',
                              marginTop: '-1px',
                            }}
                          >
                            <Text style={{ ...styles.bulletPoint, color: '#942926' }}>{'\u2022'}</Text>
                            <Text style={styles.meetingPartText}>
                              {`${t('song', { lng: source_lang })} ${weekItem.sourceData.songMiddle_src}`}
                            </Text>
                          </View>
                          <Text style={{ ...styles.miniLabelBase, width: '130px' }}></Text>
                          <Text style={styles.personLabel}></Text>
                        </View>

                        {/* LC Parts */}
                        {maxLc.map((index) => {
                          const fldTime = 'lcPart' + index + '_time';
                          const fldTimeOverride = 'lcPart' + index + '_time_override';
                          const fldSrc = 'lcPart' + index + '_src';
                          const fldSrcOverride = 'lcPart' + index + '_src_override';
                          const fldPers = schedule_useFullname
                            ? 'lc_part' + index + '_name'
                            : 'lc_part' + index + '_dispName';
                          const fldLcPart = 'lc' + index;

                          return (
                            <View key={`lc-${index}`}>
                              {(weekItem.sourceData[fldSrc] !== '' || weekItem.sourceData[fldSrcOverride] !== '') && (
                                <View style={styles.rowBase}>
                                  <Text style={styles.meetingTimeLabel}>{weekItem.sourceData[fldLcPart]}</Text>
                                  <View
                                    style={{
                                      width: '270px',
                                      flexDirection: 'row',
                                      alignItems: 'flex-start',
                                      marginTop: '-1px',
                                    }}
                                  >
                                    <Text style={{ ...styles.bulletPoint, color: '#942926' }}>{'\u2022'}</Text>
                                    <Text style={styles.meetingPartText}>
                                      {getLCPartSource(weekItem, fldSrc, fldSrcOverride)}{' '}
                                      <Text style={{ fontSize: '8px' }}>{`(${getLCPartTime(
                                        weekItem,
                                        fldTime,
                                        fldTimeOverride
                                      )} min.)`}</Text>
                                    </Text>
                                  </View>
                                  <Text style={styles.personLabel}></Text>
                                  <Text style={styles.personLabel}>
                                    {getAssignedLCPerson(weekItem, fldPers, fldSrc)}
                                  </Text>
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
                              <Text style={styles.meetingTimeLabel}>{weekItem.sourceData.concludingComments}</Text>
                              <View
                                style={{
                                  width: '270px',
                                  flexDirection: 'row',
                                  alignItems: 'flex-start',
                                  marginTop: '-1px',
                                }}
                              >
                                <Text style={{ ...styles.bulletPoint, color: '#942926' }}>{'\u2022'}</Text>
                                <Text style={styles.meetingPartText}>
                                  {t('concludingComments', { lng: source_lang })}{' '}
                                  <Text style={{ fontSize: '8px' }}>(3 min.)</Text>
                                </Text>
                              </View>
                              <Text style={styles.personLabel}></Text>
                              <Text style={styles.personLabel}>
                                {schedule_useFullname
                                  ? weekItem.scheduleData.chairmanMM_A_name
                                  : weekItem.scheduleData.chairmanMM_A_dispName}
                              </Text>
                            </View>

                            {/* Talk by CO */}
                            <View style={styles.rowBase}>
                              <Text style={styles.meetingTimeLabel}>{weekItem.sourceData.coTalk}</Text>
                              <View
                                style={{
                                  width: '270px',
                                  flexDirection: 'row',
                                  alignItems: 'flex-start',
                                  marginTop: '-1px',
                                }}
                              >
                                <Text style={{ ...styles.bulletPoint, color: '#942926' }}>{'\u2022'}</Text>
                                <Text style={styles.meetingPartText}>
                                  {getCOTalkTitle(weekItem)} <Text style={{ fontSize: '8px' }}>(30 min.)</Text>
                                </Text>
                              </View>
                              <Text style={styles.personLabel}></Text>
                              <Text style={styles.personLabel}>
                                {schedule_useFullname ? Setting.co_name : Setting.co_displayName}
                              </Text>
                            </View>
                          </>
                        )}

                        {/* Normal Week */}
                        {weekItem.scheduleData.week_type === 1 && (
                          <>
                            {/* CBS */}
                            <View style={{ ...styles.rowBase, marginBottom: '3px' }}>
                              <Text style={styles.meetingTimeLabel}>{weekItem.sourceData.cbs}</Text>
                              <View
                                style={{
                                  width: '270px',
                                  flexDirection: 'row',
                                  alignItems: 'flex-start',
                                  marginTop: '-1px',
                                }}
                              >
                                <Text style={{ ...styles.bulletPoint, color: '#942926' }}>{'\u2022'}</Text>
                                <Text style={styles.meetingPartText}>
                                  {t('cbs', { lng: source_lang })}{' '}
                                  <Text style={{ fontSize: '8px' }}>{`(${getCBSTime(weekItem)} min.)`}</Text>
                                </Text>
                              </View>
                              <Text
                                style={{
                                  ...styles.miniLabelBase,
                                  width: '130px',
                                  marginTop: '3px',
                                  textAlign: 'right',
                                }}
                              >
                                {cbsLabel(weekItem, schedule_useFullname)}
                              </Text>
                              <Text style={styles.personLabel}>{getAssignedCBS(weekItem, schedule_useFullname)}</Text>
                            </View>

                            {/* Concluding Comments */}
                            <View style={styles.rowBase}>
                              <Text style={styles.meetingTimeLabel}>{weekItem.sourceData.concludingComments}</Text>
                              <View
                                style={{
                                  width: '270px',
                                  flexDirection: 'row',
                                  alignItems: 'flex-start',
                                  marginTop: '-1px',
                                }}
                              >
                                <Text style={{ ...styles.bulletPoint, color: '#942926' }}>{'\u2022'}</Text>
                                <Text style={styles.meetingPartText}>
                                  {t('concludingComments', { lng: source_lang })}{' '}
                                  <Text style={{ fontSize: '8px' }}>(3 min.)</Text>
                                </Text>
                              </View>
                              <Text style={styles.personLabel}></Text>
                              <Text style={styles.personLabel}>
                                {schedule_useFullname
                                  ? weekItem.scheduleData.chairmanMM_A_name
                                  : weekItem.scheduleData.chairmanMM_A_dispName}
                              </Text>
                            </View>
                          </>
                        )}

                        {/* Concluding Song, Prayer */}
                        <View style={styles.rowBase}>
                          <Text style={styles.meetingTimeLabel}>{weekItem.sourceData.pgmEnd}</Text>
                          <View
                            style={{
                              width: '270px',
                              flexDirection: 'row',
                              alignItems: 'flex-start',
                              marginTop: '-1px',
                            }}
                          >
                            <Text style={{ ...styles.bulletPoint, color: '#942926' }}>{'\u2022'}</Text>
                            <Text style={styles.meetingPartText}>{getConcludingSong(weekItem)}</Text>
                          </View>
                          <Text style={{ ...styles.miniLabelBase, textAlign: 'right', width: '130px' }}>
                            {`${t('prayerMidweekMeeting', { lng: source_lang })}:`}
                          </Text>
                          <Text style={styles.personLabel}>
                            {schedule_useFullname
                              ? weekItem.scheduleData.closing_prayer_name
                              : weekItem.scheduleData.closing_prayer_dispName}
                          </Text>
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
  );
};

const S140Downloader = ({ url, currentSchedule }) => {
  const navigate = useNavigate();

  const { t } = useTranslation('ui');

  const downloadFile = () => {
    const link = document.createElement('a');
    link.download = currentSchedule.value.replace('/', '-');
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    navigate('/schedules');
  };

  return (
    <Box>
      <Typography>{t('pdfGenerationComplete')}</Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<SaveAltIcon />}
        sx={{ margin: '10px 2px 2px 0' }}
        onClick={downloadFile}
      >
        PDF
      </Button>
    </Box>
  );
};

const S140Previewer = ({ data, currentSchedule }) => {
  const [instance] = usePDF({ document: <S140MainView data={data} currentSchedule={currentSchedule} /> });

  return (
    <Box>
      {(instance.url === null || instance.loading) && <WaitingPage />}
      {!instance.loading && <S140Downloader url={instance?.url} currentSchedule={currentSchedule} />}
    </Box>
  );
};

export default S140Previewer;
