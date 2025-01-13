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

const WatchtowerStudy = ({ week, timings }: WatchtowerStudyProps) => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const { articleTitle, showWSReader, weekType } = useWatchtowerStudy(week);

  return (
    <MeetingSection
      part={t('tr_watchtowerStudy')}
      color="var(--watchtower-study)"
      icon={<IconWatchtowerStudy color="var(--always-white)" />}
      alwaysExpanded
    >
      <Stack spacing="8px" divider={<Divider color="var(--grey-200)" />}>
        <DoubleFieldContainer
          sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
        >
          <PrimaryFieldContainer>
            {timings?.middle_song && <PartTiming time={timings.middle_song} />}

            <SongSource meeting="weekend" week={week} type="middle" />
          </PrimaryFieldContainer>
          <SecondaryFieldContainer
            sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
          />
        </DoubleFieldContainer>

        <DoubleFieldContainer
          sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
        >
          <PrimaryFieldContainer>
            <Stack spacing="4px" padding="2px 0px">
              <Stack spacing="8px" direction="row" alignItems="center">
                {timings?.w_study && <PartTiming time={timings.w_study} />}
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
                week={week}
                assignment="WM_WTStudy_Conductor"
              />
              {showWSReader && (
                <PersonComponent
                  label={`${t('tr_reader')}:`}
                  week={week}
                  assignment="WM_WTStudy_Reader"
                />
              )}
            </Stack>
          </SecondaryFieldContainer>
        </DoubleFieldContainer>

        {weekType === Week.NORMAL && (
          <DoubleFieldContainer
            sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
          >
            <PrimaryFieldContainer>
              {timings?.pgm_end && <PartTiming time={timings.pgm_end} />}

              <SongSource meeting="weekend" week={week} type="concluding" />
            </PrimaryFieldContainer>
            <SecondaryFieldContainer
              sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
            >
              <PersonComponent
                label={`${t('tr_prayer')}:`}
                week={week}
                assignment="WM_ClosingPrayer"
              />
            </SecondaryFieldContainer>
          </DoubleFieldContainer>
        )}
      </Stack>
    </MeetingSection>
  );
};

export default WatchtowerStudy;
