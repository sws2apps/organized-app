import { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { isEmailValid } from '../../../utils/emailValid';
import {
  apiHostState,
  isEmailNotVerifiedState,
  isOnlineState,
  isUserSignInState,
  isUserSignUpState,
  visitorIDState,
} from '../../../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../../states/notification';

const SignUp = () => {
  const cancel = useRef();

  const { t } = useTranslation();

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

  const handleSignUp = async () => {
    try {
      cancel.current = false;

      setHasErrorEmail(false);
      setHasErrorPwd(false);
      setHasErrorConfirmPwd(false);
      if (
        userTmpFullname.length >= 3 &&
        isEmailValid(userTmpEmail) &&
        userTmpPwd.length >= 10 &&
        userTmpPwd === userTmpConfirmPwd
      ) {
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
                warnMsg = t('login.accountExist');
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
        if (!isEmailValid(userTmpEmail)) {
          setHasErrorEmail(true);
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
        setAppMessage(t('login.createFailed'));
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
        {t('login.createSwsAccount')}
      </Typography>

      <Typography sx={{ marginBottom: '20px' }}>{t('login.newUserAccount')}</Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '500px' }}>
        <TextField
          sx={{ width: '100%' }}
          id="outlined-fullname"
          label={t('login.fullname')}
          variant="outlined"
          autoComplete="off"
          required
          value={userTmpFullname}
          onChange={(e) => setUserTmpFullname(e.target.value)}
          error={hasErrorFullname ? true : false}
        />

        <TextField
          sx={{ marginTop: '20px', width: '100%' }}
          id="outlined-email"
          label={t('login.email')}
          variant="outlined"
          autoComplete="off"
          required
          value={userTmpEmail}
          onChange={(e) => setUserTmpEmail(e.target.value)}
          error={hasErrorEmail ? true : false}
        />

        <TextField
          sx={{ marginTop: '20px', width: '100%' }}
          id="outlined-password"
          label={t('login.password')}
          type={showPwd ? '' : 'password'}
          variant="outlined"
          autoComplete="off"
          required
          value={userTmpPwd}
          onChange={(e) => setUserTmpPwd(e.target.value)}
          error={hasErrorPwd ? true : false}
        />

        <TextField
          sx={{ marginTop: '20px', width: '100%' }}
          id="outlined-confirm-password"
          label={t('login.confirmPassword')}
          type={showPwd ? '' : 'password'}
          variant="outlined"
          autoComplete="off"
          required
          value={userTmpConfirmPwd}
          onChange={(e) => setUserTmpConfirmPwd(e.target.value)}
          error={hasErrorConfirmPwd ? true : false}
        />

        <FormControlLabel
          control={<Checkbox id="checkShowPwd" checked={showPwd} onChange={togglePwd} />}
          label={<Typography sx={{ lineHeight: 1.2 }}>{t('login.showPassword')}</Typography>}
          sx={{
            width: '100%',
            marginTop: '15px',
          }}
        />
      </Box>

      <Box
        sx={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '500px',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <Link component="button" underline="none" variant="body1" onClick={handleSignIn}>
          {t('login.hasAccount')}
        </Link>
        <Button
          variant="contained"
          disabled={!isOnline || isProcessing || visitorID.length === 0}
          onClick={handleSignUp}
          endIcon={isProcessing ? <CircularProgress size={25} /> : null}
        >
          {t('login.createAccount')}
        </Button>
      </Box>
    </Container>
  );
};

export default SignUp;
