import { Stack } from '@mui/material';
import { IconLivingPart } from '@components/icons';
import { Week } from '@definition/week_type';
import {
  DoubleFieldContainer,
  PrimaryFieldContainer,
  SecondaryFieldContainer,
} from '../../shared_styles';
import { LivingPartProps } from './index.types';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useLivingPart from './useLivingPart';
import COTalk from '../../co_talk';
import Divider from '@components/divider';
import MeetingPart from '@features/meetings/meeting_part';
import MeetingSection from '@features/meetings/meeting_section';
import PartRow from './part_row';
import PartTiming from '../part_timing';
import PersonComponent from '../../person_component';
import SongSource from '@features/meetings/song_source';

const LivingPart = ({ week, timings }: LivingPartProps) => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const { parts, weekType, closingPrayerAuto } = useLivingPart(week);

  return (
    <MeetingSection
      part={t('tr_livingPart')}
      color="var(--living-as-christians)"
      icon={<IconLivingPart color="var(--always-white)" />}
      alwaysExpanded
    >
      <Stack spacing="8px" divider={<Divider color="var(--grey-200)" />}>
        <DoubleFieldContainer laptopUp={laptopUp}>
          <PrimaryFieldContainer>
            {timings?.lc_middle_song && (
              <PartTiming time={timings.lc_middle_song} />
            )}
            <SongSource meeting="midweek" week={week} type="middle" />
          </PrimaryFieldContainer>
          <SecondaryFieldContainer laptopUp={laptopUp} />
        </DoubleFieldContainer>

        {parts.map((part) => (
          <PartRow key={part} week={week} type={part} timings={timings} />
        ))}

        {weekType === Week.NORMAL && (
          <DoubleFieldContainer laptopUp={laptopUp}>
            <PrimaryFieldContainer>
              {timings?.cbs && <PartTiming time={timings.cbs} />}
              <MeetingPart
                week={week}
                type="lc_cbs"
                color="var(--living-as-christians)"
              />
            </PrimaryFieldContainer>
            <SecondaryFieldContainer laptopUp={laptopUp}>
              <Stack>
                <PersonComponent
                  label={`${t('tr_conductor')}:`}
                  week={week}
                  assignment="MM_LCCBSConductor"
                />
                <PersonComponent
                  label={`${t('tr_reader')}:`}
                  week={week}
                  assignment="MM_LCCBSReader"
                />
              </Stack>
            </SecondaryFieldContainer>
          </DoubleFieldContainer>
        )}

        {weekType === Week.CO_VISIT && (
          <DoubleFieldContainer laptopUp={laptopUp}>
            <PrimaryFieldContainer>
              {timings?.co_talk && <PartTiming time={timings.co_talk} />}
              <COTalk
                color="var(--living-as-christians)"
                week={week}
                meeting="midweek"
              />
            </PrimaryFieldContainer>
            <SecondaryFieldContainer laptopUp={laptopUp}>
              <PersonComponent
                label={`${t('tr_brother')}:`}
                week={week}
                assignment="MM_CircuitOverseer"
              />
            </SecondaryFieldContainer>
          </DoubleFieldContainer>
        )}

        <DoubleFieldContainer laptopUp={laptopUp}>
          <PrimaryFieldContainer>
            {timings?.pgm_end && <PartTiming time={timings.pgm_end} />}
            <SongSource meeting="midweek" week={week} type="concluding" />
          </PrimaryFieldContainer>
          <SecondaryFieldContainer laptopUp={laptopUp}>
            {!closingPrayerAuto && (
              <PersonComponent
                label={`${t('tr_prayer')}:`}
                week={week}
                assignment="MM_ClosingPrayer"
              />
            )}
          </SecondaryFieldContainer>
        </DoubleFieldContainer>
      </Stack>
    </MeetingSection>
  );
};

export default LivingPart;
