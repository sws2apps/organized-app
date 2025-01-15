import { Box, Stack } from '@mui/material';
import { IconWavingHand } from '@components/icons';
import { Week } from '@definition/week_type';
import {
  DoubleFieldContainer,
  PrimaryFieldContainer,
  SecondaryFieldContainer,
} from '../shared_styles';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useMidweekMeeting from './useMidweekMeeting';
import AssignmentBadge from '../assignment_badge';
import Badge from '@components/badge';
import LivingPart from './living_part';
import MinistryPart from './ministry_part';
import NoSchedule from '../no_schedule';
import PersonComponent from '../person_component';
import PartTiming from '../part_timing';
import SongSource from '@features/meetings/song_source';
import TreasuresPart from './treasures_part';
import Typography from '@components/typography';
import WeekHeader from '@features/meetings/midweek_editor/week_header';
import WeekScheduleHeader from '../week_schedule_header';
import WeekSelector from '../week_selector';

const MidweekMeeting = () => {
  const { t } = useAppTranslation();

  const { laptopUp, desktopUp } = useBreakpoints();

  const {
    handleGoCurrent,
    handleValueChange,
    value,
    week,
    currentWeekVisible,
    showAuxCounselor,
    weekType,
    scheduleLastUpdated,
    noMeetingInfo,
    myAssignmentsTotal,
    partTimings,
    openingPrayerAuto,
    noSchedule,
  } = useMidweekMeeting();

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
                  <WeekHeader week={week} />

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
                    <Stack>
                      <PersonComponent
                        label={`${t('tr_chairman')}:`}
                        week={week}
                        assignment="MM_Chairman_A"
                      />

                      {showAuxCounselor && (
                        <PersonComponent
                          week={week}
                          assignment="MM_Chairman_B"
                        />
                      )}
                    </Stack>
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
                        meeting="midweek"
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
                          assignment="MM_OpeningPrayer"
                        />
                      )}
                    </SecondaryFieldContainer>
                  </DoubleFieldContainer>

                  <TreasuresPart week={week} timings={partTimings} />

                  <MinistryPart week={week} timings={partTimings} />

                  <LivingPart week={week} timings={partTimings} />
                </>
              )}
            </Stack>
          )}
        </Box>
      )}
    </>
  );
};

export default MidweekMeeting;
