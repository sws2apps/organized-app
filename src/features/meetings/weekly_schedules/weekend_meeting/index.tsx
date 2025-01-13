import { Box, Stack } from '@mui/material';
import { IconWavingHand } from '@components/icons';
import { Week } from '@definition/week_type';
import {
  DoubleFieldContainer,
  PrimaryFieldContainer,
  SecondaryFieldContainer,
} from '../shared_styles';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useWeekendMeeting from './useWeekendMeeting';
import AssignmentBadge from '../assignment_badge';
import Badge from '@components/badge';
import NoSchedule from '../no_schedule';
import PartTiming from '../part_timing';
import PersonComponent from '../person_component';
import SongSource from '@features/meetings/song_source';
import Typography from '@components/typography';
import ServiceTalk from './service_talk';
import PublicTalk from './public_talk';
import WatchtowerStudy from './watchtower_study';
import WeekScheduleHeader from '../week_schedule_header';
import WeekSelector from '../week_selector';

const WeekendMeeting = () => {
  const { t } = useAppTranslation();

  const { laptopUp, desktopUp } = useBreakpoints();

  const {
    currentWeekVisible,
    handleGoCurrent,
    handleValueChange,
    value,
    week,
    myAssignmentsTotal,
    noMeetingInfo,
    openingPrayerAuto,
    partTimings,
    scheduleLastUpdated,
    weekType,
    weekDateLocale,
    noSchedule,
  } = useWeekendMeeting();

  return (
    <>
      {noSchedule && <NoSchedule />}
      {!noSchedule && (
        <Box
          sx={{
            marginTop: '8px',
          }}
        >
          <WeekSelector value={value} onChange={handleValueChange} />

          <WeekScheduleHeader
            currentVisible={currentWeekVisible}
            week={week}
            onCurrent={handleGoCurrent}
            lastUpdated={scheduleLastUpdated}
          />

          {week && (
            <Stack spacing="8px">
              <DoubleFieldContainer
                sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
              >
                <PrimaryFieldContainer
                  sx={{
                    display: 'flex',
                    alignItems: desktopUp ? 'center' : 'unset',
                    gap: desktopUp ? '16px' : '4px',
                    flexDirection: desktopUp ? 'row' : 'column',
                  }}
                >
                  <Typography className="h2">{weekDateLocale}</Typography>

                  {weekType === Week.CO_VISIT && (
                    <Badge
                      text={t('tr_circuitOverseerWeek')}
                      color="accent"
                      size="medium"
                      multiLine
                      filled={false}
                      icon={<IconWavingHand />}
                      sx={{ width: 'fit-content' }}
                    />
                  )}

                  {weekType === Week.ASSEMBLY && (
                    <Badge
                      text={t('tr_assemblyWeek')}
                      color="accent"
                      size="medium"
                      multiLine
                      filled={false}
                      sx={{ width: 'fit-content' }}
                    />
                  )}

                  {weekType === Week.CONVENTION && (
                    <Badge
                      text={t('tr_conventionWeek')}
                      color="accent"
                      size="medium"
                      multiLine
                      filled={false}
                      sx={{ width: 'fit-content' }}
                    />
                  )}

                  {weekType === Week.MEMORIAL && (
                    <Badge
                      text={t('tr_memorialWeek')}
                      color="accent"
                      size="medium"
                      multiLine
                      filled={false}
                      sx={{ width: 'fit-content' }}
                    />
                  )}

                  {weekType === Week.NO_MEETING && (
                    <Badge
                      text={t('tr_noMeetingWeek')}
                      color="grey"
                      size="medium"
                      multiLine
                      filled={false}
                      sx={{ width: 'fit-content' }}
                    />
                  )}

                  {myAssignmentsTotal && (
                    <AssignmentBadge count={myAssignmentsTotal} />
                  )}
                </PrimaryFieldContainer>

                {!noMeetingInfo.value && (
                  <SecondaryFieldContainer
                    sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
                  >
                    <PersonComponent
                      label={`${t('tr_chairman')}:`}
                      week={week}
                      assignment="WM_Chairman"
                    />
                  </SecondaryFieldContainer>
                )}
              </DoubleFieldContainer>

              {noMeetingInfo.value && (
                <Typography>{noMeetingInfo.event}</Typography>
              )}

              {!noMeetingInfo.value && (
                <>
                  <DoubleFieldContainer
                    sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
                  >
                    <PrimaryFieldContainer>
                      {partTimings?.pgm_start && (
                        <PartTiming time={partTimings.pgm_start} />
                      )}

                      <SongSource
                        meeting="weekend"
                        week={week}
                        type="opening"
                      />
                    </PrimaryFieldContainer>
                    <SecondaryFieldContainer
                      sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
                    >
                      {!openingPrayerAuto && (
                        <PersonComponent
                          label={`${t('tr_prayer')}:`}
                          week={week}
                          assignment="WM_OpeningPrayer"
                        />
                      )}
                    </SecondaryFieldContainer>
                  </DoubleFieldContainer>

                  <PublicTalk
                    week={week}
                    week_type={weekType}
                    timings={partTimings}
                  />

                  <WatchtowerStudy week={week} timings={partTimings} />

                  {weekType === Week.CO_VISIT && (
                    <ServiceTalk week={week} timings={partTimings} />
                  )}
                </>
              )}
            </Stack>
          )}
        </Box>
      )}
    </>
  );
};

export default WeekendMeeting;
