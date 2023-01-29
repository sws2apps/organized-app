import { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { isEmailValid } from '../../utils/emailValid';
import {
  apiHostState,
  isAppLoadState,
  isEmailNotVerifiedState,
  isOnlineState,
  isSetupState,
  isUserMfaSetupState,
  isUserMfaVerifyState,
  isUserSignInState,
  isUserSignUpState,
  offlineOverrideState,
  qrCodePathState,
  secretTokenPathState,
  startupProgressState,
  userEmailState,
  userPasswordState,
  visitorIDState,
} from '../../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { dbGetAppSettings, dbUpdateAppSettings } from '../../indexedDb/dbAppSettings';
import { decryptString } from '../../utils/swsEncryption';
import { loadApp } from '../../utils/app';
import { runUpdater } from '../../utils/updater';
import UserEmailField from './UserEmailField';
import UserPasswordField from './UserPasswordField';
import TogglePassword from './TogglePassword';
import { loginStyles } from './sharedStyles';

const SignIn = () => {
  const cancel = useRef();

  const { t } = useTranslation('ui');

  const setUserMfaSetup = useSetRecoilState(isUserMfaSetupState);
  const setUserMfaVerify = useSetRecoilState(isUserMfaVerifyState);
  const setUserSignIn = useSetRecoilState(isUserSignInState);
  const setUserSignUp = useSetRecoilState(isUserSignUpState);
  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setEmailNotVerified = useSetRecoilState(isEmailNotVerifiedState);
  const setUserEmail = useSetRecoilState(userEmailState);
  const setUserPassword = useSetRecoilState(userPasswordState);
  const setQrCodePath = useSetRecoilState(qrCodePathState);
  const setSecretTokenPath = useSetRecoilState(secretTokenPathState);
  const setIsSetup = useSetRecoilState(isSetupState);
  const setIsAppLoad = useSetRecoilState(isAppLoadState);
  const setStartupProgress = useSetRecoilState(startupProgressState);

  const visitorID = useRecoilValue(visitorIDState);
  const apiHost = useRecoilValue(apiHostState);
  const isOnline = useRecoilValue(isOnlineState);
  const offlineOverride = useRecoilValue(offlineOverrideState);

  const [userTmpPwd, setUserTmpPwd] = useState('');
  const [userTmpEmail, setUserTmpEmail] = useState('');
  const [hasErrorEmail, setHasErrorEmail] = useState(false);
  const [hasErrorPwd, setHasErrorPwd] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [isInternetNeeded, setIsInternetNeeded] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const togglePwd = () => {
    setShowPwd((prev) => {
      return !prev;
    });
  };

  const handleSignUp = () => {
    setUserSignUp(true);
    setUserSignIn(false);
  };

  const handleEmailChange = (value) => {
    value = value.toLowerCase();
    setUserTmpEmail(value);
  };

  const signInSwitch = async () => {
    if (isInternetNeeded) {
      await handleSignIn();
    } else {
      await handleSignInWithoutInternet();
    }
  };

  const handleSignInWithoutInternet = async () => {
    try {
      setHasErrorEmail(false);
      setHasErrorPwd(false);
      if (isEmailValid(userTmpEmail) && userTmpPwd.length >= 10) {
        setIsProcessing(true);

        const { userPass } = await dbGetAppSettings();
        const crdParse = await decryptString(userTmpPwd, userPass);

        if (userTmpEmail === crdParse.email && userTmpPwd === crdParse.pwd) {
          await loadApp();
          await dbUpdateAppSettings({ isLoggedOut: false });

          setUserEmail(userTmpEmail);
          localStorage.setItem('email', userTmpEmail);

          setUserPassword(userTmpPwd);

          setIsSetup(false);

          await runUpdater();

          setTimeout(() => {
            setIsAppLoad(false);
            setStartupProgress(0);
          }, [2000]);
        } else {
          setAppMessage(t('incorrectInfo'));
          setAppSeverity('warning');
          setIsProcessing(false);
          setAppSnackOpen(true);
        }
      } else {
        if (!isEmailValid(userTmpEmail)) {
          setHasErrorEmail(true);
        }
        if (userTmpPwd.length < 10) {
          setHasErrorPwd(true);
        }
      }
    } catch (err) {
      setAppMessage(t('incorrectInfo'));
      setAppSeverity('warning');
      setIsProcessing(false);
      setAppSnackOpen(true);
    }
  };

  const handleSignIn = async () => {
    try {
      cancel.current = false;

      setHasErrorEmail(false);
      setHasErrorPwd(false);
      if (isEmailValid(userTmpEmail) && userTmpPwd.length >= 10) {
        setIsProcessing(true);

        const reqPayload = {
          email: userTmpEmail,
          password: userTmpPwd,
          visitorid: visitorID,
        };

        if (apiHost !== '') {
          const res = await fetch(`${apiHost}user-login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqPayload),
          });

          if (!cancel.current) {
            const data = await res.json();
            if (res.status === 200) {
              setUserEmail(userTmpEmail);
              localStorage.setItem('email', userTmpEmail);
              setUserPassword(userTmpPwd);
              setIsProcessing(false);
              setUserMfaVerify(true);
              setUserSignIn(false);
            } else {
              if (data.secret && data.qrCode) {
                setUserEmail(userTmpEmail);
                localStorage.setItem('email', userTmpEmail);
                setUserPassword(userTmpPwd);
                setIsProcessing(false);
                setSecretTokenPath(data.secret);
                setQrCodePath(data.qrCode);
                setUserMfaSetup(true);
                setUserSignIn(false);
              } else if (data.message === 'NOT_VERIFIED') {
                setUserEmail(userTmpEmail);
                localStorage.setItem('email', userTmpEmail);
                setIsProcessing(false);
                setEmailNotVerified(true);
                setUserSignIn(false);
              } else {
                let warnMsg = '';
                if (
                  data.message === 'EMAIL_NOT_FOUND' ||
                  data.message === 'INVALID_EMAIL' ||
                  data.message === 'MISSING_EMAIL'
                ) {
                  warnMsg = t('accountNotFound');
                } else if (data.message === 'INVALID_PASSWORD') {
                  warnMsg = t('incorrectInfo');
                } else if (data.message === 'USER_DISABLED') {
                  warnMsg = t('accountDisabled');
                } else if (data.message === 'BLOCKED_TEMPORARILY_TRY_AGAIN' || data.message === 'BLOCKED_TEMPORARILY') {
                  warnMsg = t('hostBlocked');
                } else {
                  warnMsg = t('errorTryAgain');
                }
                setIsProcessing(false);
                setAppMessage(warnMsg);
                setAppSeverity('warning');
                setAppSnackOpen(true);
              }
            }
          }
        }
      } else {
        if (!isEmailValid(userTmpEmail)) {
          setHasErrorEmail(true);
        }
        if (userTmpPwd.length < 10) {
          setHasErrorPwd(true);
        }
      }
    } catch (err) {
      if (!cancel.current) {
        setIsProcessing(false);
        setAppMessage(err.message);
        setAppSeverity('error');
        setAppSnackOpen(true);
      }
    }
  };

  useEffect(() => {
    const checkDbs = async () => {
      if (offlineOverride) {
        setIsInternetNeeded(true);
      } else {
        const { username, userPass } = await dbGetAppSettings();
        if (!username || !userPass) {
          setIsInternetNeeded(true);
        } else {
          setIsInternetNeeded(false);
        }
      }
    };

    checkDbs();
  }, [offlineOverride]);

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, []);

  return (
    <Container sx={{ marginTop: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '15px' }}>
        {t('signIn')}
      </Typography>

      <Typography sx={{ marginBottom: '20px' }}>
        {isInternetNeeded ? t('signInWithInternet') : t('signInNoInternet')}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '500px' }}>
        <UserEmailField
          userEmail={userTmpEmail}
          setUserEmail={(value) => handleEmailChange(value)}
          hasErrorEmail={hasErrorEmail}
        />

        <UserPasswordField
          userPwd={userTmpPwd}
          setUserPwd={(value) => setUserTmpPwd(value)}
          hasErrorPwd={hasErrorPwd}
          showPwd={showPwd}
          label={t('password')}
        />

        <TogglePassword showPwd={showPwd} togglePwd={(value) => togglePwd(value)} />
      </Box>

      <Box sx={loginStyles}>
        <Link component="button" underline="none" variant="body1" onClick={handleSignUp}>
          {t('createSwsAccount')}
        </Link>
        <Button
          variant="contained"
          disabled={!isOnline || isProcessing || visitorID.length === 0}
          onClick={signInSwitch}
          endIcon={isProcessing ? <CircularProgress size={25} /> : null}
        >
          {t('signIn')}
        </Button>
      </Box>
    </Container>
  );
};

export default SignIn;
