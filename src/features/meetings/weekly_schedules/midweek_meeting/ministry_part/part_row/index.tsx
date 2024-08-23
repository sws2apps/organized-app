import { Stack } from '@mui/material';
import {
  DoubleFieldContainer,
  PersonContainer,
  PrimaryFieldContainer,
  SecondaryFieldContainer,
} from '../../../shared_styles';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { PartRowProps } from './index.types';
import Divider from '@components/divider';
import MeetingPart from '@features/meetings/meeting_part';
import Typography from '@components/typography';

const PartRow = (props: PartRowProps) => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  return (
    <DoubleFieldContainer laptopUp={laptopUp}>
      <PrimaryFieldContainer>
        <MeetingPart
          week={props.week}
          type={props.type}
          color="var(--apply-yourself-to-the-field-ministry)"
        />
      </PrimaryFieldContainer>
      <SecondaryFieldContainer laptopUp={laptopUp}>
        <Stack spacing="8px" divider={<Divider color="var(--grey-200)" />}>
          <Stack spacing="4px">
            <Typography className="body-small-semibold" color="var(--grey-350)">
              {t('tr_mainHall')}
            </Typography>
            <Stack>
              <PersonContainer
                label={`${t('tr_student')}:`}
                name="Jeremiah Green"
                female
              />
              <PersonContainer
                label={`${t('tr_assistant')}:`}
                name="Jeremiah Green"
                female
              />
            </Stack>
          </Stack>
          <Stack spacing="4px">
            <Typography className="body-small-semibold" color="var(--grey-350)">
              {t('tr_auxClassroom')}
            </Typography>
            <Stack>
              <PersonContainer
                label={`${t('tr_student')}:`}
                name="Jeremiah Green"
                female
              />
              <PersonContainer
                label={`${t('tr_assistant')}:`}
                name="Jeremiah Green"
                female
              />
            </Stack>
          </Stack>
        </Stack>
      </SecondaryFieldContainer>
    </DoubleFieldContainer>
  );
};

export default PartRow;
