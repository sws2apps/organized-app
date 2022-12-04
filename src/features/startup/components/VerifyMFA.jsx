import { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { MuiOtpInput } from 'mui-one-time-password-input';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../../states/notification';
import {
  apiHostState,
  isAppLoadState,
  isCongAccountCreateState,
  isReEnrollMFAState,
  isSetupState,
  isUnauthorizedRoleState,
  isUserMfaSetupState,
  isUserMfaVerifyState,
  offlineOverrideState,
  qrCodePathState,
  secretTokenPathState,
  startupProgressState,
  userEmailState,
  userIDState,
  userPasswordState,
  visitorIDState,
} from '../../../states/main';
import { congAccountConnectedState, congIDState, isAdminCongState } from '../../../states/congregation';
import { encryptString } from '../../../utils/swsEncryption';
import { dbUpdateAppSettings } from '../../../indexedDb/dbAppSettings';
import { loadApp } from '../../../utils/app';
import { runUpdater } from '../../../utils/updater';

const matchIsNumeric = (text) => {
  return !isNaN(Number(text));
};

const validateChar = (value, index) => {
  return matchIsNumeric(value);
};

const VerifyMFA = () => {
  const cancel = useRef();

  const { t } = useTranslation();

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
  const setStartupProgress = useSetRecoilState(startupProgressState);
  const setCongAccountConnected = useSetRecoilState(congAccountConnectedState);
  const setOfflineOverride = useSetRecoilState(offlineOverrideState);
  const setIsAdminCong = useSetRecoilState(isAdminCongState);
  const setCongID = useSetRecoilState(congIDState);
  const setUserID = useSetRecoilState(userIDState);
  const setIsReEnrollMFA = useSetRecoilState(isReEnrollMFAState);
  const setIsUserMfaSetup = useSetRecoilState(isUserMfaSetupState);
  const setQrCodePath = useSetRecoilState(qrCodePathState);
  const setSecretTokenPath = useSetRecoilState(secretTokenPathState);

  const apiHost = useRecoilValue(apiHostState);
  const userEmail = useRecoilValue(userEmailState);
  const visitorID = useRecoilValue(visitorIDState);
  const userPwd = useRecoilValue(userPasswordState);

  const handleOtpChange = async (newValue) => {
    setUserOTP(newValue);
  };

  const handleVerifyOTP = useCallback(async () => {
    try {
      cancel.current = false;

      if (userOTP.length === 6) {
        setIsProcessing(true);
        const reqPayload = {
          token: userOTP,
        };

        if (apiHost !== '') {
          const res = await fetch(`${apiHost}api/mfa/verify-token`, {
            method: 'POST',
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
              const { id, cong_id, cong_name, cong_role, cong_number } = data;

              if (cong_name.length > 0) {
                if (cong_role.length > 0) {
                  // role admin
                  if (cong_role.includes('admin')) {
                    setIsAdminCong(true);
                  }

                  // role approved
                  if (cong_role.includes('lmmo') || cong_role.includes('lmmo-backup')) {
                    setCongID(cong_id);
                    // encrypt email & pwd
                    const encPwd = await encryptString(userPwd, JSON.stringify({ email: userEmail, pwd: userPwd }));

                    // save congregation update if any
                    let obj = {};
                    obj.username = data.username;
                    obj.isCongVerified = true;
                    obj.cong_name = cong_name;
                    obj.cong_number = cong_number;
                    obj.userPass = encPwd;
                    obj.isLoggedOut = false;
                    setUserID(id);

                    await dbUpdateAppSettings(obj);

                    await loadApp();

                    setIsSetup(false);

                    await runUpdater();
                    setTimeout(() => {
                      setStartupProgress(0);
                      setOfflineOverride(false);
                      setCongAccountConnected(true);
                      setIsAppLoad(false);
                    }, [2000]);
                  }
                  return;
                }

                setIsProcessing(false);
                setIsUserMfaVerify(false);
                setIsUnauthorizedRole(true);
                return;
              }

              // congregation not assigned
              setIsProcessing(false);
              setIsUserMfaVerify(false);
              setIsCongAccountCreate(true);
            } else {
              if (data.message) {
                setIsProcessing(false);
                setAppMessage(data.message);
                setAppSeverity('warning');
                setAppSnackOpen(true);
              } else {
                setSecretTokenPath(data.secret);
                setQrCodePath(data.qrCode);
                setIsReEnrollMFA(true);
                setIsUserMfaSetup(true);
                setIsProcessing(false);
                setIsUserMfaVerify(false);
              }
            }
          }
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
  }, [
    apiHost,
    setAppMessage,
    setAppSeverity,
    setAppSnackOpen,
    setCongAccountConnected,
    setCongID,
    setIsAdminCong,
    setIsAppLoad,
    setIsCongAccountCreate,
    setIsReEnrollMFA,
    setIsSetup,
    setIsUnauthorizedRole,
    setIsUserMfaSetup,
    setIsUserMfaVerify,
    setOfflineOverride,
    setQrCodePath,
    setSecretTokenPath,
    setStartupProgress,
    setUserID,
    userEmail,
    userOTP,
    userPwd,
    visitorID,
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
      setUserOTP(text)
    };

    window.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  return (
    <Container sx={{ marginTop: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '15px' }}>
        {t('login.mfaVerifyTitle')}
      </Typography>

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
          marginTop: '20px',
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
          {t('login.mfaVerify')}
        </Button>
      </Box>
    </Container>
  );
};

export default VerifyMFA;
