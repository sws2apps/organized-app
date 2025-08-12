import { Stack } from '@mui/material';
import { IconTreasuresPart } from '@components/icons';
import { TreasuresPartProps } from './index.types';
import {
  DoubleFieldContainer,
  PrimaryFieldContainer,
  SecondaryFieldContainer,
} from '../../shared_styles';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useTreasuresPart from './useTreasuresPart';
import Divider from '@components/divider';
import MeetingPart from '@features/meetings/meeting_part';
import MeetingSection from '@features/meetings/meeting_section';
import PartTiming from '../../part_timing';
import PersonComponent from '../../person_component';
import Typography from '@components/typography';
import {
  MIDWEEK_WITH_STUDENTS,
  MIDWEEK_WITH_TREASURES_TALKS,
} from '@constants/index';

const TreasuresPart = (props: TreasuresPartProps) => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const { showAuxClass, weekType } = useTreasuresPart(props);

  return (
    <MeetingSection
      part={t('tr_treasuresPart')}
      color="var(--treasures-from-gods-word)"
      icon={<IconTreasuresPart color="var(--always-white)" />}
      alwaysExpanded
    >
      <Stack spacing="8px" divider={<Divider color="var(--grey-200)" />}>
        {MIDWEEK_WITH_TREASURES_TALKS.includes(weekType) && (
          <>
            <DoubleFieldContainer
              sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
            >
              <PrimaryFieldContainer>
                {props.timings?.tgw_talk && (
                  <PartTiming time={props.timings.tgw_talk} />
                )}
                <MeetingPart
                  week={props.week}
                  type="tgw_talk"
                  color="var(--treasures-from-gods-word)"
                  dataView={props.dataView}
                />
              </PrimaryFieldContainer>
              <SecondaryFieldContainer
                sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
              >
                <PersonComponent
                  label={`${t('tr_brother')}:`}
                  week={props.week}
                  assignment="MM_TGWTalk"
                  dataView={props.dataView}
                />
              </SecondaryFieldContainer>
            </DoubleFieldContainer>

            <Divider color="var(--grey-200)" />

            <DoubleFieldContainer
              sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
            >
              <PrimaryFieldContainer>
                {props.timings?.tgw_gems && (
                  <PartTiming time={props.timings.tgw_gems} />
                )}
                <MeetingPart
                  week={props.week}
                  type="tgw_gems"
                  color="var(--treasures-from-gods-word)"
                  dataView={props.dataView}
                />
              </PrimaryFieldContainer>
              <SecondaryFieldContainer
                sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
              >
                <PersonComponent
                  label={`${t('tr_brother')}:`}
                  week={props.week}
                  assignment="MM_TGWGems"
                  dataView={props.dataView}
                />
              </SecondaryFieldContainer>
            </DoubleFieldContainer>
          </>
        )}

        {MIDWEEK_WITH_STUDENTS.includes(weekType) && (
          <DoubleFieldContainer
            sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
          >
            <PrimaryFieldContainer>
              {props.timings?.tgw_bible_reading && (
                <PartTiming time={props.timings.tgw_bible_reading} />
              )}

              <MeetingPart
                week={props.week}
                type="tgw_bible_reading"
                color="var(--treasures-from-gods-word)"
                dataView={props.dataView}
              />
            </PrimaryFieldContainer>
            <SecondaryFieldContainer
              sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
            >
              <Stack
                spacing="8px"
                divider={<Divider color="var(--grey-200)" />}
              >
                <Stack spacing="4px">
                  {showAuxClass && (
                    <Typography
                      className="body-small-semibold"
                      color="var(--grey-350)"
                    >
                      {t('tr_mainHall')}
                    </Typography>
                  )}

                  <PersonComponent
                    label={`${t('tr_student')}:`}
                    week={props.week}
                    assignment="MM_TGWBibleReading_A"
                    dataView={props.dataView}
                  />
                </Stack>
                {showAuxClass && (
                  <Stack spacing="4px">
                    <Typography
                      className="body-small-semibold"
                      color="var(--grey-350)"
                    >
                      {t('tr_auxClassroom')}
                    </Typography>
                    <PersonComponent
                      label={`${t('tr_student')}:`}
                      week={props.week}
                      assignment="MM_TGWBibleReading_B"
                      dataView={props.dataView}
                    />
                  </Stack>
                )}
              </Stack>
            </SecondaryFieldContainer>
          </DoubleFieldContainer>
        )}
      </Stack>
    </MeetingSection>
  );
};

export default TreasuresPart;
