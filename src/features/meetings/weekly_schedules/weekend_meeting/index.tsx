import { Stack } from '@mui/material';
import { IconWavingHand } from '@components/icons';
import { Week } from '@definition/week_type';
import { WEEKEND_WITH_WTSTUDY } from '@constants/index';
import {
  DoubleFieldContainer,
  PrimaryFieldContainer,
  SecondaryFieldContainer,
} from '../shared_styles';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { WeekendMeetingProps } from './index.types';
import useWeekendMeeting from './useWeekendMeeting';
import AssignmentBadge from '../assignment_badge';
import Badge from '@components/badge';
import PartTiming from '../part_timing';
import PersonComponent from '../person_component';
import SongSource from '@features/meetings/song_source';
import Typography from '@components/typography';
import ServiceTalk from './service_talk';
import PublicTalk from './public_talk';
import WatchtowerStudy from './watchtower_study';

const WeekendMeeting = (props: WeekendMeetingProps) => {
  const { t } = useAppTranslation();

  const { laptopUp, desktopUp } = useBreakpoints();

  const {
    week,
    myAssignmentsTotal,
    noMeetingInfo,
    openingPrayerAuto,
    partTimings,
    weekType,
    weekDateLocale,
    showChairman,
  } = useWeekendMeeting(props);

  return (
    <Stack spacing="8px">
      <DoubleFieldContainer sx={{ flexDirection: laptopUp ? 'row' : 'column' }}>
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

          {myAssignmentsTotal && <AssignmentBadge count={myAssignmentsTotal} />}
        </PrimaryFieldContainer>

        {!noMeetingInfo.value && (
          <SecondaryFieldContainer
            sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
          >
            {showChairman && (
              <PersonComponent
                label={`${t('tr_chairman')}:`}
                week={week}
                assignment="WM_Chairman"
                dataView={props.dataView}
              />
            )}
          </SecondaryFieldContainer>
        )}
      </DoubleFieldContainer>

      {noMeetingInfo.value && <Typography>{noMeetingInfo.event}</Typography>}

      {!noMeetingInfo.value && (
        <>
          {showChairman && (
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
                    dataView={props.dataView}
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
                      dataView={props.dataView}
                    />
                  )}
                </SecondaryFieldContainer>
              </DoubleFieldContainer>

              <PublicTalk
                week={week}
                week_type={weekType}
                timings={partTimings}
                dataView={props.dataView}
              />
            </>
          )}

          {WEEKEND_WITH_WTSTUDY.includes(weekType) && (
            <WatchtowerStudy
              week={week}
              timings={partTimings}
              dataView={props.dataView}
            />
          )}

          {weekType === Week.CO_VISIT && (
            <ServiceTalk
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

export default WeekendMeeting;
