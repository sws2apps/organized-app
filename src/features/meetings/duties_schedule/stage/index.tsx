import { Stack } from '@mui/material';
import { IconTalk } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import DutyName from '../duty_name';

const Stage = () => {
  const { t } = useAppTranslation();
  return (
    <Stack spacing="8px">
      <DutyName
        duty={t('tr_dutiesStage')}
        icon={<IconTalk color="var(--accent-dark)" />}
      />
    </Stack>
  );
};

export default Stage;
