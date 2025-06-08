import { Stack } from '@mui/material';
import { IconComputerVideo } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import DutyName from '../duty_name';

const AudioVideo = () => {
  const { t } = useAppTranslation();
  return (
    <Stack spacing="8px">
      <DutyName
        duty={t('tr_audioVideo')}
        icon={<IconComputerVideo color="var(--accent-dark)" />}
      />
    </Stack>
  );
};

export default AudioVideo;
