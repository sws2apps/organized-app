import { Stack } from '@mui/material';
import { IconCopy, IconTalk } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import {
  DoubleFieldContainer,
  PrimaryFieldContainer,
  SecondaryFieldContainer,
} from '../../shared_styles';
import { Week } from '@definition/week_type';
import { PublicTalkProps } from './index.types';
import usePublicTalk from './usePublicTalk';
import IconButton from '@components/icon_button';
import MeetingSection from '@features/meetings/meeting_section';
import PartTiming from '../../part_timing';
import PersonComponent from '../../person_component';
import Typography from '@components/typography';

const PublicTalk = (props: PublicTalkProps) => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const { showSecondSpeaker, talkTitle, handleCopyTalk } = usePublicTalk(props);

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
              {props.timings?.public_talk && (
                <PartTiming time={props.timings.public_talk} />
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
          {props.week_type !== Week.CO_VISIT && (
            <Stack>
              <PersonComponent
                label={`${showSecondSpeaker ? t('tr_firstSpeaker') : t('tr_speaker')}:`}
                week={props.week}
                assignment="WM_Speaker_Part1"
                dataView={props.dataView}
              />

              {showSecondSpeaker && (
                <PersonComponent
                  label={`${t('tr_secondSpeaker')}:`}
                  week={props.week}
                  assignment="WM_Speaker_Part2"
                  dataView={props.dataView}
                />
              )}
            </Stack>
          )}

          {props.week_type === Week.CO_VISIT && (
            <PersonComponent
              label={`${t('tr_brother')}:`}
              week={props.week}
              assignment="WM_CircuitOverseer"
              dataView={props.dataView}
            />
          )}
        </SecondaryFieldContainer>
      </DoubleFieldContainer>
    </MeetingSection>
  );
};

export default PublicTalk;
