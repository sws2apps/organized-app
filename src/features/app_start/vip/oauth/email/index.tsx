import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useOAuthEmail from './useEmail';
import Button from '@components/button';
import IconLoading from '@components/icon_loading';
import TextField from '@components/textfield';
import Typography from '@components/typography';

const OAuthEmail = () => {
  const { t } = useAppTranslation();

  const { userTmpEmail, setUserTmpEmail, handleSendLink, isProcessing, oauth } =
    useOAuthEmail();

  return (
    <Stack spacing="16px">
      <TextField
        label={t('tr_email')}
        value={userTmpEmail}
        onKeyDown={(e) => (e.key == 'Enter' ? handleSendLink() : null)}
        onChange={(e) => setUserTmpEmail(e.target.value)}
        sx={{ width: '100%', color: 'var(--black)' }}
        className="h4"
        helperText={
          oauth && (
            <Typography className="label-small-regular" color="var(--grey-350)">
              {t('tr_loginOAuthHint', { oauth })}
            </Typography>
          )
        }
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
    </Stack>
  );
};

export default OAuthEmail;
