import { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import dateFormat from 'dateformat';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { apiHostState, shortDateFormatState, visitorIDState } from '../../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { congIDState, isProcessingBackupState } from '../../states/congregation';
import { getAuth } from '@firebase/auth';

const BackupMain = ({ handleCreateBackup, handleClose, handleRestoreBackup, open, title, action }) => {
  const cancel = useRef();

  const { t } = useTranslation('ui');

  const [isProcessing, setIsProcessing] = useRecoilState(isProcessingBackupState);

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);
  const congID = useRecoilValue(congIDState);
  const shortDateFormat = useRecoilValue(shortDateFormatState);

  const [hasBackup, setHasBackup] = useState(false);
  const [backup, setBackup] = useState({});

  const fetchLastBackup = useCallback(async () => {
    try {
      if (apiHost !== '') {
        cancel.current = false;
        setIsProcessing(true);

        const auth = await getAuth();
        const user = auth.currentUser;

        const res = await fetch(`${apiHost}api/congregations/${congID}/backup/last`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            visitorid: visitorID,
            uid: user.uid,
          },
        });
        if (!cancel.current) {
          const data = await res.json();
          if (res.status === 200) {
            if (data.message) {
              setHasBackup(false);
              setIsProcessing(false);
            } else {
              setBackup(data);
              setHasBackup(true);
              setIsProcessing(false);
            }
            return;
          }
          setIsProcessing(false);
          setAppMessage(data.message);
          setAppSeverity('error');
          setAppSnackOpen(true);
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
  }, [apiHost, cancel, congID, setAppMessage, setAppSeverity, setAppSnackOpen, setIsProcessing, visitorID]);

  const handleAction = () => {
    if (action === 'backup') handleCreateBackup();
    if (action === 'restore') handleRestoreBackup();
  };

  useEffect(() => {
    fetchLastBackup();
  }, [fetchLastBackup]);

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
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent sx={{ minWidth: '380px' }}>
          {isProcessing && (
            <CircularProgress
              color="secondary"
              size={80}
              disableShrink={true}
              sx={{
                display: 'flex',
                margin: '10px auto',
              }}
            />
          )}
          {!isProcessing && (
            <>
              {hasBackup && (
                <Typography>
                  {t('lastCongBackup', {
                    backup_person: backup.by,
                    backup_date: dateFormat(new Date(backup.date), shortDateFormat),
                  })}
                </Typography>
              )}
              {!hasBackup && <Typography>{t('noBackupFound')}</Typography>}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {t('cancel')}
          </Button>
          <Button
            onClick={handleAction}
            disabled={isProcessing || (!hasBackup && action === 'restore')}
            color="primary"
          >
            {action === 'backup' ? t('create') : t('restore')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BackupMain;
