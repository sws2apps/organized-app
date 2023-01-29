import { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { Markup } from 'interweave';
import { MuiOtpInput } from 'mui-one-time-password-input';
import QRCode from 'qrcode';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import TabPanel from '../../components/TabPanel';
import {
  isAppLoadState,
  isCongAccountCreateState,
  isReEnrollMFAState,
  isSetupState,
  isUnauthorizedRoleState,
  isUserMfaSetupState,
  offlineOverrideState,
  qrCodePathState,
  secretTokenPathState,
  startupProgressState,
  visitorIDState,
} from '../../states/main';
import { apiHandleVerifyOTP } from '../../utils/app';
import { runUpdater } from '../../utils/updater';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { congAccountConnectedState } from '../../states/congregation';

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const matchIsNumeric = (text) => {
  return !isNaN(Number(text));
};

const validateChar = (value, index) => {
  return matchIsNumeric(value);
};

const SetupMFA = () => {
  const cancel = useRef();

  const { t } = useTranslation('ui');

  const [isProcessing, setIsProcessing] = useState(false);
  const [userOTP, setUserOTP] = useState('');
  const [imgPath, setImgPath] = useState('');
  const [isNoQR, setIsNoQR] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setIsCongAccountCreate = useSetRecoilState(isCongAccountCreateState);
  const setIsUserMfaSetup = useSetRecoilState(isUserMfaSetupState);
  const setIsUnauthorizedRole = useSetRecoilState(isUnauthorizedRoleState);
  const setIsSetup = useSetRecoilState(isSetupState);
  const setIsAppLoad = useSetRecoilState(isAppLoadState);
  const setStartupProgress = useSetRecoilState(startupProgressState);
  const setCongAccountConnected = useSetRecoilState(congAccountConnectedState);
  const setOfflineOverride = useSetRecoilState(offlineOverrideState);

  const qrCodePath = useRecoilValue(qrCodePathState);
  const token = useRecoilValue(secretTokenPathState);
  const visitorID = useRecoilValue(visitorIDState);
  const isReEnrollMFA = useRecoilValue(isReEnrollMFAState);

  const handleTabChange = (e, newValue) => {
    setTabValue(newValue);
  };

  const handleCopyClipboard = async (text) => {
    await navigator.clipboard.writeText(text);
  };

  const handleVerifyOTP = useCallback(async () => {
    try {
      setIsProcessing(true);
      cancel.current = false;

      const response = await apiHandleVerifyOTP(userOTP, true);
      if (!cancel.current) {
        if (response.success) {
          setIsSetup(false);

          await runUpdater();
          setTimeout(() => {
            setStartupProgress(0);
            setOfflineOverride(false);
            setCongAccountConnected(true);
            setIsAppLoad(false);
          }, [2000]);
        }

        if (response.unauthorized) {
          setIsUserMfaSetup(false);
          setIsUnauthorizedRole(true);
        }

        if (response.createCongregation) {
          setIsUserMfaSetup(false);
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
  }, [
    setAppMessage,
    setAppSeverity,
    setAppSnackOpen,
    setCongAccountConnected,
    setIsAppLoad,
    setIsCongAccountCreate,
    setIsSetup,
    setIsUnauthorizedRole,
    setIsUserMfaSetup,
    setOfflineOverride,
    setStartupProgress,
    userOTP,
  ]);

  const handleOtpChange = async (newValue) => {
    setUserOTP(newValue);
  };

  useEffect(() => {
    if (userOTP.length === 6) {
      handleVerifyOTP();
    }
  }, [handleVerifyOTP, userOTP]);

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

  useEffect(() => {
    const getQrCode = async () => {
      QRCode.toDataURL(qrCodePath, function (err, data_url) {
        if (err) {
          return;
        }

        setImgPath(data_url);
      });
    };

    if (qrCodePath.length > 0) {
      getQrCode();
    }
  }, [qrCodePath]);

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, []);

  return (
    <Container sx={{ marginTop: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '15px' }}>
        {t('setupMFA')}
      </Typography>

      <Typography
        sx={{
          margin: '20px 0',
        }}
      >
        <Markup content={isReEnrollMFA ? t('mfaSetupUpdate') : t('mfaSetupTitle')} />
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label={t('thisDevice')} {...a11yProps(0)} />
          <Tab label={t('otherDevice')} {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <Typography sx={{ marginBottom: '15px' }}>{t('mfaThisDevice')}</Typography>
        <Button variant="contained" target="_blank" rel="noopener" href={qrCodePath}>
          {t('setupThisDevice')}
        </Button>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {isNoQR && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              marginBottom: '10px',
            }}
          >
            <TextField
              id="outlined-token"
              label="Token"
              variant="outlined"
              autoComplete="off"
              value={token}
              multiline
              sx={{ width: '100%', maxWidth: '500px', marginTop: '10px' }}
              InputProps={{
                readOnly: true,
              }}
            />
            <IconButton aria-label="copy" onClick={() => handleCopyClipboard(token)}>
              <ContentCopyIcon />
            </IconButton>
          </Box>
        )}

        {!isNoQR && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {imgPath.length > 0 && <img className="qrcode" src={imgPath} alt="QR Code 2FA" />}
          </Box>
        )}

        <Link component="button" underline="none" variant="body1" onClick={() => setIsNoQR(!isNoQR)}>
          {isNoQR ? t('scanQR') : t('copyToken')}
        </Link>
      </TabPanel>

      <Typography sx={{ marginBottom: '15px', marginTop: '20px' }}>{t('setupTextOTP')}</Typography>

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
          flexDirection: 'column',
          alignItems: 'flex-start',
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

export default SetupMFA;
