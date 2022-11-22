import { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import ErrorIcon from '@mui/icons-material/Error';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import {
  apiHostState,
  isEmailNotVerifiedState,
  isUserSignInState,
  userEmailState,
  visitorIDState,
} from '../../../states/main';

const EmailNotVerified = () => {
  const cancel = useRef();

  const { t } = useTranslation();

  const setUserSignIn = useSetRecoilState(isUserSignInState);
  const setEmailNotVerified = useSetRecoilState(isEmailNotVerifiedState);

  const apiHost = useRecoilValue(apiHostState);
  const userEmail = useRecoilValue(userEmailState);
  const visitorID = useRecoilValue(visitorIDState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errTxt, setErrTxt] = useState('');

  const handleSignIn = () => {
    setUserSignIn(true);
    setEmailNotVerified(false);
  };

  const handleResendVerification = async () => {
    try {
      cancel.current = false;

      setErrTxt('');
      setIsProcessing(true);

      if (apiHost !== '') {
        const res = await fetch(`${apiHost}api/users/resend-verification`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            visitorid: visitorID,
            email: userEmail,
          },
        });

        if (!cancel.current) {
          const data = await res.json();
          setIsProcessing(false);

          if (res.status !== 200) {
            setErrTxt(data.message);
          }
        }
      }
    } catch (err) {
      if (!cancel.current) {
        setIsProcessing(false);
        setErrTxt(err.message);
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
        {t('login.verifyEmail')}
      </Typography>

      {!isProcessing && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '20px',
            margin: '25px 0',
          }}
        >
          {errTxt.length === 0 && (
            <>
              <CheckCircleIcon
                color="success"
                sx={{
                  fontSize: '80px',
                  cursor: 'pointer',
                }}
              />
              <Typography>{t('login.verifyAccount')}</Typography>
            </>
          )}
          {errTxt.length > 0 && (
            <>
              <ErrorIcon
                color="error"
                sx={{
                  fontSize: '80px',
                  cursor: 'pointer',
                }}
              />
              <Typography>{t('login.resendError', { error: errTxt })}</Typography>
            </>
          )}
        </Box>
      )}

      {isProcessing && (
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '15px',
          }}
        >
          <CircularProgress disableShrink color="secondary" size={'70px'} />
        </Container>
      )}

      <Box
        sx={{
          marginTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '10px',
        }}
      >
        <Link component="button" underline="none" variant="body1" onClick={handleResendVerification}>
          {t('login.resendVerify')}
        </Link>
        <Link component="button" underline="none" variant="body1" onClick={handleSignIn}>
          {t('login.proceedSignIn')}
        </Link>
      </Box>
    </Container>
  );
};

export default EmailNotVerified;
