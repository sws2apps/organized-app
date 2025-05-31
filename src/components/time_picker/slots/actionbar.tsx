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
      width={'100%'}
      direction={'row'}
      justifyContent={'space-between'}
      p={'12px'}
      style={{
        gridRow: '3',
        gridColumn: '1 / 3',
      }}
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
