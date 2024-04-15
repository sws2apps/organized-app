import { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Markup } from 'interweave';
import { useTheme } from '@mui/material';
import { MuiOtpInput } from 'mui-one-time-password-input';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import TabPanel from '../../components/TabPanel';
import { apiHandleVerifyOTP } from '../../api';
import { visitorIDState } from '../../states/main';

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

let isValidateRan = false;

const UserOptInMFA = ({ open, setOpen, qrCodePath, token }) => {
  const { t } = useTranslation('ui');
  const cancel = useRef();
  const queryClient = useQueryClient();

  const visitorID = useRecoilValue(visitorIDState);

  const [tabValue, setTabValue] = useState(0);
  const [isNoQR, setIsNoQR] = useState(false);
  const [userOTP, setUserOTP] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClose = (event, reason) => {
    if (reason === 'clickaway' || reason === 'backdropClick') {
      return;
    }
    setOpen(false);
  };

  const handleTabChange = (e, newValue) => {
    setTabValue(newValue);
  };

  const handleCopyClipboard = async (text) => {
    await navigator.clipboard.writeText(text);
  };

  const handleOtpChange = async (newValue) => {
    isValidateRan = false;
    setUserOTP(newValue);
  };

  const handleVerifyOTP = useCallback(async () => {
    try {
      isValidateRan = true;
      setIsProcessing(true);
      cancel.current = false;

      const response = await apiHandleVerifyOTP(userOTP, true);
      if (!cancel.current) {
        if (response.success) {
          queryClient.invalidateQueries({ queryKey: ['2fa'] });
          setOpen(false);
        }
        setIsProcessing(false);
      }
    } catch (err) {
      if (!cancel.current) {
        setIsProcessing(false);
      }
    }
  }, [userOTP, setOpen, queryClient]);

  useEffect(() => {
    if (userOTP.length === 6) {
      if (!isValidateRan) handleVerifyOTP();
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
    return () => {
      cancel.current = true;
    };
  }, []);

  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="mfa-opt-in-dialog-title"
        aria-describedby="mfa-opt-in-dialog-description"
        fullScreen={fullScreen}
        scroll="paper"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span>{t('setupMFA')}</span>
          <span>
            <IconButton color="error" aria-label="close" onClick={handleClose}>
              <CloseIcon sx={{ fontSize: '30px' }} />
            </IconButton>
          </span>
        </DialogTitle>
        <DialogContent>
          <Typography>
            <Markup content={t('mfaSetupTitle')} />
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
              <Box>{qrCodePath.length > 0 && <img className="qrcode" src={qrCodePath} alt="QR Code 2FA" />}</Box>
            )}

            <Link
              component="button"
              underline="none"
              variant="body1"
              onClick={() => setIsNoQR(!isNoQR)}
              sx={{ marginTop: '15px' }}
            >
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

          <Button
            variant="contained"
            sx={{ marginTop: '20px' }}
            disabled={isProcessing || visitorID.toString().length === 0}
            onClick={handleVerifyOTP}
            endIcon={isProcessing ? <CircularProgress size={25} /> : null}
          >
            {t('mfaVerify')}
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UserOptInMFA;
