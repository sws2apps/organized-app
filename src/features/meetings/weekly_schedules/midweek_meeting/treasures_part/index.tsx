import { Stack } from '@mui/material';
import { IconTreasuresPart } from '@components/icons';
import { TreasuresPartProps } from './index.types';
import {
  DoubleFieldContainer,
  PersonContainer,
  PrimaryFieldContainer,
  SecondaryFieldContainer,
} from '../../shared_styles';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import Divider from '@components/divider';
import MeetingPart from '@features/meetings/meeting_part';
import MeetingSection from '@features/meetings/meeting_section';
import Typography from '@components/typography';

const TreasuresPart = ({ week }: TreasuresPartProps) => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  return (
    <MeetingSection
      part={t('tr_treasuresPart')}
      color="var(--treasures-from-gods-word)"
      icon={<IconTreasuresPart color="var(--always-white)" />}
      alwaysExpanded
    >
      <Stack spacing="8px" divider={<Divider color="var(--grey-200)" />}>
        <DoubleFieldContainer laptopUp={laptopUp}>
          <PrimaryFieldContainer>
            <MeetingPart
              week={week}
              type="tgw_talk"
              color="var(--treasures-from-gods-word)"
            />
          </PrimaryFieldContainer>
          <SecondaryFieldContainer laptopUp={laptopUp}>
            <PersonContainer
              label={`${t('tr_brother')}:`}
              name="Jeremiah Green"
            />
          </SecondaryFieldContainer>
        </DoubleFieldContainer>
        <DoubleFieldContainer laptopUp={laptopUp}>
          <PrimaryFieldContainer>
            <MeetingPart
              week={week}
              type="tgw_gems"
              color="var(--treasures-from-gods-word)"
            />
          </PrimaryFieldContainer>
          <SecondaryFieldContainer laptopUp={laptopUp}>
            <PersonContainer
              label={`${t('tr_brother')}:`}
              name="Jeremiah Green"
              active
            />
          </SecondaryFieldContainer>
        </DoubleFieldContainer>
        <DoubleFieldContainer laptopUp={laptopUp}>
          <PrimaryFieldContainer>
            <MeetingPart
              week={week}
              type="tgw_bible_reading"
              color="var(--treasures-from-gods-word)"
            />
          </PrimaryFieldContainer>
          <SecondaryFieldContainer laptopUp={laptopUp}>
            <Stack spacing="8px" divider={<Divider color="var(--grey-200)" />}>
              <Stack spacing="4px">
                <Typography
                  className="body-small-semibold"
                  color="var(--grey-350)"
                >
                  {t('tr_mainHall')}
                </Typography>
                <PersonContainer
                  label={`${t('tr_student')}:`}
                  name="Jeremiah Green"
                />
              </Stack>
              <Stack spacing="4px">
                <Typography
                  className="body-small-semibold"
                  color="var(--grey-350)"
                >
                  {t('tr_auxClassroom')}
                </Typography>
                <PersonContainer
                  label={`${t('tr_student')}:`}
                  name="Jeremiah Green"
                />
              </Stack>
            </Stack>
          </SecondaryFieldContainer>
        </DoubleFieldContainer>
      </Stack>
    </MeetingSection>
  );
};

export default TreasuresPart;
