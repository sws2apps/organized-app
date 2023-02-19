import { useEffect, useRef, useState } from 'react';
import { getAuth } from '@firebase/auth';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
  isEmailAuthState,
  isOAuthAccountUpgradeState,
  isUserSignInState,
  isUserSignUpState,
  userEmailState,
} from '../../states/main';
import { isEmailValid } from '../../utils/emailValid';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { apiRequestPasswordlesssLink } from '../../api/auth';
import { dbUpdateAppSettings } from '../../indexedDb/dbAppSettings';

const EmailAuth = () => {
  const { t } = useTranslation('ui');

  const cancel = useRef();

  const setIsEmailAuth = useSetRecoilState(isEmailAuthState);
  const setUserSignIn = useSetRecoilState(isUserSignInState);
  const setUserSignUp = useSetRecoilState(isUserSignUpState);
  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const isOAuthAccountUpgrade = useRecoilValue(isOAuthAccountUpgradeState);
  const userEmail = useRecoilValue(userEmailState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [userTmpEmail, setUserTmpEmail] = useState('');

  const handleProviderSignIn = () => {
    setUserSignUp(false);
    setUserSignIn(true);
    setIsEmailAuth(false);
  };

  const handleSendLink = async () => {
    cancel.current = false;

    setIsProcessing(true);

    if (isOAuthAccountUpgrade) {
      const auth = await getAuth();
      if (auth) {
        const user = auth.currentUser;
        const currentEmail = user.email;

        if (currentEmail !== userTmpEmail) {
          setAppMessage(t('oauthAccountUpgradeEmailMismatch'));
          setAppSeverity('warning');
          setAppSnackOpen(true);
          return;
        }

        await apiRequestPasswordlesssLink(userTmpEmail, user.uid);
      }

      if (!auth) {
        await apiRequestPasswordlesssLink(userTmpEmail);
      }

      await dbUpdateAppSettings({ account_version: 'v2' });
    } else {
      await apiRequestPasswordlesssLink(userTmpEmail);
    }

    if (!isEmailValid(userTmpEmail)) {
      setAppMessage(t('emailNotSupported'));
      setAppSeverity('warning');
      setAppSnackOpen(true);
    }

    setIsProcessing(false);
  };

  useEffect(() => {
    const fillDetailsUpgrade = async () => {
      const auth = await getAuth();
      const user = auth?.currentUser;
      setUserTmpEmail(user?.email || userEmail);
    };

    if (isOAuthAccountUpgrade) fillDetailsUpgrade();

    return () => {
      cancel.current = true;
    };
  }, [isOAuthAccountUpgrade, userEmail]);

  return (
    <Container sx={{ marginTop: '20px' }}>
      {!isOAuthAccountUpgrade && (
        <>
          <Typography variant="h4" sx={{ marginBottom: '15px' }}>
            {t('emailAuth')}
          </Typography>

          <Typography sx={{ marginBottom: '20px' }}>{t('emailAuthDesc')}</Typography>
        </>
      )}

      <Box sx={{ maxWidth: '500px' }}>
        <TextField
          id="outlined-basic"
          label={t('email')}
          variant="outlined"
          sx={{ width: '100%' }}
          type="email"
          value={userTmpEmail}
          onChange={(e) => setUserTmpEmail(e.target.value)}
          inputProps={{ readOnly: isOAuthAccountUpgrade && userTmpEmail.length > 0 }}
        />

        <Box
          sx={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <Link component="button" underline="none" variant="body1" onClick={handleProviderSignIn}>
            {t('authProvider')}
          </Link>
          <Button
            variant="contained"
            disabled={isProcessing}
            endIcon={isProcessing ? <CircularProgress size={25} /> : null}
            onClick={handleSendLink}
          >
            {t('sendLink')}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default EmailAuth;
