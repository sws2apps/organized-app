import { Stack } from '@mui/material';
import { Week } from '@definition/week_type';
import {
  DoubleFieldContainer,
  PrimaryFieldContainer,
  SecondaryFieldContainer,
} from '../shared_styles';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useMidweekMeeting from './useMidweekMeeting';
import WeekTypeBadge from '@features/meetings/week_type_badge';
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

  const { laptopUp, tabletUp } = useBreakpoints();

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
            flexWrap: 'wrap',
          }}
        >
          <WeekHeader week={week} dataView={props.dataView} />

          {myAssignmentsTotal && <AssignmentBadge count={myAssignmentsTotal} />}

          {props.lastUpdated && (
            <Badge
              text={t('tr_lastUpdated', { date: props.lastUpdated })}
              color="grey"
              size="small"
              filled={false}
              className="label-small-regular"
            />
          )}

          <WeekTypeBadge weekType={weekType} />


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
