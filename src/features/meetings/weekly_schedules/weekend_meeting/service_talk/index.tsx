import { Stack } from '@mui/material';
import { IconTalk } from '@components/icons';
import { ServiceTalkProps } from './index.types';
import {
  DoubleFieldContainer,
  PrimaryFieldContainer,
  SecondaryFieldContainer,
} from '../../shared_styles';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useServiceTalk from './useServiceTalk';
import Divider from '@components/divider';
import MeetingSection from '@features/meetings/meeting_section';
import PartTiming from '../../part_timing';
import PersonComponent from '../../person_component';
import SongSource from '@features/meetings/song_source';
import Typography from '@components/typography';

const ServiceTalk = (props: ServiceTalkProps) => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const { talkTitle } = useServiceTalk(props);

  return (
    <MeetingSection
      part={t('tr_serviceTalk')}
      color="var(--weekend-meeting)"
      icon={<IconTalk color="var(--always-white)" />}
      alwaysExpanded
    >
      <Stack spacing="8px" divider={<Divider color="var(--grey-200)" />}>
        <DoubleFieldContainer
          sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
        >
          <PrimaryFieldContainer>
            <Stack spacing="4px" padding="2px 0px">
              <Stack spacing="8px" direction="row" alignItems="center">
                {props.timings?.service_talk && (
                  <PartTiming time={props.timings.service_talk} />
                )}

                <Typography className="h4" color="var(--weekend-meeting)">
                  {t('tr_serviceTalk')}
                </Typography>
              </Stack>

              {talkTitle && (
                <Typography
                  className="h4"
                  sx={{ marginLeft: '4px !important' }}
                >
                  {talkTitle}
                </Typography>
              )}
            </Stack>
          </PrimaryFieldContainer>
          <SecondaryFieldContainer
            sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
          >
            <PersonComponent
              label={`${t('tr_brother')}:`}
              week={props.week}
              assignment="WM_CircuitOverseer"
            />
          </SecondaryFieldContainer>
        </DoubleFieldContainer>

        <DoubleFieldContainer
          sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
        >
          <PrimaryFieldContainer>
            {props.timings?.pgm_end && (
              <PartTiming time={props.timings.pgm_end} />
            )}

            <SongSource
              meeting="weekend"
              week={props.week}
              type="concluding"
              dataView={props.dataView}
            />
          </PrimaryFieldContainer>
          <SecondaryFieldContainer
            sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
          >
            <PersonComponent
              label={`${t('tr_prayer')}:`}
              week={props.week}
              assignment="WM_CircuitOverseer"
            />
          </SecondaryFieldContainer>
        </DoubleFieldContainer>
      </Stack>
    </MeetingSection>
  );
};

export default ServiceTalk;
