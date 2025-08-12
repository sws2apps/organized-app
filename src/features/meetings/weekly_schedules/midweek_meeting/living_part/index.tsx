import { Stack } from '@mui/material';
import { IconLivingPart } from '@components/icons';
import { Week } from '@definition/week_type';
import {
  DoubleFieldContainer,
  PrimaryFieldContainer,
  SecondaryFieldContainer,
} from '../../shared_styles';
import { MIDWEEK_FULL } from '@constants/index';
import { LivingPartProps } from './index.types';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useLivingPart from './useLivingPart';
import COTalk from '../../co_talk';
import Divider from '@components/divider';
import MeetingPart from '@features/meetings/meeting_part';
import MeetingSection from '@features/meetings/meeting_section';
import PartRow from './part_row';
import PartTiming from '../../part_timing';
import PersonComponent from '../../person_component';
import SongSource from '@features/meetings/song_source';

const LivingPart = (props: LivingPartProps) => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const { parts, weekType, closingPrayerLinked, showCBS } =
    useLivingPart(props);

  return (
    <MeetingSection
      part={t('tr_livingPart')}
      color="var(--living-as-christians)"
      icon={<IconLivingPart color="var(--always-white)" />}
      alwaysExpanded
    >
      <Stack spacing="8px" divider={<Divider color="var(--grey-200)" />}>
        <DoubleFieldContainer
          sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
        >
          <PrimaryFieldContainer>
            {props.timings?.lc_middle_song && (
              <PartTiming time={props.timings.lc_middle_song} />
            )}

            <SongSource
              meeting="midweek"
              week={props.week}
              type="middle"
              dataView={props.dataView}
            />
          </PrimaryFieldContainer>
          <SecondaryFieldContainer
            sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
          />
        </DoubleFieldContainer>

        {parts.map((part) => (
          <PartRow
            key={part}
            week={props.week}
            type={part}
            timings={props.timings}
            dataView={props.dataView}
          />
        ))}

        {showCBS && (
          <DoubleFieldContainer
            sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
          >
            <PrimaryFieldContainer>
              {props.timings?.cbs && <PartTiming time={props.timings.cbs} />}

              <MeetingPart
                week={props.week}
                type="lc_cbs"
                color="var(--living-as-christians)"
                dataView={props.dataView}
              />
            </PrimaryFieldContainer>
            <SecondaryFieldContainer
              sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
            >
              <Stack>
                <PersonComponent
                  label={`${t('tr_conductor')}:`}
                  week={props.week}
                  assignment="MM_LCCBSConductor"
                  dataView={props.dataView}
                />
                <PersonComponent
                  label={`${t('tr_reader')}:`}
                  week={props.week}
                  assignment="MM_LCCBSReader"
                  dataView={props.dataView}
                />
              </Stack>
            </SecondaryFieldContainer>
          </DoubleFieldContainer>
        )}

        {weekType === Week.CO_VISIT && (
          <DoubleFieldContainer
            sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
          >
            <PrimaryFieldContainer>
              {props.timings?.co_talk && (
                <PartTiming time={props.timings.co_talk} />
              )}
              <COTalk
                color="var(--living-as-christians)"
                week={props.week}
                meeting="midweek"
              />
            </PrimaryFieldContainer>
            <SecondaryFieldContainer
              sx={{ maxWidth: laptopUp ? '360px' : '100%' }}
            >
              <PersonComponent
                label={`${t('tr_brother')}:`}
                week={props.week}
                assignment="MM_CircuitOverseer"
                dataView={props.dataView}
              />
            </SecondaryFieldContainer>
          </DoubleFieldContainer>
        )}

        {MIDWEEK_FULL.includes(weekType) && (
          <DoubleFieldContainer
            sx={{ flexDirection: laptopUp ? 'row' : 'column' }}
          >
            <PrimaryFieldContainer>
              {props.timings?.pgm_end && (
                <PartTiming time={props.timings.pgm_end} />
              )}
              <SongSource
                meeting="midweek"
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
                dataView={props.dataView}
                assignment={
                  !closingPrayerLinked
                    ? 'MM_ClosingPrayer'
                    : closingPrayerLinked
                }
              />
            </SecondaryFieldContainer>
          </DoubleFieldContainer>
        )}
      </Stack>
    </MeetingSection>
  );
};

export default LivingPart;
