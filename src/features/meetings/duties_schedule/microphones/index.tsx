import { Stack } from '@mui/material';
import { IconMicrophone } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import DutyName from '../duty_name';

const Microphones = () => {
  const { t } = useAppTranslation();
  return (
    <Stack spacing="8px">
      <DutyName
        duty={t('tr_dutiesMicrophones')}
        icon={<IconMicrophone color="var(--accent-dark)" />}
      />
    </Stack>
  );
};

export default Microphones;
