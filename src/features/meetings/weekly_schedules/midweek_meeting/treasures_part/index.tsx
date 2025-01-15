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

const TreasuresPart = ({ week, timings }: TreasuresPartProps) => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const { showAuxClass } = useTreasuresPart(week);

  return (
    <MeetingSection
      part={t('tr_treasuresPart')}
      color="var(--treasures-from-gods-word)"
      icon={<IconTreasuresPart color="var(--always-white)" />}
      alwaysExpanded
    >
      <Stack spacing="8px" divider={<Divider color="var(--grey-200)" />}>
        <DoubleFieldContainer
          sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
        >
          <PrimaryFieldContainer>
            {timings?.tgw_talk && <PartTiming time={timings.tgw_talk} />}
            <MeetingPart
              week={week}
              type="tgw_talk"
              color="var(--treasures-from-gods-word)"
            />
          </PrimaryFieldContainer>
          <SecondaryFieldContainer
            sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
          >
            <PersonComponent
              label={`${t('tr_brother')}:`}
              week={week}
              assignment="MM_TGWTalk"
            />
          </SecondaryFieldContainer>
        </DoubleFieldContainer>
        <DoubleFieldContainer
          sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
        >
          <PrimaryFieldContainer>
            {timings?.tgw_gems && <PartTiming time={timings.tgw_gems} />}
            <MeetingPart
              week={week}
              type="tgw_gems"
              color="var(--treasures-from-gods-word)"
            />
          </PrimaryFieldContainer>
          <SecondaryFieldContainer
            sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
          >
            <PersonComponent
              label={`${t('tr_brother')}:`}
              week={week}
              assignment="MM_TGWGems"
            />
          </SecondaryFieldContainer>
        </DoubleFieldContainer>
        <DoubleFieldContainer
          sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
        >
          <PrimaryFieldContainer>
            {timings?.tgw_bible_reading && (
              <PartTiming time={timings.tgw_bible_reading} />
            )}
            <MeetingPart
              week={week}
              type="tgw_bible_reading"
              color="var(--treasures-from-gods-word)"
            />
          </PrimaryFieldContainer>
          <SecondaryFieldContainer
            sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
          >
            <Stack spacing="8px" divider={<Divider color="var(--grey-200)" />}>
              <Stack spacing="4px">
                <Typography
                  className="body-small-semibold"
                  color="var(--grey-350)"
                >
                  {t('tr_mainHall')}
                </Typography>
                <PersonComponent
                  label={`${t('tr_student')}:`}
                  week={week}
                  assignment="MM_TGWBibleReading_A"
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
                    week={week}
                    assignment="MM_TGWBibleReading_B"
                  />
                </Stack>
              )}
            </Stack>
          </SecondaryFieldContainer>
        </DoubleFieldContainer>
      </Stack>
    </MeetingSection>
  );
};

export default TreasuresPart;
