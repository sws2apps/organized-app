import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';

type ActionBarProps = {
  onClose: VoidFunction;
  onClear: VoidFunction;
};

const ActionBar = ({ onClose, onClear }: ActionBarProps) => {
  const { t } = useAppTranslation();

  return (
    <Stack
      direction={'row'}
      justifyContent={'space-between'}
      p={'12px'}
      gap={'12px'}
    >
      <Button variant="secondary" onClick={onClear}>
        {t('tr_clear')}
      </Button>
      <Button variant="main" onClick={onClose}>
        OK
      </Button>
    </Stack>
  );
};

export default ActionBar;
