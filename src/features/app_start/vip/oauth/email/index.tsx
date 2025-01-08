import { Badge, Box, Link } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import TextField from '@components/textfield';
import Button from '@components/button';
import useEmailAuth from './useEmailAuth';
import { IconLoading } from '@components/icons';
import Typography from '@components/typography';

const OAuthEmail = () => {
  const { t } = useAppTranslation();

  const {
    isProcessing,
    setUserTmpEmail,
    handleSendLink,
    userTmpEmail,
    devLink,
  } = useEmailAuth();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
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
        startIcon={isProcessing ? <IconLoading width={22} height={22} /> : null}
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
    </Box>
  );
};

export default OAuthEmail;
