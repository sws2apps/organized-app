import { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { isImportJWOrgState } from '../../states/sourceMaterial';
import { apiHostState, isOnlineState } from '../../states/main';
import { addJwDataToDb } from '../../utils/epubParser';
import { displayError } from '../../utils/error';
import { fetchSourceMaterial } from '../../api/public';

const sharedStyles = {
  jwLoad: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20px',
  },
  textCircular: {
    marginTop: '20px',
  },
};

const ImportJWOrg = () => {
  const cancel = useRef();

  const { t } = useTranslation('ui');

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const [open, setOpen] = useRecoilState(isImportJWOrgState);

  const apiHost = useRecoilValue(apiHostState);
  const isOnline = useRecoilValue(isOnlineState);

  const [isLoading, setIsLoading] = useState(true);

  const handleDlgClose = (event, reason) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return;
    }
    setOpen(false);
  };

  const fetchSourcesJw = useCallback(async () => {
    try {
      if (apiHost !== '') {
        cancel.current = false;

        const data = await fetchSourceMaterial();

        if (!cancel.current) {
          if (data.length > 0) {
            await addJwDataToDb(data);
            setIsLoading(false);
            return;
          }

          setAppMessage(displayError('sourceNotFoundUnavailable'));
          setAppSeverity('error');
          setAppSnackOpen(true);
          setOpen(false);
        }
      }
    } catch (err) {
      if (!cancel.current) {
        setAppMessage(err.message);
        setAppSeverity('error');
        setAppSnackOpen(true);
        setOpen(false);
      }
    }
  }, [apiHost, cancel, setAppMessage, setAppSeverity, setAppSnackOpen, setOpen]);

  useEffect(() => {
    fetchSourcesJw();
  }, [fetchSourcesJw]);

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, []);

  return (
    <Box>
      {open && isOnline && (
        <Dialog open={open} onClose={handleDlgClose}>
          <DialogTitle>
            <Typography sx={{ lineHeight: 1.2, fontSize: '13px' }}>{t('importJwTitle')}</Typography>
          </DialogTitle>
          <DialogContent>
            <Container sx={sharedStyles.jwLoad}>
              {isLoading && (
                <>
                  <CircularProgress color="secondary" size={'70px'} disableShrink />
                  <Typography variant="body1" align="center" sx={sharedStyles.textCircular}>
                    {t('downloadInProgress')}
                  </Typography>
                </>
              )}
              {!isLoading && (
                <>
                  <CheckCircleIcon color="success" sx={{ fontSize: '100px' }} />
                  <Typography variant="body1" align="center" sx={sharedStyles.textCircular}>
                    {t('importCompleted')}
                  </Typography>
                </>
              )}
            </Container>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDlgClose} color="primary" autoFocus disabled={!isLoading}>
              {t('cancel')}
            </Button>
            <Button onClick={handleDlgClose} color="primary" autoFocus disabled={isLoading}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default ImportJWOrg;
