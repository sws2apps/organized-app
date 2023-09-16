import { useCallback, useEffect, useRef, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { Markup } from 'interweave';
import { useQuery } from '@tanstack/react-query';
import QRCode from 'qrcode';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { apiHostState, rootModalOpenState, userIDState, visitorIDState } from '../../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import UserOptInMFA from './UserOptInMFA';

const User2FA = () => {
  const cancel = useRef();

  const { t } = useTranslation('ui');

  const setModalOpen = useSetRecoilState(rootModalOpenState);
  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);
  const userID = useRecoilValue(userIDState);

  const [qrCode, setQrCode] = useState('');
  const [token, setToken] = useState('');
  const [viewerOpen, setViewerOpen] = useState(false);
  const [openOptIn, setOpenOptIn] = useState(false);

  const handleFecth = async () => {
    if (apiHost !== '') {
      cancel.current = false;

      const auth = getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/users/${userID}/2fa`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
          uid: user.uid,
        },
      });

      return await res.json();
    }
  };

  const { isLoading, error, data } = useQuery({ queryKey: ['2fa'], queryFn: handleFecth });

  const handleCopyClipboard = useCallback(async (text) => {
    await navigator.clipboard.writeText(text);
  }, []);

  const handleClose = useCallback(() => {
    setViewerOpen(false);
  }, []);

  const handleOptInMFA = () => {
    setOpenOptIn(true);
  };

  useEffect(() => {
    setModalOpen(isLoading);
  }, [isLoading, setModalOpen]);

  useEffect(() => {
    const getImg = async () => {
      const qrImg = await QRCode.toDataURL(data.qrCode);
      setQrCode(qrImg);
      setToken(data.secret);
    };

    if (data && data.qrCode) {
      getImg();
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      setModalOpen(false);
      setAppMessage(error);
      setAppSeverity('error');
      setAppSnackOpen(true);
    }
  }, [error, setAppMessage, setAppSeverity, setAppSnackOpen, setModalOpen]);

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, [cancel]);

  return (
    <Box sx={{ marginTop: '10px', marginBottom: '20px' }}>
      {viewerOpen && (
        <Dialog
          open={viewerOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{t('twoFactorTitle')}</DialogTitle>
          <DialogContent>
            <Typography sx={{ fontSize: '14px' }}>
              <Markup content={t('twoFactorApp')} />
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
              {qrCode.length > 0 && <img className="qrcode" src={qrCode} alt="QR Code 2FA" />}
            </Box>
            <Typography sx={{ fontSize: '14px' }}>{t('twoFactorToken')}</Typography>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'flex-end',
                marginBottom: '10px',
              }}
            >
              <TextField
                id="outlined-token"
                variant="outlined"
                size="small"
                autoComplete="off"
                value={token}
                multiline
                sx={{ width: '380px', marginTop: '10px' }}
                InputProps={{
                  readOnly: true,
                }}
              />
              <IconButton aria-label="copy" onClick={() => handleCopyClipboard(token)}>
                <ContentCopyIcon />
              </IconButton>
            </Box>
          </DialogContent>
        </Dialog>
      )}

      {openOptIn && (
        <UserOptInMFA open={openOptIn} setOpen={(value) => setOpenOptIn(value)} qrCodePath={qrCode} token={token} />
      )}

      <Typography>{t('twoFactorDesc')}</Typography>
      {data && !data.mfaEnabled && (
        <Button onClick={handleOptInMFA} variant="contained" sx={{ marginTop: '10px' }}>
          {t('enableLabel')}
        </Button>
      )}
      {data && data.mfaEnabled && (
        <Button onClick={() => setViewerOpen(true)} variant="contained" sx={{ marginTop: '10px' }}>
          {t('twoFactorAddDevice')}
        </Button>
      )}
    </Box>
  );
};

export default User2FA;
