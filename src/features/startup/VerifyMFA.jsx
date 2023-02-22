import { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { MuiOtpInput } from 'mui-one-time-password-input';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import {
  isAppLoadState,
  isCongAccountCreateState,
  isReEnrollMFAState,
  isSetupState,
  isUnauthorizedRoleState,
  isUserMfaSetupState,
  isUserMfaVerifyState,
  offlineOverrideState,
  visitorIDState,
} from '../../states/main';
import { congAccountConnectedState } from '../../states/congregation';
import { apiHandleVerifyOTP } from '../../api/auth';
import { runUpdater } from '../../utils/updater';

const matchIsNumeric = (text) => {
  return !isNaN(Number(text));
};

const validateChar = (value, index) => {
  return matchIsNumeric(value);
};

const VerifyMFA = () => {
  const cancel = useRef();
  const trustDevice = useRef();

  const { t } = useTranslation('ui');

  const [isProcessing, setIsProcessing] = useState(false);
  const [userOTP, setUserOTP] = useState('');

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setIsCongAccountCreate = useSetRecoilState(isCongAccountCreateState);
  const setIsUserMfaVerify = useSetRecoilState(isUserMfaVerifyState);
  const setIsUnauthorizedRole = useSetRecoilState(isUnauthorizedRoleState);
  const setIsSetup = useSetRecoilState(isSetupState);
  const setIsAppLoad = useSetRecoilState(isAppLoadState);
  const setCongAccountConnected = useSetRecoilState(congAccountConnectedState);
  const setOfflineOverride = useSetRecoilState(offlineOverrideState);
  const setIsReEnrollMFA = useSetRecoilState(isReEnrollMFAState);
  const setIsUserMfaSetup = useSetRecoilState(isUserMfaSetupState);

  const visitorID = useRecoilValue(visitorIDState);

  const handleOtpChange = async (newValue) => {
    setUserOTP(newValue);
  };

  const handleVerifyOTP = useCallback(async () => {
    try {
      setIsProcessing(true);
      cancel.current = false;

      const response = await apiHandleVerifyOTP(userOTP, false, trustDevice.current.checked);

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
          setIsUserMfaVerify(false);
          setIsUnauthorizedRole(true);
        }

        if (response.reenroll) {
          setIsReEnrollMFA(true);
          setIsUserMfaSetup(true);
          setIsUserMfaVerify(false);
        }

        if (response.createCongregation) {
          setIsUserMfaVerify(false);
          setIsCongAccountCreate(true);
        }

        setIsProcessing(false);
        setOfflineOverride(false);
      }
    } catch (err) {
      if (!cancel.current) {
        setIsProcessing(false);
        setAppMessage(err.message);
        setAppSeverity('error');
        setAppSnackOpen(true);
      }
    }
  }, [
    setAppMessage,
    setAppSeverity,
    setAppSnackOpen,
    setCongAccountConnected,
    setIsAppLoad,
    setIsCongAccountCreate,
    setIsReEnrollMFA,
    setIsSetup,
    setIsUnauthorizedRole,
    setIsUserMfaSetup,
    setIsUserMfaVerify,
    setOfflineOverride,
    userOTP,
  ]);

  useEffect(() => {
    if (userOTP.length === 6) {
      handleVerifyOTP();
    }
  }, [handleVerifyOTP, userOTP]);

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, []);

  useEffect(() => {
    const handlePaste = (e) => {
      const text = (e.clipboardData || window.clipboardData).getData('text');
      setUserOTP(text);
    };

    window.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  return (
    <Container sx={{ marginTop: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '15px' }}>
        {t('mfaVerifyTitle')}
      </Typography>

      <Typography sx={{ marginBottom: '15px' }}>{t('mfaVerifyDesc')}</Typography>

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

      <Box sx={{ marginTop: '15px' }}>
        <FormControlLabel control={<Checkbox inputRef={trustDevice} />} label={t('trustDevice')} />
      </Box>

      <Box
        sx={{
          marginTop: '15px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          maxWidth: '450px',
          width: '100%',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <Button
          variant="contained"
          disabled={isProcessing || visitorID.length === 0}
          onClick={handleVerifyOTP}
          endIcon={isProcessing ? <CircularProgress size={25} /> : null}
        >
          {t('mfaVerify')}
        </Button>
      </Box>
    </Container>
  );
};

export default VerifyMFA;
