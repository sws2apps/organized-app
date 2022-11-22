import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
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
import ErrorIcon from '@mui/icons-material/Error';
import Typography from '@mui/material/Typography';
import { addEpubDataToDb } from '../../utils/epubParser';
import { epubFileState, isImportEPUBState } from '../../states/sourceMaterial';

const sharedStyles = {
  epubLoad: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20px',
  },
  textCircular: {
    marginTop: '10px',
  },
};

const ImportEPUB = () => {
  const { t } = useTranslation();

  const [open, setOpen] = useRecoilState(isImportEPUBState);
  const [fileEPUB, setFileEPUB] = useRecoilState(epubFileState);

  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [btnDisabled, setBtnDisabled] = useState(true);

  const handleDlgClose = (event, reason) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    const loadEPUB = async () => {
      setIsLoading(false);
      const result = await addEpubDataToDb(fileEPUB);
      if (result === 'error') {
        setIsValid(false);
      } else {
        setIsComplete(true);
        setFileEPUB(undefined);
      }
      setBtnDisabled(false);
    };

    if (open && fileEPUB) {
      loadEPUB();
    }
  }, [open, fileEPUB, setFileEPUB]);

  return (
    <Box>
      {open && (
        <Dialog open={open} onClose={handleDlgClose}>
          <DialogTitle>
            <Typography sx={{ lineHeight: 1.2, fontSize: '13px' }}>{t('sourceMaterial.importEPUBTitle')}</Typography>
          </DialogTitle>
          <DialogContent>
            {!isLoading && !isValid && (
              <Container sx={sharedStyles.epubLoad}>
                <ErrorIcon color="error" sx={{ fontSize: '80px' }} />
                <Typography variant="body1" align="center">
                  {t('importEPUB.invalid')}
                </Typography>
              </Container>
            )}
            {!isLoading && isValid && (
              <Container sx={sharedStyles.epubLoad}>
                {!isComplete && (
                  <>
                    <CircularProgress color="secondary" size={'70px'} disableShrink />
                    <Typography variant="body1" align="center" sx={sharedStyles.textCircular}>
                      {t('global.pleaseWait')}
                    </Typography>
                  </>
                )}
                {isComplete && (
                  <>
                    <CheckCircleIcon color="success" sx={{ fontSize: '100px' }} />
                    <Typography variant="body1" align="center" sx={sharedStyles.textCircular}>
                      {t('sourceMaterial.importCompleted')}
                    </Typography>
                  </>
                )}
              </Container>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDlgClose} color="primary" autoFocus disabled={btnDisabled}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default ImportEPUB;
