import { Stack } from '@mui/material';
import { IconHallOverseer } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import DutyName from '../duty_name';

const AuditoriumAttendant = () => {
  const { t } = useAppTranslation();
  return (
    <Stack spacing="8px">
      <DutyName
        duty={t('tr_dutiesAuditoriumAttendant')}
        icon={<IconHallOverseer color="var(--accent-dark)" />}
      />
    </Stack>
  );
};

export default AuditoriumAttendant;
