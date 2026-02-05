import { Stack } from '@mui/material';
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
import AuxClassGroup from './aux_class_group';
import Badge from '@components/badge';
import LivingPart from './living_part';
import MinistryPart from './ministry_part';
import PersonComponent from '../person_component';
import PartTiming from '../part_timing';
import SongSource from '@features/meetings/song_source';
import TreasuresPart from './treasures_part';
import Typography from '@components/typography';
import WeekHeader from '@features/meetings/midweek_editor/week_header';
import {
  MIDWEEK_FULL,
  MIDWEEK_WITH_LIVING,
  MIDWEEK_WITH_STUDENTS,
  MIDWEEK_WITH_TREASURES,
} from '@constants/index';
import { MidweekMeetingProps } from './index.types';

const MidweekMeeting = (props: MidweekMeetingProps) => {
  const { t } = useAppTranslation();

  const { laptopUp, desktopUp, tabletUp } = useBreakpoints();

  const {
    week,
    showAuxCounselor,
    weekType,
    noMeetingInfo,
    myAssignmentsTotal,
    partTimings,
    openingPrayerLinked,
  } = useMidweekMeeting(props);

  return (
    <Stack spacing="8px">
      <DoubleFieldContainer sx={{ flexDirection: laptopUp ? 'row' : 'column' }}>
        <PrimaryFieldContainer
          sx={{
            display: 'flex',
            alignItems: tabletUp ? 'center' : 'unset',
            gap: tabletUp ? '16px' : '4px',
            flexDirection: tabletUp ? 'row' : 'column',
          }}
        >
          <WeekHeader week={week} dataView={props.dataView} />

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

          {myAssignmentsTotal && <AssignmentBadge count={myAssignmentsTotal} />}
        </PrimaryFieldContainer>

        {!noMeetingInfo.value && (
          <SecondaryFieldContainer
            sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
          >
            <PersonComponent
              label={`${t('tr_chairman')}:`}
              week={week}
              assignment="MM_Chairman_A"
              dataView={props.dataView}
            />
          </SecondaryFieldContainer>
        )}
      </DoubleFieldContainer>

      {!noMeetingInfo.value &&
        MIDWEEK_FULL.includes(weekType) &&
        showAuxCounselor && (
          <DoubleFieldContainer
            sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
          >
            <PrimaryFieldContainer />

            <SecondaryFieldContainer
              sx={{
                maxWidth: laptopUp ? '360px' : '100%',
                gap: 'unset',
              }}
            >
              <PersonComponent
                week={week}
                label={`${t('tr_auxClass')}:`}
                assignment="MM_Chairman_B"
                dataView={props.dataView}
              />

              <AuxClassGroup week={week} />
            </SecondaryFieldContainer>
          </DoubleFieldContainer>
        )}

      {noMeetingInfo.value && <Typography>{noMeetingInfo.event}</Typography>}

      {!noMeetingInfo.value && (
        <>
          {MIDWEEK_FULL.includes(weekType) && (
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
                  dataView={props.dataView}
                />
              </PrimaryFieldContainer>
              <SecondaryFieldContainer
                sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
              >
                <PersonComponent
                  label={`${t('tr_prayer')}:`}
                  week={week}
                  dataView={props.dataView}
                  assignment={
                    !openingPrayerLinked
                      ? 'MM_OpeningPrayer'
                      : openingPrayerLinked
                  }
                />
              </SecondaryFieldContainer>
            </DoubleFieldContainer>
          )}

          {MIDWEEK_WITH_TREASURES.includes(weekType) && (
            <TreasuresPart
              week={week}
              timings={partTimings}
              dataView={props.dataView}
            />
          )}

          {MIDWEEK_WITH_STUDENTS.includes(weekType) && (
            <MinistryPart
              week={week}
              timings={partTimings}
              dataView={props.dataView}
            />
          )}

          {MIDWEEK_WITH_LIVING.includes(weekType) && (
            <LivingPart
              week={week}
              timings={partTimings}
              dataView={props.dataView}
            />
          )}
        </>
      )}
    </Stack>
  );
};

export default MidweekMeeting;
