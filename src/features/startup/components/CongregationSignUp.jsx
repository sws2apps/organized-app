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
import { appMessageState, appSeverityState, appSnackOpenState } from '../../../states/notification';
import {
  apiHostState,
  isCongAccountCreateState,
  isCongRequestSentState,
  isCongWaitRequestState,
  isUserSignInState,
  userEmailState,
  visitorIDState,
} from '../../../states/main';

const CongregationSignUp = () => {
  const cancel = useRef();

  const { t } = useTranslation();

  const [userTmpCongName, setUserTmpCongName] = useState('');
  const [userTmpCongNumber, setUserTmpCongNumber] = useState('');
  const [hasErrorCongName, setHasErrorCongName] = useState(false);
  const [hasErrorCongNumber, setHasErrorCongNumber] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const setUserSignIn = useSetRecoilState(isUserSignInState);
  const setIsCongAccountCreate = useSetRecoilState(isCongAccountCreateState);
  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setIsCongRequestSent = useSetRecoilState(isCongRequestSentState);
  const setIsCongWaitRequest = useSetRecoilState(isCongWaitRequestState);

  const apiHost = useRecoilValue(apiHostState);
  const userEmail = useRecoilValue(userEmailState);
  const visitorID = useRecoilValue(visitorIDState);

  const handleSignIn = () => {
    setUserSignIn(true);
    setIsCongAccountCreate(false);
  };

  const handleSignUp = async () => {
    try {
      cancel.current = false;

      setHasErrorCongName(false);
      setHasErrorCongNumber(false);
      if (userTmpCongName.length > 0 && userTmpCongNumber.length > 0) {
        setIsProcessing(true);
        const reqPayload = {
          email: userEmail,
          cong_name: userTmpCongName,
          cong_number: userTmpCongNumber,
          app_requestor: 'lmmo',
        };

        if (apiHost !== '') {
          const res = await fetch(`${apiHost}api/congregations`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              visitorid: visitorID,
              email: userEmail,
            },
            body: JSON.stringify(reqPayload),
          });

          if (!cancel.current) {
            const data = await res.json();
            if (res.status === 200) {
              setIsCongRequestSent(true);
              setIsProcessing(false);
              setIsCongAccountCreate(false);
            } else if (res.status === 405) {
              setIsCongWaitRequest(true);
              setIsProcessing(false);
              setIsCongAccountCreate(false);
            } else {
              setIsProcessing(false);
              setAppMessage(data.message);
              setAppSeverity('warning');
              setAppSnackOpen(true);
            }
          }
        }
      } else {
        if (userTmpCongName.length === 0) {
          setHasErrorCongName(true);
        }
        if (userTmpCongNumber.length === 0) {
          setHasErrorCongNumber(true);
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
        {t('login.createCongregationAccount')}
      </Typography>

      <Box
        sx={{
          width: '100%',
          maxWidth: '500px',
          margin: '30px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <TextField
          id="outlined-email"
          label={t('login.congregationName')}
          variant="outlined"
          autoComplete="off"
          required
          value={userTmpCongName}
          onChange={(e) => setUserTmpCongName(e.target.value)}
          error={hasErrorCongName ? true : false}
        />
        <TextField
          id="outlined-email"
          label={t('login.congregationNumber')}
          variant="outlined"
          autoComplete="off"
          type="number"
          required
          value={userTmpCongNumber}
          onChange={(e) => setUserTmpCongNumber(e.target.value)}
          error={hasErrorCongNumber ? true : false}
        />
      </Box>

      <Box
        sx={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '500px',
          width: '100%',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <Link component="button" underline="none" variant="body2" onClick={handleSignIn}>
          {t('login.hasAccount')}
        </Link>
        <Button
          variant="contained"
          disabled={isProcessing}
          onClick={handleSignUp}
          endIcon={isProcessing ? <CircularProgress size={25} /> : null}
        >
          {t('login.requestAccount')}
        </Button>
      </Box>
    </Container>
  );
};

export default CongregationSignUp;
