import { Box } from '@mui/material';
import { Button, TextField } from '@components';
import { PageHeader } from '@features/app_start';
import { IconLoading } from '@icons';
import useAppTranslation from '@hooks/useAppTranslation';
import useSignup from './useSignup';

const PocketSignUp = () => {
  const { t } = useAppTranslation();

  const { handleReturnChooser, handleSignUp, isOnline, isProcessing, setCode, visitorID, code } = useSignup();

  return (
    <Box>
      <PageHeader title={t('connectCongregation')} description={t('accountSetup')} onClick={handleReturnChooser} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <TextField
          label={t('invitationCode')}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          sx={{ width: '100%', color: 'var(--black)' }}
          className="h4"
        />
        <Button
          variant="main"
          disabled={code.length === 0 || !isOnline || visitorID.toString().length === 0}
          onClick={handleSignUp}
          sx={{ padding: '8px 32px', minHeight: '44px' }}
          startIcon={isProcessing ? <IconLoading width={22} height={22} /> : null}
        >
          {t('activate')}
        </Button>
      </Box>
    </Box>
  );
};

export default PocketSignUp;
