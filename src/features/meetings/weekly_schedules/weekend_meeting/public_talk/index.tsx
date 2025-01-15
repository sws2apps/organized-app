import { Stack } from '@mui/material';
import { IconCopy, IconTalk } from '@components/icons';
import { PublicTalkProps } from './index.types';
import {
  DoubleFieldContainer,
  PrimaryFieldContainer,
  SecondaryFieldContainer,
} from '../../shared_styles';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import usePublicTalk from './usePublicTalk';
import IconButton from '@components/icon_button';
import MeetingSection from '@features/meetings/meeting_section';
import PartTiming from '../../part_timing';
import PersonComponent from '../../person_component';
import Typography from '@components/typography';
import { Week } from '@definition/week_type';

const PublicTalk = ({ week, timings, week_type }: PublicTalkProps) => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const { showSecondSpeaker, talkTitle, handleCopyTalk } = usePublicTalk(week);

  return (
    <MeetingSection
      part={t('tr_publicTalk')}
      color="var(--weekend-meeting)"
      icon={<IconTalk color="var(--always-white)" />}
      alwaysExpanded
    >
      <DoubleFieldContainer sx={{ flexDirection: laptopUp ? 'row' : 'column' }}>
        <PrimaryFieldContainer>
          <Stack spacing="4px" padding="2px 0px">
            <Stack spacing="8px" direction="row" alignItems="center">
              {timings?.public_talk && (
                <PartTiming time={timings.public_talk} />
              )}
              <Typography className="h4" color="var(--weekend-meeting)">
                {t('tr_publicTalk')}
              </Typography>
            </Stack>

            {talkTitle && (
              <Stack spacing="8px" direction="row" alignItems="center">
                <Typography
                  className="h4"
                  sx={{ marginLeft: '4px !important' }}
                >
                  {talkTitle}
                </Typography>
                <IconButton onClick={handleCopyTalk} sx={{ padding: '2px' }}>
                  <IconCopy color="var(--black)" />
                </IconButton>
              </Stack>
            )}
          </Stack>
        </PrimaryFieldContainer>
        <SecondaryFieldContainer sx={{ maxWidth: laptopUp ? '360px' : '100%' }}>
          {week_type !== Week.CO_VISIT && (
            <Stack>
              <PersonComponent
                label={`${showSecondSpeaker ? t('tr_firstSpeaker') : t('tr_speaker')}:`}
                week={week}
                assignment="WM_Speaker_Part1"
              />
              {showSecondSpeaker && (
                <PersonComponent
                  label={`${t('tr_secondSpeaker')}:`}
                  week={week}
                  assignment="WM_Speaker_Part2"
                />
              )}
            </Stack>
          )}

          {week_type === Week.CO_VISIT && (
            <PersonComponent
              label={`${t('tr_brother')}:`}
              week={week}
              assignment="WM_CircuitOverseer"
            />
          )}
        </SecondaryFieldContainer>
      </DoubleFieldContainer>
    </MeetingSection>
  );
};

export default PublicTalk;
