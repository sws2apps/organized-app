import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import html2pdf from 'html2pdf.js';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Typography from '@mui/material/Typography';
import { monthNamesState, rootModalOpenState, sourceLangState } from '../states/main';
import { currentScheduleState } from '../states/schedule';
import { classCountState, congNameState, congNumberState } from '../states/congregation';
import { dbGetScheduleForPrint } from '../indexedDb/dbAssignment';
import {
  S140AssignedPerson,
  S140MeetingPartHeading,
  S140MeetingPartText,
  S140MeetingTime,
  S140PartMiniLabel,
  S140ScheduleHeading,
} from '../features/schedules';

const S140 = () => {
  let navigate = useNavigate();

  const { t } = useTranslation('source');

  const setRootModalOpen = useSetRecoilState(rootModalOpenState);

  const currentSchedule = useRecoilValue(currentScheduleState);
  const classCount = useRecoilValue(classCountState);
  const congName = useRecoilValue(congNameState);
  const congNumber = useRecoilValue(congNumberState);
  const monthNames = useRecoilValue(monthNamesState);
  const sourceLang = useRecoilValue(sourceLangState);

  const [data, setData] = useState([]);

  const savePDF = () => {
    const element = document.getElementById('schedule_template');
    const opt = {
      margin: [0.2, 0.5, 0.2, 0.5],
      filename: `${currentSchedule.value.replace('/', '-')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(element).save();
  };

  const getWeekInfoLabel = (weekItem) => {
    if (weekItem.scheduleData.week_type !== 1) return weekItem.scheduleData.week_type_name.toUpperCase();
    if (weekItem.scheduleData.noMeeting) return t('noMeeting', { lng: sourceLang });
    return '';
  };

  const ayfLabel = (weekItem, fldType) => {
    if (
      weekItem.sourceData[fldType] === 101 ||
      weekItem.sourceData[fldType] === 102 ||
      weekItem.sourceData[fldType] === 103 ||
      weekItem.sourceData[fldType] === 108 ||
      (weekItem.sourceData[fldType] >= 140 && weekItem.sourceData[fldType] < 170) ||
      (weekItem.sourceData[fldType] >= 170 && weekItem.sourceData[fldType] < 200)
    ) {
      return t('studentAssistant', { lng: sourceLang });
    }

    if (weekItem.sourceData[fldType] === 104) {
      return t('student', { lng: sourceLang }) + ':';
    }

    return '';
  };

  const getAssignedAYFPerson = (weekItem, fldType, fldStu, fldAss, stuClass) => {
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
        src += `/${weekItem.scheduleData[fldAss]}`;
      }

      return src;
    }

    if (
      weekItem.sourceData[fldType] === 105 ||
      weekItem.sourceData[fldType] === 106 ||
      weekItem.sourceData[fldType] === 107 ||
      weekItem.sourceData[fldType] === 117
    ) {
      return stuClass === 'A'
        ? weekItem.scheduleData.chairmanMM_A_dispName
        : weekItem.scheduleData.chairmanMM_B_dispName;
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
      return t('partLessTime', { duration: weekItem.sourceData[fldTime], lng: sourceLang });
    }
  };

  const cbsLabel = (weekItem) => {
    let src = t('cbsConductor', { lng: sourceLang });
    if (weekItem.scheduleData.cbs_reader_dispName && weekItem.scheduleData.cbs_reader_dispName !== '') {
      src += `/${t('cbsReader', { lng: sourceLang })}`;
    }

    return `${src}:`;
  };

  const getAssignedCBS = (weekItem) => {
    let src = weekItem.scheduleData.cbs_conductor_dispName;
    if (weekItem.scheduleData.cbs_reader_dispName && weekItem.scheduleData.cbs_reader_dispName !== '') {
      src += `/${weekItem.scheduleData.cbs_reader_dispName}`;
    }

    return src;
  };

  const getConcludingSong = (weekItem) => {
    let src = t('song', { lng: sourceLang });

    if (weekItem.scheduleData.week_type === 2) {
      src += ` ${weekItem.sourceData.songConclude_src_override}`;
      return src;
    }

    if (isNaN(weekItem.sourceData.songConclude_src)) return weekItem.sourceData.songConclude_src;

    src += ` ${weekItem.sourceData.songConclude_src}`;
    return src;
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

    return t('coTalk', { lng: sourceLang });
  };

  useEffect(() => {
    const getData = async () => {
      setRootModalOpen(true);

      const data = await dbGetScheduleForPrint(currentSchedule.value);

      setData(data);
      setRootModalOpen(false);
    };

    if (currentSchedule === '' || currentSchedule.value?.length === '') {
      navigate('/schedules');
    } else {
      getData();
    }
  }, [navigate, currentSchedule, monthNames, setRootModalOpen]);

  return (
    <>
      {data.length > 0 && (
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveAltIcon />}
            sx={{ margin: '0 2px 20px 0' }}
            onClick={savePDF}
          >
            PDF
          </Button>
          <Box
            sx={{
              width: '800px',
              overflow: 'auto',
              padding: '20px',
              backgroundColor: 'white',
            }}
          >
            <Box id="schedule_template">
              {data.map((weekItem, weekIndex) => {
                let maxLc = [];
                if (weekItem.sourceData.lcCount_override) {
                  maxLc = Array.from({ length: weekItem.sourceData.lcCount_override }, (a, b) => b + 1);
                } else {
                  maxLc = Array.from({ length: weekItem.sourceData.lcCount }, (a, b) => b + 1);
                }

                return (
                  <Box key={`week-${weekItem.week}`}>
                    {(weekIndex === 0 || weekIndex === 2 || weekIndex === 4) && (
                      <Box>
                        <S140ScheduleHeading
                          congName={congName}
                          congNumber={congNumber}
                          midweekMeetingPrint={t('midweekMeetingPrint', { lng: sourceLang })}
                        />
                      </Box>
                    )}
                    <Box sx={{ marginBottom: '30px' }}>
                      {/* First row for date, bible reading, chairman */}
                      <Box sx={{ display: 'flex', marginBottom: '3px' }}>
                        <Typography
                          sx={{
                            fontWeight: 'bold',
                            fontSize: '13px',
                            color: 'black',
                            textTransform: 'uppercase',
                            width: '440px',
                          }}
                        >
                          {`${weekItem.sourceData.weekDate_src} | ${weekItem.sourceData.weeklyBibleReading_src}`}
                        </Typography>
                        {!weekItem.scheduleData.noMeeting && (
                          <>
                            <S140PartMiniLabel
                              align="right"
                              label={`${t('chairmanMidweekMeeting', { lng: sourceLang })}:`}
                              width="180px"
                            />
                            <S140AssignedPerson person={weekItem.scheduleData.chairmanMM_A_dispName} />
                          </>
                        )}
                      </Box>

                      {/* 2nd row for week type, auxiliary classroom counselor */}
                      <Box sx={{ display: 'flex' }}>
                        <Typography
                          sx={{
                            fontWeight: 'bold',
                            color: 'darkblue',
                            fontSize: '13px',
                            width: '440px',
                            lineHeight: '20px',
                            marginBottom: '5px',
                          }}
                        >
                          {getWeekInfoLabel(weekItem)}
                        </Typography>
                        {!weekItem.scheduleData.noMeeting && weekItem.scheduleData.week_type !== 2 && (
                          <>
                            <S140PartMiniLabel
                              align="right"
                              label={classCount === 2 ? `${t('auxClassCounselor', { lng: sourceLang })}:` : ''}
                              width="180px"
                            />
                            <S140AssignedPerson
                              person={classCount === 2 ? weekItem.scheduleData.chairmanMM_B_dispName : ''}
                            />
                          </>
                        )}
                      </Box>

                      {!weekItem.scheduleData.noMeeting && (
                        <>
                          {/* 3rd row for song, opening prayer */}
                          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                            <S140MeetingTime partTime={weekItem.sourceData.pgmStart} />
                            <S140MeetingPartText
                              partType="tgw"
                              partText={`${t('song', { lng: sourceLang })} ${weekItem.sourceData.songFirst_src}`}
                            />
                            <S140PartMiniLabel
                              align="right"
                              label={`${t('prayerMidweekMeeting', { lng: sourceLang })}:`}
                              width="180px"
                            />
                            <S140AssignedPerson person={weekItem.scheduleData.opening_prayer_dispName} />
                          </Box>

                          {/* 4th row for opening comments */}
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <S140MeetingTime partTime={weekItem.sourceData.openingComments} />
                            <S140MeetingPartText
                              partType="tgw"
                              partText={t('openingComments', { lng: sourceLang })}
                              partDuration="1 min."
                            />
                            <S140PartMiniLabel width="180px" />
                            <S140AssignedPerson person="" />
                          </Box>

                          {!weekItem.scheduleData.noMeeting &&
                            weekItem.scheduleData.week_type !== 3 &&
                            weekItem.scheduleData.week_type !== 4 && (
                              <>
                                {/* TGW, Classroom heading */}
                                <S140MeetingPartHeading
                                  meetingPart="treasuresPart"
                                  topLabel={true}
                                  bgColor="#656164"
                                  weekType={weekItem.scheduleData.week_type}
                                />

                                {/* TGW Talk */}
                                <Box sx={{ display: 'flex', marginBottom: '2px' }}>
                                  <S140MeetingTime partTime={weekItem.sourceData.tgwTalk} />
                                  <S140MeetingPartText
                                    partType="tgw"
                                    partText={weekItem.sourceData.tgwTalk_src}
                                    partDuration="10 min."
                                  />
                                  <S140PartMiniLabel width="180px" />
                                  <S140AssignedPerson person={weekItem.scheduleData.tgw_talk_dispName} />
                                </Box>

                                {/* TGW Gems */}
                                <Box sx={{ display: 'flex', marginBottom: '2px' }}>
                                  <S140MeetingTime partTime={weekItem.sourceData.tgwGems} />
                                  <S140MeetingPartText
                                    partType="tgw"
                                    partText={t('tgwGems', { lng: sourceLang })}
                                    partDuration="10 min."
                                  />
                                  <S140PartMiniLabel width="180px" />
                                  <S140AssignedPerson person={weekItem.scheduleData.tgw_gems_dispName} />
                                </Box>

                                {/* Bible Reading */}
                                <Box sx={{ display: 'flex' }}>
                                  <S140MeetingTime partTime={weekItem.sourceData.bibleReading} />
                                  <S140MeetingPartText
                                    partType="tgw"
                                    partText={t('bibleReading', { lng: sourceLang })}
                                    partDuration={t('bibleReadingTime', { lng: sourceLang })}
                                    partMiniLabel={`${t('student', { lng: sourceLang })}:`}
                                  />
                                  <S140AssignedPerson
                                    person={classCount === 1 ? '' : weekItem.scheduleData.bRead_stu_B_dispName}
                                  />
                                  <S140AssignedPerson person={weekItem.scheduleData.bRead_stu_A_dispName} />
                                </Box>

                                {/* AYF Heading */}
                                <S140MeetingPartHeading
                                  meetingPart="applyFieldMinistryPart"
                                  topLabel={true}
                                  bgColor="#a56803"
                                  weekType={weekItem.scheduleData.week_type}
                                />

                                {/* AYF Parts */}
                                {[1, 2, 3, 4].map((index) => {
                                  const fldTypeName = 'ass' + index + '_type_name';
                                  const fldType = 'ass' + index + '_type';
                                  const fldTime = 'ass' + index + '_time';
                                  const fldSrc = 'ass' + index + '_src';
                                  const fldStuA = 'ass' + index + '_stu_A_dispName';
                                  const fldAssA = 'ass' + index + '_ass_A_dispName';
                                  const fldStuB = 'ass' + index + '_stu_B_dispName';
                                  const fldAssB = 'ass' + index + '_ass_B_dispName';
                                  const fldAyfPart = 'ayf' + index;

                                  return (
                                    <Box key={`ayf-${index}`}>
                                      {weekItem.sourceData[fldType] !== '' && (
                                        <Box sx={{ display: 'flex', marginBottom: '2px' }}>
                                          <S140MeetingTime partTime={weekItem.sourceData[fldAyfPart]} />
                                          <S140MeetingPartText
                                            partType="ayf"
                                            partText={getAYFType(weekItem, fldType, fldSrc, fldTypeName)}
                                            partDuration={getAYFDuration(weekItem, fldType, fldTime)}
                                            partMiniLabel={ayfLabel(weekItem, fldType)}
                                          />
                                          <S140AssignedPerson
                                            person={
                                              classCount === 2 &&
                                              getAssignedAYFPerson(weekItem, fldType, fldStuB, fldAssB, 'B')
                                            }
                                          />
                                          <S140AssignedPerson
                                            person={getAssignedAYFPerson(weekItem, fldType, fldStuA, fldAssA, 'A')}
                                          />
                                        </Box>
                                      )}
                                    </Box>
                                  );
                                })}

                                {/* LC Heading */}
                                <S140MeetingPartHeading meetingPart="livingPart" topLabel={false} bgColor="#942926" />

                                {/* Middle Song */}
                                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
                                  <S140MeetingTime partTime={weekItem.sourceData.middleSong} />
                                  <S140MeetingPartText
                                    partType="lc"
                                    partText={`${t('song', { lng: sourceLang })} ${weekItem.sourceData.songMiddle_src}`}
                                  />
                                  <S140PartMiniLabel width="180px" />
                                  <S140AssignedPerson person="" />
                                </Box>

                                {/* LC Parts */}
                                {maxLc.map((index) => {
                                  const fldTime = 'lcPart' + index + '_time';
                                  const fldTimeOverride = 'lcPart' + index + '_time_override';
                                  const fldSrc = 'lcPart' + index + '_src';
                                  const fldSrcOverride = 'lcPart' + index + '_src_override';
                                  const fldPers = 'lc_part' + index + '_dispName';
                                  const fldLcPart = 'lc' + index;

                                  return (
                                    <Box key={`lc-${index}`}>
                                      {weekItem.sourceData[fldSrc] !== '' && (
                                        <Box sx={{ display: 'flex', marginBottom: '2px' }}>
                                          <S140MeetingTime partTime={weekItem.sourceData[fldLcPart]} />
                                          <S140MeetingPartText
                                            partType="lc"
                                            partText={getLCPartSource(weekItem, fldSrc, fldSrcOverride)}
                                            partDuration={`${getLCPartTime(weekItem, fldTime, fldTimeOverride)} min.`}
                                          />
                                          <S140PartMiniLabel width="180px" />
                                          <S140AssignedPerson person={weekItem.scheduleData[fldPers]} />
                                        </Box>
                                      )}
                                    </Box>
                                  );
                                })}

                                {/* When CO visits: Concluding Comments */}
                                {weekItem.scheduleData.week_type === 2 && (
                                  <>
                                    {/* Concluding Comments */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
                                      <S140MeetingTime partTime={weekItem.sourceData.concludingComments} />
                                      <S140MeetingPartText
                                        partType="lc"
                                        partText={t('concludingComments', { lng: sourceLang })}
                                        partDuration="3 min."
                                      />
                                      <S140PartMiniLabel width="180px" />
                                      <S140AssignedPerson person={weekItem.scheduleData.chairmanMM_A_dispName} />
                                    </Box>

                                    {/* Talk by CO */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
                                      <S140MeetingTime partTime={weekItem.sourceData.coTalk} />
                                      <S140MeetingPartText
                                        partType="lc"
                                        partText={getCOTalkTitle(weekItem)}
                                        partDuration="30 min."
                                      />
                                      <S140PartMiniLabel width="180px" />
                                      <S140AssignedPerson person={weekItem.scheduleData.co_displayName} />
                                    </Box>
                                  </>
                                )}

                                {/* Normal Week */}
                                {weekItem.scheduleData.week_type === 1 && (
                                  <>
                                    {/* CBS */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
                                      <S140MeetingTime partTime={weekItem.sourceData.cbs} />
                                      <S140MeetingPartText
                                        partType="lc"
                                        partText={t('cbs', { lng: sourceLang })}
                                        partDuration={`${getCBSTime(weekItem)} min.`}
                                      />
                                      <S140PartMiniLabel align="right" label={cbsLabel(weekItem)} width="180px" />
                                      <S140AssignedPerson person={getAssignedCBS(weekItem)} />
                                    </Box>

                                    {/* Concluding Comments */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
                                      <S140MeetingTime partTime={weekItem.sourceData.concludingComments} />
                                      <S140MeetingPartText
                                        partType="lc"
                                        partText={t('concludingComments', { lng: sourceLang })}
                                        partDuration="3 min."
                                      />
                                      <S140PartMiniLabel width="180px" />
                                      <S140AssignedPerson person={weekItem.scheduleData.chairmanMM_A_dispName} />
                                    </Box>
                                  </>
                                )}

                                {/* Concluding Song, Prayer */}
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <S140MeetingTime partTime={weekItem.sourceData.pgmEnd} />
                                  <S140MeetingPartText partType="lc" partText={getConcludingSong(weekItem)} />
                                  <S140PartMiniLabel
                                    align="right"
                                    label={`${t('prayerMidweekMeeting', { lng: sourceLang })}:`}
                                    width="180px"
                                  />
                                  <S140AssignedPerson person={weekItem.scheduleData.closing_prayer_dispName} />
                                </Box>
                              </>
                            )}
                        </>
                      )}
                    </Box>
                    {(weekIndex === 1 || weekIndex === 3) && <div className="html2pdf__page-break"></div>}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default S140;
