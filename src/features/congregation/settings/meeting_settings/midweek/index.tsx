import { Stack } from '@mui/material';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { MidweekContainer, LinkedPartsSection } from './index.styles';
import Divider from '@components/divider';
import AuxiliaryClassroom from './auxiliary_classroom';
import DayTime from './day_time';
import LinkedParts from './linked_parts';
import Typography from '@components/typography';

const MidweekSettings = () => {
  const { t } = useAppTranslation();
  const { isGroup } = useCurrentUser();

  return (
    <MidweekContainer>
      <DayTime />

      <Stack spacing="16px">
        {!isGroup && <AuxiliaryClassroom />}

        <LinkedPartsSection>
          <Divider color="var(--accent-200)" />
          
          <Stack spacing="8px">
            <Typography className="h4" color="var(--black)">
              {t('tr_linkedParts')}
            </Typography>
            <LinkedParts />
          </Stack>
        </LinkedPartsSection>
      </Stack>
    </MidweekContainer>
  );
};

export default MidweekSettings;
