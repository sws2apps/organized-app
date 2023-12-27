import { Badge, Box, Link } from '@mui/material';
import { Button, InfoMessage, TextField, Typography } from '@components';
import { PageHeader } from '@features/app_start';
import useAppTranslation from '@hooks/useAppTranslation';
import useEmailAuth from './useEmailAuth';
import { IconError, IconLoading } from '@icons';

const EmailAuth = () => {
  const { t } = useAppTranslation();

  const {
    isProcessing,
    setUserTmpEmail,
    handleProviderSignIn,
    handleSendLink,
    userTmpEmail,
    hideMessage,
    message,
    title,
    variant,
    devLink,
  } = useEmailAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <PageHeader title={t('trans_emailAuth')} description={t('trans_emailAuthDesc')} onClick={handleProviderSignIn} />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '24px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <TextField
            label={t('trans_email')}
            value={userTmpEmail}
            onChange={(e) => setUserTmpEmail(e.target.value)}
            sx={{ width: '100%', color: 'var(--black)' }}
            className="h4"
          />
          <Button
            variant="main"
            disabled={userTmpEmail.length === 0}
            onClick={handleSendLink}
            sx={{ padding: '8px 32px', minHeight: '44px' }}
            startIcon={isProcessing ? <IconLoading width={22} height={22} /> : null}
          >
            {t('trans_sendLink')}
          </Button>
          {devLink.length > 0 && (
            <Box sx={{ display: 'flex', gap: '20px' }}>
              <Badge badgeContent={'dev'} color="error" />
              <Box>
                <Typography>
                  Click{' '}
                  <Link href={devLink} underline="none">
                    here
                  </Link>{' '}
                  to continue
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        <Box id="onboarding-error" sx={{ display: 'none' }}>
          <InfoMessage
            variant={variant}
            messageIcon={<IconError />}
            messageHeader={title}
            message={message}
            onClose={hideMessage}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default EmailAuth;
