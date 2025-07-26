import { Stack } from '@mui/material';
import { IconDoor } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import DutyName from '../duty_name';

const EntranceAttendant = () => {
  const { t } = useAppTranslation();
  return (
    <Stack spacing="8px">
      <DutyName
        duty={t('tr_dutiesEntranceAttendant')}
        icon={<IconDoor color="var(--accent-dark)" />}
      />
    </Stack>
  );
};

export default EntranceAttendant;
