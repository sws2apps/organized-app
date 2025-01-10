import { Badge, Box, Link, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useOAuthEmail from './useEmail';
import Button from '@components/button';
import TextField from '@components/textfield';
import Typography from '@components/typography';
import WaitingLoader from '@components/waiting_loader';

const OAuthEmail = () => {
  const { t } = useAppTranslation();

  const {
    userTmpEmail,
    setUserTmpEmail,
    devLink,
    handleSendLink,
    isProcessing,
  } = useOAuthEmail();

  return (
    <Stack spacing="16px">
      <TextField
        label={t('tr_email')}
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
        startIcon={
          isProcessing ? (
            <WaitingLoader size={17} color="var(--black)" variant="standard" />
          ) : null
        }
      >
        {t('tr_sendLink')}
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
    </Stack>
  );
};

export default OAuthEmail;
