import { Stack } from '@mui/material';
import { IconWatchtowerStudy } from '@components/icons';
import { Week } from '@definition/week_type';
import {
  DoubleFieldContainer,
  PrimaryFieldContainer,
  SecondaryFieldContainer,
} from '../../shared_styles';
import { WatchtowerStudyProps } from './index.types';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useWatchtowerStudy from './useWatchtowerStudy';
import Divider from '@components/divider';
import MeetingSection from '@features/meetings/meeting_section';
import PartTiming from '../../part_timing';
import PersonComponent from '../../person_component';
import SongSource from '@features/meetings/song_source';
import Typography from '@components/typography';

const WatchtowerStudy = (props: WatchtowerStudyProps) => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const { articleTitle, showWSReader, weekType, showSong } =
    useWatchtowerStudy(props);

  return (
    <MeetingSection
      part={t('tr_watchtowerStudy')}
      color="var(--watchtower-study)"
      icon={<IconWatchtowerStudy color="var(--always-white)" />}
      alwaysExpanded
    >
      <Stack spacing="8px" divider={<Divider color="var(--grey-200)" />}>
        {showSong && (
          <DoubleFieldContainer
            sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
          >
            <PrimaryFieldContainer>
              {props.timings?.middle_song && (
                <PartTiming time={props.timings.middle_song} />
              )}

              <SongSource
                meeting="weekend"
                week={props.week}
                type="middle"
                dataView={props.dataView}
              />
            </PrimaryFieldContainer>
            <SecondaryFieldContainer
              sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
            />
          </DoubleFieldContainer>
        )}

        <DoubleFieldContainer
          sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
        >
          <PrimaryFieldContainer>
            <Stack spacing="4px" padding="2px 0px">
              <Stack spacing="8px" direction="row" alignItems="center">
                {props.timings?.w_study && (
                  <PartTiming time={props.timings.w_study} />
                )}

                <Typography className="h4" color="var(--watchtower-study)">
                  {t('tr_watchtowerStudy')}
                </Typography>
              </Stack>

              {articleTitle && (
                <Typography
                  className="body-small-regular"
                  color="var(--grey-400)"
                  sx={{ marginLeft: '4px !important' }}
                >
                  {articleTitle}
                </Typography>
              )}
            </Stack>
          </PrimaryFieldContainer>
          <SecondaryFieldContainer
            sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
          >
            <Stack spacing="4px">
              <PersonComponent
                label={`${t('tr_conductor')}:`}
                week={props.week}
                assignment="WM_WTStudy_Conductor"
                dataView={props.dataView}
              />

              {showWSReader && (
                <PersonComponent
                  label={`${t('tr_reader')}:`}
                  week={props.week}
                  assignment="WM_WTStudy_Reader"
                  dataView={props.dataView}
                />
              )}
            </Stack>
          </SecondaryFieldContainer>
        </DoubleFieldContainer>

        {showSong && weekType === Week.NORMAL && (
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
                assignment="WM_ClosingPrayer"
                dataView={props.dataView}
              />
            </SecondaryFieldContainer>
          </DoubleFieldContainer>
        )}
      </Stack>
    </MeetingSection>
  );
};

export default WatchtowerStudy;
