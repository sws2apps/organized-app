import { Stack } from '@mui/material';
import { IconAtHome } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import DutyName from '../duty_name';

const Hospitality = () => {
  const { t } = useAppTranslation();
  return (
    <Stack spacing="8px">
      <DutyName
        duty={t('tr_hospitality')}
        icon={<IconAtHome color="var(--accent-dark)" />}
      />
    </Stack>
  );
};

export default Hospitality;
