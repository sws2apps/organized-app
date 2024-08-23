import { Box, Stack } from '@mui/material';
import { IconWavingHand } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import {
  DoubleFieldContainer,
  PersonContainer,
  PrimaryFieldContainer,
  SecondaryFieldContainer,
} from '../shared_styles';
import useMidweekMeeting from './useMidweekMeeting';
import Badge from '@components/badge';
import LivingPart from './living_part';
import MinistryPart from './ministry_part';
import SongSource from '@features/meetings/song_source';
import TreasuresPart from './treasures_part';
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
  } = useMidweekMeeting();

  return (
    <Box>
      <WeekSelector value={value} onChange={handleValueChange} />

      <WeekScheduleHeader
        currentVisible={currentWeekVisible}
        week={week}
        onCurrent={handleGoCurrent}
      />

      {week && (
        <Stack spacing="8px">
          <DoubleFieldContainer laptopUp={laptopUp}>
            <PrimaryFieldContainer
              sx={{
                display: 'flex',
                alignItems: desktopUp ? 'center' : 'unset',
                gap: desktopUp ? '16px' : '4px',
                flexDirection: desktopUp ? 'row' : 'column',
              }}
            >
              <WeekHeader week={week} />
              <Badge
                text={t('tr_circuitOverseerWeek')}
                color="accent"
                size="medium"
                multiLine
                filled={false}
                icon={<IconWavingHand />}
                sx={{ width: 'fit-content' }}
              />
            </PrimaryFieldContainer>
            <SecondaryFieldContainer laptopUp={laptopUp}>
              <PersonContainer
                label={`${t('tr_chairman')}:`}
                name="Jeremiah Green"
              />
            </SecondaryFieldContainer>
          </DoubleFieldContainer>

          <DoubleFieldContainer laptopUp={laptopUp}>
            <PrimaryFieldContainer>
              <SongSource meeting="midweek" week={week} type="opening" />
            </PrimaryFieldContainer>
            <SecondaryFieldContainer laptopUp={laptopUp}>
              <PersonContainer
                label={`${t('tr_prayer')}:`}
                name="Jeremiah Green"
              />
            </SecondaryFieldContainer>
          </DoubleFieldContainer>

          <TreasuresPart week={week} />

          <MinistryPart week={week} />

          <LivingPart week={week} />
        </Stack>
      )}
    </Box>
  );
};

export default MidweekMeeting;
