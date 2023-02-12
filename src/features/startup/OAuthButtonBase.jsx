import {
  getAuth,
  indexedDBLocalPersistence,
  linkWithPopup,
  setPersistence,
  signInWithPopup,
  unlink,
} from 'firebase/auth';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {
  isAuthProcessingState,
  isEmailAuthState,
  isOAuthAccountUpgradeState,
  isUserSignInState,
  isUserSignUpState,
} from '../../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { dbUpdateAppSettings } from '../../indexedDb/dbAppSettings';

const OAuthButtonBase = ({ buttonStyles, logo, text, provider, isEmail }) => {
  const { t } = useTranslation('ui');

  const [isUserSignIn, setUserSignIn] = useRecoilState(isUserSignInState);
  const [isUserSignUp, setUserSignUp] = useRecoilState(isUserSignUpState);

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setIsEmailAuth = useSetRecoilState(isEmailAuthState);

  const isAuthProcessing = useRecoilValue(isAuthProcessingState);
  const isOAuthAccountUpgrade = useRecoilValue(isOAuthAccountUpgradeState);

  const handleOAuthAction = async () => {
    try {
      const auth = getAuth();
      await setPersistence(auth, indexedDBLocalPersistence);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const findPasswordProvider = user.providerData.find((provider) => provider.providerId === 'password');
      if (findPasswordProvider) await unlink(auth.currentUser, 'password');
    } catch (error) {
      if (error.code && error.code === 'auth/account-exists-with-different-credential') {
        setAppMessage(t('oauthAccountExistsWithDifferentCredential'));
        setAppSeverity('error');
        setAppSnackOpen(true);
        return;
      }

      setAppMessage(t('oauthError'));
      setAppSeverity('error');
      setAppSnackOpen(true);
    }
  };

  const handleEmailAuth = () => {
    setIsEmailAuth(true);
    if (isUserSignIn) setUserSignIn(false);
    if (isUserSignUp) setUserSignUp(false);
  };

  const handleOAuthUpgrade = async () => {
    try {
      const auth = getAuth();
      if (auth.currentUser) {
        await linkWithPopup(auth.currentUser, provider);
        await unlink(auth.currentUser, 'password');
      }

      if (!auth.currentUser) {
        const auth = getAuth();
        await setPersistence(auth, indexedDBLocalPersistence);
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const findPasswordProvider = user.providerData.find((provider) => provider.providerId === 'password');
        if (findPasswordProvider) await unlink(auth.currentUser, 'password');
      }

      await dbUpdateAppSettings({ account_version: 'v2' });
      setAppMessage(t('oauthAccountUpgradeComplete'));
      setAppSeverity('success');
      setAppSnackOpen(true);
      setTimeout(() => {
        window.location.href = './';
      }, 2000);
    } catch (err) {
      setAppMessage(t('oauthAccountUpgradeError'));
      setAppSeverity('error');
      setAppSnackOpen(true);
    }
  };

  const handleAction = () => {
    if (isEmail) {
      handleEmailAuth();
      return;
    }

    if (isOAuthAccountUpgrade) {
      handleOAuthUpgrade();
      return;
    }

    if (!isEmail) handleOAuthAction();
  };

  return (
    <Button
      variant="contained"
      sx={{ ...buttonStyles, height: '41px', padding: 0, width: '320px', justifyContent: 'flex-start' }}
      onClick={handleAction}
      disabled={isAuthProcessing}
    >
      <Box sx={{ width: '50px', display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            backgroundColor: 'white',
            padding: '10px',
            marginLeft: '1px',
            borderTopLeftRadius: '4px',
            borderBottomLeftRadius: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img alt="Microsoft Icon" src={logo} style={{ width: '18px', height: '18px' }} />
        </Box>
      </Box>
      <Typography sx={{ textTransform: 'none' }}>{text}</Typography>
    </Button>
  );
};

export default OAuthButtonBase;
