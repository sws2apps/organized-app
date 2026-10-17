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
      style={{
        gridRow: '3',
        gridColumn: '1 / 3',
      }}
      sx={{
        width: '100%',
        justifyContent: 'space-between',
        p: '12px',
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
