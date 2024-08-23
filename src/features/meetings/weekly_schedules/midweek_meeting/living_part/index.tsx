import { Stack } from '@mui/material';
import { IconLivingPart } from '@components/icons';
import { LivingPartProps } from './index.types';
import {
  DoubleFieldContainer,
  PersonContainer,
  PrimaryFieldContainer,
  SecondaryFieldContainer,
} from '../../shared_styles';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useLivingPart from './useLivingPart';
import Divider from '@components/divider';
import MeetingPart from '@features/meetings/meeting_part';
import MeetingSection from '@features/meetings/meeting_section';
import PartRow from './part_row';
import SongSource from '@features/meetings/song_source';

const LivingPart = ({ week }: LivingPartProps) => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const { parts } = useLivingPart(week);

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
            <SongSource meeting="midweek" week={week} type="middle" />
          </PrimaryFieldContainer>
          <SecondaryFieldContainer laptopUp={laptopUp} />
        </DoubleFieldContainer>

        {parts.map((part) => (
          <PartRow key={part} week={week} type={part} />
        ))}

        <DoubleFieldContainer laptopUp={laptopUp}>
          <PrimaryFieldContainer>
            <MeetingPart
              week={week}
              type="lc_cbs"
              color="var(--living-as-christians)"
            />
          </PrimaryFieldContainer>
          <SecondaryFieldContainer laptopUp={laptopUp}>
            <Stack spacing="8px" divider={<Divider color="var(--grey-200)" />}>
              <Stack>
                <PersonContainer
                  label={`${t('tr_conductor')}:`}
                  name="Jeremiah Green"
                />
                <PersonContainer
                  label={`${t('tr_reader')}:`}
                  name="Jeremiah Green"
                  active
                />
              </Stack>
            </Stack>
          </SecondaryFieldContainer>
        </DoubleFieldContainer>

        <DoubleFieldContainer laptopUp={laptopUp}>
          <PrimaryFieldContainer>
            <SongSource meeting="midweek" week={week} type="concluding" />
          </PrimaryFieldContainer>
          <SecondaryFieldContainer laptopUp={laptopUp}>
            <PersonContainer
              label={`${t('tr_prayer')}:`}
              name="Jeremiah Green"
            />
          </SecondaryFieldContainer>
        </DoubleFieldContainer>
      </Stack>
    </MeetingSection>
  );
};

export default LivingPart;
