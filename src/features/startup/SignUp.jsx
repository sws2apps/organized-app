import { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { isEmailValid } from '../../utils/emailValid';
import {
  apiHostState,
  isEmailNotVerifiedState,
  isOnlineState,
  isUserSignInState,
  isUserSignUpState,
  visitorIDState,
} from '../../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { loginStyles } from './sharedStyles';
import UserEmailField from './UserEmailField';
import UserPasswordField from './UserPasswordField';
import TogglePassword from './TogglePassword';

const SignUp = () => {
  const cancel = useRef();

  const { t } = useTranslation('ui');

  const setUserSignIn = useSetRecoilState(isUserSignInState);
  const setUserSignUp = useSetRecoilState(isUserSignUpState);
  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setEmailNotVerified = useSetRecoilState(isEmailNotVerifiedState);

  const visitorID = useRecoilValue(visitorIDState);
  const isOnline = useRecoilValue(isOnlineState);
  const apiHost = useRecoilValue(apiHostState);

  const [userTmpFullname, setUserTmpFullname] = useState('');
  const [userTmpPwd, setUserTmpPwd] = useState('');
  const [userTmpConfirmPwd, setUserTmpConfirmPwd] = useState('');
  const [userTmpEmail, setUserTmpEmail] = useState('');
  const [hasErrorFullname, setHasErrorFullname] = useState(false);
  const [hasErrorEmail, setHasErrorEmail] = useState(false);
  const [hasErrorPwd, setHasErrorPwd] = useState(false);
  const [hasErrorConfirmPwd, setHasErrorConfirmPwd] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const togglePwd = () => {
    setShowPwd((prev) => {
      return !prev;
    });
  };

  const handleSignIn = () => {
    setUserSignIn(true);
    setUserSignUp(false);
  };

  const handleEmailChange = (value) => {
    value = value.toLowerCase();
    setUserTmpEmail(value);
  };

  const handleSignUp = async () => {
    try {
      cancel.current = false;

      const isValidEmail = isEmailValid(userTmpEmail);

      setHasErrorEmail(false);
      setHasErrorPwd(false);
      setHasErrorConfirmPwd(false);
      if (userTmpFullname.length >= 3 && isValidEmail && userTmpPwd.length >= 10 && userTmpPwd === userTmpConfirmPwd) {
        setIsProcessing(true);
        const reqPayload = {
          email: userTmpEmail,
          password: userTmpPwd,
          fullname: userTmpFullname,
        };

        if (apiHost !== '') {
          const res = await fetch(`${apiHost}api/users/create-account`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqPayload),
          });

          if (!cancel.current) {
            const data = await res.json();
            if (res.status === 200) {
              setEmailNotVerified(true);
              setIsProcessing(false);
              setUserSignUp(false);
            } else {
              let warnMsg = '';
              if (data.message === 'ACCOUNT_IN_USE') {
                warnMsg = t('accountExist');
              } else {
                warnMsg = data.message;
              }
              setIsProcessing(false);
              setAppMessage(warnMsg);
              setAppSeverity('warning');
              setAppSnackOpen(true);
            }
          }
        }
      } else {
        if (userTmpFullname.length < 3) {
          setHasErrorFullname(true);
        }
        if (!isValidEmail) {
          setHasErrorEmail(true);
          setAppMessage(t('emailNotSupported'));
          setAppSeverity('warning');
          setAppSnackOpen(true);
        }
        if (userTmpPwd.length < 10) {
          setHasErrorPwd(true);
        }
        if (userTmpConfirmPwd.length < 10 || userTmpPwd !== userTmpConfirmPwd) {
          setHasErrorConfirmPwd(true);
        }
      }
    } catch (err) {
      if (!cancel.current) {
        setIsProcessing(false);
        setAppMessage(t('createFailed'));
        setAppSeverity('error');
        setAppSnackOpen(true);
      }
    }
  };

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, []);

  return (
    <Container sx={{ marginTop: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '15px' }}>
        {t('createSwsAccount')}
      </Typography>

      <Typography sx={{ marginBottom: '20px' }}>{t('newUserAccount')}</Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '500px' }}>
        <TextField
          sx={{ width: '100%' }}
          id="outlined-fullname"
          label={t('fullname')}
          variant="outlined"
          autoComplete="off"
          required
          value={userTmpFullname}
          onChange={(e) => setUserTmpFullname(e.target.value)}
          error={hasErrorFullname ? true : false}
        />

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

        <UserPasswordField
          userPwd={userTmpConfirmPwd}
          setUserPwd={(value) => setUserTmpConfirmPwd(value)}
          hasErrorPwd={hasErrorConfirmPwd}
          showPwd={showPwd}
          label={t('confirmPassword')}
        />

        <TogglePassword showPwd={showPwd} togglePwd={togglePwd} />
      </Box>

      <Box sx={loginStyles}>
        <Link component="button" underline="none" variant="body1" onClick={handleSignIn}>
          {t('hasAccount')}
        </Link>
        <Button
          variant="contained"
          disabled={!isOnline || isProcessing || visitorID.length === 0}
          onClick={handleSignUp}
          endIcon={isProcessing ? <CircularProgress size={25} /> : null}
        >
          {t('createAccount')}
        </Button>
      </Box>
    </Container>
  );
};

export default SignUp;
