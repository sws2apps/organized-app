import { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { Markup } from 'interweave';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import {
  currentMFAStageState,
  isAppLoadState,
  isCongAccountCreateState,
  isSetupState,
  isUnauthorizedRoleState,
  isUserEmailOTPState,
  isUserMfaSetupState,
  isUserMfaVerifyState,
  offlineOverrideState,
  visitorIDState,
} from '../../../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../../states/notification';
import { congAccountConnectedState } from '../../../states/congregation';
import { runUpdater } from '../../../utils/updater';
import { apiRequestTempOTPCode, apiHandleVerifyEmailOTP } from '../../../api';
import useFirebaseAuth from '../../../hooks/useFirebaseAuth';

const matchIsNumeric = (text) => {
  return !isNaN(Number(text));
};

const validateChar = (value, index) => {
  return matchIsNumeric(value);
};

const EmailOTP = () => {
  const cancel = useRef();

  const { t } = useTranslation('ui');

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setIsSetup = useSetRecoilState(isSetupState);
  const setIsAppLoad = useSetRecoilState(isAppLoadState);
  const setCongAccountConnected = useSetRecoilState(congAccountConnectedState);
  const setOfflineOverride = useSetRecoilState(offlineOverrideState);
  const setIsUnauthorizedRole = useSetRecoilState(isUnauthorizedRoleState);
  const setIsCongAccountCreate = useSetRecoilState(isCongAccountCreateState);
  const setIsUserEmailOTP = useSetRecoilState(isUserEmailOTPState);
  const setIsUserMfaSetup = useSetRecoilState(isUserMfaSetupState);
  const setIsUserMfaVerify = useSetRecoilState(isUserMfaVerifyState);

  const visitorID = useRecoilValue(visitorIDState);
  const currentMFAStage = useRecoilValue(currentMFAStageState);

  const [userOTP, setUserOTP] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessingOTP, setIsProcessingOTP] = useState(false);

  const { user } = useFirebaseAuth();

  const handleOtpChange = async (newValue) => {
    setUserOTP(newValue);
  };

  const handleSendEmailOTP = async () => {
    try {
      setIsProcessingOTP(true);
      cancel.current = false;

      const response = await apiRequestTempOTPCode(user.uid);

      if (!cancel.current) {
        if (response.success) {
          setAppMessage(t('emailOTPCodeSent'));
          setAppSeverity('success');
          setAppSnackOpen(true);
        }
        setIsProcessingOTP(false);
      }
    } catch (err) {
      if (!cancel.current) {
        setIsProcessingOTP(false);
        setAppMessage(err.message);
        setAppSeverity('error');
        setAppSnackOpen(true);
      }
    }
  };

  const handleVerifyEmailOTP = async () => {
    try {
      setIsProcessing(true);
      cancel.current = false;

      const response = await apiHandleVerifyEmailOTP(userOTP);

      if (!cancel.current) {
        if (response.success) {
          setIsSetup(false);

          await runUpdater();
          setTimeout(() => {
            setOfflineOverride(false);
            setCongAccountConnected(true);
            setIsAppLoad(false);
          }, [2000]);
        }

        if (response.unauthorized) {
          setIsUserEmailOTP(false);
          setIsUnauthorizedRole(true);
        }

        if (response.createCongregation) {
          setIsUserEmailOTP(false);
          setIsCongAccountCreate(true);
        }

        setIsProcessing(false);
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

  const handleAuthenticatorApp = () => {
    setIsUserEmailOTP(false);
    if (currentMFAStage === 'setup') setIsUserMfaSetup(true);
    if (currentMFAStage === 'verify') setIsUserMfaVerify(true);
  };

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, []);

  return (
    <Container sx={{ marginTop: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '15px' }}>
        {t('sendOTPEmail')}
      </Typography>

      <Typography sx={{ marginBottom: '15px' }}>
        <Markup content={t('sendOTPEmailDesc')} />
      </Typography>

      <Button
        variant="contained"
        disabled={isProcessingOTP || visitorID.length === 0}
        onClick={handleSendEmailOTP}
        endIcon={isProcessingOTP ? <CircularProgress size={25} /> : null}
      >
        {t('sendOTPCode')}
      </Button>

      <Box sx={{ width: '100%', maxWidth: '450px', marginTop: '20px' }}>
        <MuiOtpInput
          value={userOTP}
          onChange={handleOtpChange}
          length={6}
          display="flex"
          gap={1}
          validateChar={validateChar}
          TextFieldsProps={{ autoComplete: 'off' }}
        />
      </Box>

      <Box
        sx={{
          marginTop: '15px',
          display: 'flex',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <Button
          variant="contained"
          disabled={isProcessing || visitorID.length === 0}
          onClick={handleVerifyEmailOTP}
          endIcon={isProcessing ? <CircularProgress size={25} /> : null}
        >
          {t('mfaVerify')}
        </Button>

        <Link component="button" underline="none" variant="body1" onClick={handleAuthenticatorApp}>
          <Markup content={t('useAuthenticatorApp')} />
        </Link>
      </Box>
    </Container>
  );
};

export default EmailOTP;
