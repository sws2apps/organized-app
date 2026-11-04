import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';

type ActionBarProps = {
  onClose: VoidFunction;
  onAccept: VoidFunction;
  acceptDisabled: boolean;
};

const ActionBar = ({ onClose, onAccept, acceptDisabled }: ActionBarProps) => {
  const { t } = useAppTranslation();

  return (
    <Stack
      direction={'row'}
      sx={{
        justifyContent: 'space-between',
        p: '12px',
        gap: '12px',
      }}
    >
      <Button variant="secondary" onClick={onClose}>
        {t('tr_close')}
      </Button>
      <Button variant="main" onClick={onAccept} disabled={acceptDisabled}>
        {t('tr_ok')}
      </Button>
    </Stack>
  );
};

export default ActionBar;
