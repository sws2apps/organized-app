import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import html2pdf from 'html2pdf.js';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Typography from '@mui/material/Typography';
import { monthNamesState, rootModalOpenState } from '../states/main';
import { currentScheduleState } from '../states/schedule';
import { classCountState, congNameState, congNumberState } from '../states/congregation';
import { dbGetScheduleForPrint } from '../indexedDb/dbAssignment';

const styles = {
  partTime: {
    fontWeight: 'bold',
    color: '#424949',
    fontSize: '11px',
    lineHeight: '20px',
    width: '40px',
  },
  assignedPers: {
    color: 'black',
    fontSize: '12px',
    padding: '0 0 0 8px',
    width: '180px',
    lineHeight: '20px',
  },
};

const S140 = () => {
  let navigate = useNavigate();
  const { t } = useTranslation();

  const setRootModalOpen = useSetRecoilState(rootModalOpenState);

  const currentSchedule = useRecoilValue(currentScheduleState);
  const classCount = useRecoilValue(classCountState);
  const congName = useRecoilValue(congNameState);
  const congNumber = useRecoilValue(congNumberState);
  const monthNames = useRecoilValue(monthNamesState);

  const [data, setData] = useState([]);

  const savePDF = () => {
    const element = document.getElementById('schedule_template');
    var opt = {
      margin: [0.2, 0.5, 0.2, 0.5],
      filename: `${currentSchedule.value.replace('/', '-')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(element).save();
  };

  const ScheduleHeading = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderBottom: '3px solid black',
          paddingBottom: '2px',
          marginBottom: '20px',
        }}
      >
        <Typography
          sx={{
            fontWeight: 'bold',
            fontSize: '13px',
            color: 'black',
          }}
        >
          {congName !== '' && congNumber !== '' ? `${congName.toUpperCase()} (${congNumber})` : ''}
        </Typography>
        <Typography
          sx={{
            fontWeight: 'bold',
            fontSize: '19px',
            color: 'black',
          }}
        >
          {t('schedule.midweekMeetingPrint')}
        </Typography>
      </Box>
    );
  };

  useEffect(() => {
    const getData = async () => {
      setRootModalOpen(true);

      const data = await dbGetScheduleForPrint(currentSchedule.value);
      console.log(data);
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
              {data.map((weekItem, weekIndex) => (
                <Box key={`week-${weekItem.week}`}>
                  {(weekIndex === 0 || weekIndex === 2 || weekIndex === 4) && (
                    <Box>
                      <ScheduleHeading />
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
                      <Typography
                        align="right"
                        sx={{
                          color: '#424949',
                          fontSize: '9px',
                          fontWeight: 'bold',
                          width: '180px',
                          lineHeight: '20px',
                        }}
                      >
                        {`${t('global.chairmanMidweekMeeting')}:`}
                      </Typography>
                      <Typography sx={styles.assignedPers}>{weekItem.scheduleData.chairmanMM_A_dispName}</Typography>
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
                        {weekItem.scheduleData.noMeeting
                          ? t('sourceMaterial.noMeeting')
                          : weekItem.scheduleData.week_type !== 1
                          ? weekItem.scheduleData.week_type_name.toUpperCase()
                          : ''}
                      </Typography>
                      <Typography
                        align="right"
                        sx={{
                          color: '#424949',
                          fontSize: '9px',
                          fontWeight: 'bold',
                          width: '180px',
                          lineHeight: '20px',
                        }}
                      >
                        {classCount === 2 ? `${t('global.auxClassCounselor')}:` : ''}
                      </Typography>
                      <Typography sx={styles.assignedPers}>
                        {classCount === 2 ? weekItem.scheduleData.chairmanMM_B_dispName : ''}
                      </Typography>
                    </Box>

                    {/* 3rd row for song, opening prayer */}
                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                      <Typography sx={styles.partTime}>{weekItem.sourceData.pgmStart}</Typography>
                      <Box sx={{ lineHeight: '20px', width: '400px' }}>
                        <ul className="ulSchedule">
                          <li className="tgw">
                            <Typography
                              sx={{
                                fontSize: '13px',
                                color: 'black',
                                lineHeight: 1.2,
                              }}
                            >
                              {`${t('global.song')} ${weekItem.sourceData.songFirst_src}`}
                            </Typography>
                          </li>
                        </ul>
                      </Box>
                      <Typography
                        align="right"
                        sx={{
                          color: '#424949',
                          fontSize: '9px',
                          fontWeight: 'bold',
                          width: '180px',
                          lineHeight: '20px',
                        }}
                      >
                        {`${t('global.prayerMidweekMeeting')}:`}
                      </Typography>
                      <Typography sx={styles.assignedPers}>{weekItem.scheduleData.opening_prayer_dispName}</Typography>
                    </Box>

                    {/* 4th row for opening comments */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={styles.partTime}>{weekItem.sourceData.openingComments}</Typography>
                      <Box sx={{ lineHeight: '20px', width: '400px' }}>
                        <ul className="ulSchedule">
                          <li className="tgw">
                            <Typography
                              sx={{
                                fontSize: '13px',
                                color: 'black',
                                lineHeight: 1.2,
                              }}
                            >
                              {t('scheduleTemplate.openingComments')}{' '}
                              <span className="student-part-duration">(1 min.)</span>
                            </Typography>
                          </li>
                        </ul>
                      </Box>
                      <Typography sx={{ width: '180px' }}>{''}</Typography>
                      <Typography sx={{ width: '180px', lineHeight: '20px' }}>{''}</Typography>
                    </Box>

                    {!weekItem.scheduleData.noMeeting && weekItem.scheduleData.week_type !== 3 && (
                      <>
                        {/* TGW, Classroom heading */}
                        <Box sx={{ display: 'flex', margin: '8px 0 3px 0' }}>
                          <Typography
                            sx={{
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '12px',
                              padding: '0 0 0 6px',
                              backgroundColor: '#656164',
                              width: '440px',
                              lineHeight: '20px',
                              textTransform: 'uppercase',
                            }}
                          >
                            {t('global.treasuresPart')}
                          </Typography>
                          <Typography
                            sx={{
                              color: '#424949',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              padding: '0 0 0 8px',
                              width: '180px',
                              lineHeight: '20px',
                            }}
                          >
                            {classCount === 1 ? '' : t('global.auxClass')}
                          </Typography>
                          <Typography
                            sx={{
                              color: '#424949',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              padding: '0 0 0 8px',
                              width: '180px',
                              lineHeight: '20px',
                            }}
                          >
                            {t('global.mainHall')}
                          </Typography>
                        </Box>

                        {/* TGW Talk */}
                        <Box sx={{ display: 'flex', marginBottom: '2px' }}>
                          <Typography sx={styles.partTime}>{weekItem.sourceData.tgwTalk}</Typography>
                          <Box
                            sx={{
                              width: '400px',
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Box sx={{ lineHeight: '20px' }}>
                              <ul className="ulSchedule">
                                <li className="tgw">
                                  <Typography
                                    sx={{
                                      fontSize: '13px',
                                      color: 'black',
                                      lineHeight: 1.2,
                                    }}
                                  >
                                    {weekItem.sourceData.tgwTalk_src}{' '}
                                    <span className="student-part-duration">(10 min.)</span>
                                  </Typography>
                                </li>
                              </ul>
                            </Box>
                          </Box>
                          <Typography sx={{ width: '180px', lineHeight: '20px' }}>{''}</Typography>
                          <Typography sx={styles.assignedPers}>{weekItem.scheduleData.tgw_talk_dispName}</Typography>
                        </Box>

                        {/* TGW Gems */}
                        <Box sx={{ display: 'flex', marginBottom: '2px' }}>
                          <Typography sx={styles.partTime}>{weekItem.sourceData.tgwGems}</Typography>
                          <Box
                            sx={{
                              width: '400px',
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Box sx={{ lineHeight: '20px' }}>
                              <ul className="ulSchedule">
                                <li className="tgw">
                                  <Typography
                                    sx={{
                                      fontSize: '13px',
                                      color: 'black',
                                      lineHeight: 1.2,
                                    }}
                                  >
                                    {t('global.tgwGems')} <span className="student-part-duration">(10 min.)</span>
                                  </Typography>
                                </li>
                              </ul>
                            </Box>
                          </Box>
                          <Typography sx={{ width: '180px', lineHeight: '20px' }}>{''}</Typography>
                          <Typography sx={styles.assignedPers}>{weekItem.scheduleData.tgw_gems_dispName}</Typography>
                        </Box>

                        {/* Bible Reading */}
                        <Box sx={{ display: 'flex' }}>
                          <Typography sx={styles.partTime}>{weekItem.sourceData.bibleReading}</Typography>
                          <Box
                            sx={{
                              width: '400px',
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Box sx={{ lineHeight: '20px' }}>
                              <ul className="ulSchedule">
                                <li className="tgw">
                                  <Typography
                                    sx={{
                                      fontSize: '13px',
                                      color: 'black',
                                      lineHeight: 1.2,
                                    }}
                                  >
                                    {t('global.bibleReading')}
                                    <span className="student-part-duration">{t('global.bibleReadingTime')}</span>
                                  </Typography>
                                </li>
                              </ul>
                            </Box>
                            <Typography
                              sx={{
                                color: '#424949',
                                fontSize: '9px',
                                fontWeight: 'bold',
                                lineHeight: '20px',
                              }}
                            >
                              {t('global.student')}:
                            </Typography>
                          </Box>
                          <Typography sx={styles.assignedPers}>
                            {classCount === 1 ? '' : weekItem.scheduleData.bRead_stu_B_dispName}
                          </Typography>
                          <Typography sx={styles.assignedPers}>{weekItem.scheduleData.bRead_stu_A_dispName}</Typography>
                        </Box>

                        {/* AYF Heading */}
                        <Box sx={{ display: 'flex', margin: '8px 0 3px 0' }}>
                          <Typography
                            sx={{
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '12px',
                              padding: '0 0 0 6px',
                              backgroundColor: '#a56803',
                              width: '440px',
                              lineHeight: '20px',
                              textTransform: 'uppercase',
                            }}
                          >
                            {t('global.applyFieldMinistryPart')}
                          </Typography>
                          <Typography
                            sx={{
                              color: '#424949',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              padding: '0 0 0 8px',
                              width: '180px',
                              lineHeight: '20px',
                            }}
                          >
                            {classCount === 1 ? '' : t('global.auxClass')}
                          </Typography>
                          <Typography
                            sx={{
                              color: '#424949',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              padding: '0 0 0 8px',
                              width: '180px',
                              lineHeight: '20px',
                            }}
                          >
                            {t('global.mainHall')}
                          </Typography>
                        </Box>

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
                                  <Typography sx={styles.partTime}>{weekItem.sourceData[fldAyfPart]}</Typography>
                                  <Box
                                    sx={{
                                      width: '400px',
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        lineHeight: '20px',
                                      }}
                                    >
                                      <ul className="ulSchedule">
                                        <li className="ayf">
                                          <Typography
                                            sx={{
                                              fontSize: '13px',
                                              color: 'black',
                                              lineHeight: 1.3,
                                            }}
                                          >
                                            {weekItem.sourceData[fldType] === 107
                                              ? weekItem.sourceData[fldSrc]
                                              : weekItem.sourceData[fldTypeName]}
                                            <span className="student-part-duration">
                                              {(weekItem.sourceData[fldType] === 105 ||
                                                weekItem.sourceData[fldType] === 106 ||
                                                weekItem.sourceData[fldType] === 107) && (
                                                <>({weekItem.sourceData[fldTime]} min.)</>
                                              )}
                                              {(weekItem.sourceData[fldType] === 101 ||
                                                weekItem.sourceData[fldType] === 102 ||
                                                weekItem.sourceData[fldType] === 103 ||
                                                weekItem.sourceData[fldType] === 104) && (
                                                <>
                                                  (
                                                  {t('global.partLessTime', {
                                                    duration: weekItem.sourceData[fldTime],
                                                  })}
                                                  )
                                                </>
                                              )}
                                            </span>
                                          </Typography>
                                        </li>
                                      </ul>
                                    </Box>
                                    <Typography
                                      sx={{
                                        color: '#424949',
                                        fontSize: '9px',
                                        fontWeight: 'bold',
                                        lineHeight: '20px',
                                      }}
                                    >
                                      {weekItem.sourceData[fldType] === 101 ||
                                      weekItem.sourceData[fldType] === 102 ||
                                      weekItem.sourceData[fldType] === 103
                                        ? t('scheduleTemplate.studentAssistant')
                                        : weekItem.sourceData[fldType] === 105 ||
                                          weekItem.sourceData[fldType] === 106 ||
                                          weekItem.sourceData[fldType] === 107
                                        ? ''
                                        : t('global.student')}
                                    </Typography>
                                  </Box>
                                  <Typography sx={styles.assignedPers}>
                                    {classCount === 2 && (
                                      <>
                                        {(weekItem.sourceData[fldType] === 101 ||
                                          weekItem.sourceData[fldType] === 102 ||
                                          weekItem.sourceData[fldType] === 103 ||
                                          weekItem.sourceData[fldType] === 104) && (
                                          <>
                                            {weekItem.scheduleData[fldStuB]}
                                            {weekItem.scheduleData[fldAssB] === ''
                                              ? ''
                                              : `/${weekItem.scheduleData[fldAssB]}`}
                                          </>
                                        )}
                                        {weekItem.sourceData[fldType] === 105 ||
                                        weekItem.sourceData[fldType] === 106 ||
                                        weekItem.sourceData[fldType] === 107
                                          ? weekItem.scheduleData.chairmanMM_B_dispName
                                          : ''}
                                      </>
                                    )}
                                  </Typography>
                                  <Typography sx={styles.assignedPers}>
                                    <>
                                      {(weekItem.sourceData[fldType] === 101 ||
                                        weekItem.sourceData[fldType] === 102 ||
                                        weekItem.sourceData[fldType] === 103 ||
                                        weekItem.sourceData[fldType] === 104) && (
                                        <>
                                          {weekItem.scheduleData[fldStuA]}
                                          {weekItem.scheduleData[fldAssA] === ''
                                            ? ''
                                            : `/${weekItem.scheduleData[fldAssA]}`}
                                        </>
                                      )}
                                      {weekItem.sourceData[fldType] === 105 ||
                                      weekItem.sourceData[fldType] === 106 ||
                                      weekItem.sourceData[fldType] === 107
                                        ? weekItem.scheduleData.chairmanMM_A_dispName
                                        : ''}
                                    </>
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          );
                        })}

                        {/* LC Heading */}
                        <Box sx={{ display: 'flex', margin: '8px 0 3px 0' }}>
                          <Typography
                            sx={{
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '12px',
                              padding: '0 0 0 6px',
                              backgroundColor: '#942926',
                              width: '440px',
                              lineHeight: '20px',
                              textTransform: 'uppercase',
                            }}
                          >
                            {t('global.livingPart')}
                          </Typography>
                          <Typography
                            sx={{
                              color: '#424949',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              padding: '0 0 0 8px',
                              width: '180px',
                              lineHeight: '20px',
                            }}
                          >
                            {''}
                          </Typography>
                          <Typography
                            sx={{
                              color: '#424949',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              padding: '0 0 0 8px',
                              width: '180px',
                              lineHeight: '20px',
                            }}
                          >
                            {''}
                          </Typography>
                        </Box>

                        {/* Middle Song */}
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
                          <Typography sx={styles.partTime}>{weekItem.sourceData.middleSong}</Typography>
                          <Box sx={{ lineHeight: '20px', width: '400px' }}>
                            <ul className="ulSchedule">
                              <li className="lc">
                                <Typography
                                  sx={{
                                    fontSize: '13px',
                                    color: 'black',
                                    lineHeight: 1.2,
                                  }}
                                >
                                  {`${t('global.song')} ${weekItem.sourceData.songMiddle_src}`}
                                </Typography>
                              </li>
                            </ul>
                          </Box>
                          <Typography
                            align="right"
                            sx={{
                              color: '#424949',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              width: '180px',
                              lineHeight: '20px',
                            }}
                          >
                            {''}
                          </Typography>
                          <Typography
                            sx={{
                              color: 'black',
                              fontSize: '12px',
                              padding: '0 0 0 8px',
                              width: '180px',
                              lineHeight: '20px',
                            }}
                          >
                            {''}
                          </Typography>
                        </Box>

                        {/* LC Parts */}
                        {[1, 2].map((index) => {
                          const fldTime = 'lcPart' + index + '_time';
                          const fldSrc = 'lcPart' + index + '_src';
                          const fldPers = 'lc_part' + index + '_dispName';
                          const fldLcPart = 'lc' + index;

                          return (
                            <Box key={`lc-${index}`}>
                              {weekItem.sourceData[fldSrc] !== '' && (
                                <Box sx={{ display: 'flex', marginBottom: '2px' }}>
                                  <Typography sx={styles.partTime}>{weekItem.sourceData[fldLcPart]}</Typography>
                                  <Box
                                    sx={{
                                      width: '400px',
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        lineHeight: '20px',
                                      }}
                                    >
                                      <ul className="ulSchedule">
                                        <li className="lc">
                                          <Typography
                                            sx={{
                                              fontSize: '13px',
                                              color: 'black',
                                              lineHeight: 1.3,
                                            }}
                                          >
                                            {weekItem.sourceData[fldSrc]}{' '}
                                            <span className="student-part-duration">{`(${weekItem.sourceData[fldTime]} min.)`}</span>
                                          </Typography>
                                        </li>
                                      </ul>
                                    </Box>
                                  </Box>
                                  <Typography sx={{ width: '180px', lineHeight: '20px' }}>{''}</Typography>
                                  <Typography sx={styles.assignedPers}>{weekItem.scheduleData[fldPers]}</Typography>
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
                              <Typography sx={styles.partTime}>{weekItem.sourceData.concludingComments}</Typography>
                              <Box sx={{ lineHeight: '20px', width: '400px' }}>
                                <ul className="ulSchedule">
                                  <li className="lc">
                                    <Typography
                                      sx={{
                                        fontSize: '13px',
                                        color: 'black',
                                        lineHeight: 1.2,
                                      }}
                                    >
                                      {t('scheduleTemplate.concludingComments')}{' '}
                                      <span className="student-part-duration">(3 min.)</span>
                                    </Typography>
                                  </li>
                                </ul>
                              </Box>
                              <Typography sx={{ width: '180px', lineHeight: '20px' }}>{''}</Typography>
                              <Typography sx={styles.assignedPers}>
                                {weekItem.scheduleData.chairmanMM_A_dispName}
                              </Typography>
                            </Box>

                            {/* Talk by CO */}
                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
                              <Typography sx={styles.partTime}>{weekItem.sourceData.coTalk}</Typography>
                              <Box sx={{ lineHeight: '20px', width: '400px' }}>
                                <ul className="ulSchedule">
                                  <li className="lc">
                                    <Typography
                                      sx={{
                                        fontSize: '13px',
                                        color: 'black',
                                        lineHeight: 1.2,
                                      }}
                                    >
                                      {t('scheduleTemplate.coTalk')}{' '}
                                      <span className="student-part-duration">(30 min.)</span>
                                    </Typography>
                                  </li>
                                </ul>
                              </Box>
                              <Typography sx={{ width: '180px', lineHeight: '20px' }}>{''}</Typography>
                              <Typography sx={styles.assignedPers}>{''}</Typography>
                            </Box>
                          </>
                        )}

                        {/* Normal Week */}
                        {weekItem.scheduleData.week_type === 1 && (
                          <>
                            {/* CBS */}
                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
                              <Typography sx={styles.partTime}>{weekItem.sourceData.cbs}</Typography>
                              <Box sx={{ lineHeight: '20px', width: '400px' }}>
                                <ul className="ulSchedule">
                                  <li className="lc">
                                    <Typography
                                      sx={{
                                        fontSize: '13px',
                                        color: 'black',
                                        lineHeight: 1.2,
                                      }}
                                    >
                                      {t('global.cbs')} <span className="student-part-duration">(30 min.)</span>
                                    </Typography>
                                  </li>
                                </ul>
                              </Box>
                              <Typography
                                align="right"
                                sx={{
                                  color: '#424949',
                                  fontSize: '9px',
                                  fontWeight: 'bold',
                                  width: '180px',
                                  lineHeight: '20px',
                                }}
                              >
                                {t('scheduleTemplate.cbsConductor')}
                                {weekItem.scheduleData.cbs_reader_dispName !== ''
                                  ? `/${t('scheduleTemplate.cbsReader')}`
                                  : ''}
                                :
                              </Typography>
                              <Typography sx={styles.assignedPers}>
                                {weekItem.scheduleData.cbs_conductor_dispName}
                                {weekItem.scheduleData.cbs_reader_dispName !== ''
                                  ? `/${weekItem.scheduleData.cbs_reader_dispName}`
                                  : ''}
                              </Typography>
                            </Box>

                            {/* Concluding Comments */}
                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
                              <Typography sx={styles.partTime}>{weekItem.sourceData.concludingComments}</Typography>
                              <Box sx={{ lineHeight: '20px', width: '400px' }}>
                                <ul className="ulSchedule">
                                  <li className="lc">
                                    <Typography
                                      sx={{
                                        fontSize: '13px',
                                        color: 'black',
                                        lineHeight: 1.2,
                                      }}
                                    >
                                      {t('scheduleTemplate.concludingComments')}{' '}
                                      <span className="student-part-duration">(3 min.)</span>
                                    </Typography>
                                  </li>
                                </ul>
                              </Box>
                              <Typography sx={{ width: '180px', lineHeight: '20px' }}>{''}</Typography>
                              <Typography sx={styles.assignedPers}>
                                {weekItem.scheduleData.chairmanMM_A_dispName}
                              </Typography>
                            </Box>
                          </>
                        )}

                        {/* Concluding Song, Prayer */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography sx={styles.partTime}>{weekItem.sourceData.pgmEnd}</Typography>
                          <Box sx={{ lineHeight: '20px', width: '400px' }}>
                            <ul className="ulSchedule">
                              <li className="lc">
                                <Typography
                                  sx={{
                                    fontSize: '13px',
                                    color: 'black',
                                    lineHeight: 1.2,
                                  }}
                                >
                                  {t('global.song')}
                                  {weekItem.scheduleData.week_type === 2
                                    ? ''
                                    : ` ${weekItem.sourceData.songConclude_src}`}
                                </Typography>
                              </li>
                            </ul>
                          </Box>
                          <Typography
                            align="right"
                            sx={{
                              color: '#424949',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              width: '180px',
                              lineHeight: '20px',
                            }}
                          >
                            {`${t('global.prayerMidweekMeeting')}:`}
                          </Typography>
                          <Typography sx={styles.assignedPers}>
                            {weekItem.scheduleData.closing_prayer_dispName}
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Box>
                  {(weekIndex === 1 || weekIndex === 3) && <div className="html2pdf__page-break"></div>}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default S140;
