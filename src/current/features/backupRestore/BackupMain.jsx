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
import { apiHostState } from '../../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { isProcessingBackupState } from '../../states/congregation';
import { Setting } from '../../classes/Setting';
import { apiFetchCongregationLastBackup, apiFetchUserLastBackup } from '../../api';

const BackupMain = ({ handleCreateBackup, handleClose, handleRestoreBackup, open, title, action }) => {
  const cancel = useRef();

  const { t } = useTranslation('ui');

  const [isProcessing, setIsProcessing] = useRecoilState(isProcessingBackupState);

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const apiHost = useRecoilValue(apiHostState);

  const [hasBackup, setHasBackup] = useState(false);
  const [backup, setBackup] = useState({});

  const accountType = Setting.account_type;
  const lmmoRole = Setting.cong_role.includes('lmmo') || Setting.cong_role.includes('lmmo-backup');
  const secretaryRole = Setting.cong_role.includes('secretary');
  const weekendEditorRole =
    Setting.cong_role.includes('coordinator') || Setting.cong_role.includes('public_talk_coordinator');
  const publisherRole =
    !lmmoRole &&
    !secretaryRole &&
    !weekendEditorRole &&
    (Setting.cong_role.includes('publisher') ||
      Setting.cong_role.includes('ms') ||
      Setting.cong_role.includes('elder'));

  const fetchLastBackup = useCallback(async () => {
    try {
      if (apiHost !== '') {
        cancel.current = false;
        setIsProcessing(true);

        let status;
        let data;

        if (accountType === 'vip') {
          const result = await apiFetchCongregationLastBackup();
          status = result.status;
          data = result.data;
        }

        if (accountType === 'pocket') {
          const result = await apiFetchUserLastBackup();
          status = result.status;
          data = result.data;
        }

        if (!cancel.current) {
          if (status === 200) {
            let backupInfo;

            if (lmmoRole || secretaryRole || weekendEditorRole) {
              backupInfo = 'cong_last_backup';
            }

            if (publisherRole && !lmmoRole && !secretaryRole && !weekendEditorRole) {
              backupInfo = 'user_last_backup';
            }

            if (data[backupInfo] === 'NO_BACKUP') {
              setHasBackup(false);
              setIsProcessing(false);
            } else {
              setBackup(data[backupInfo]);
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
  }, [
    apiHost,
    cancel,
    setAppMessage,
    setAppSeverity,
    setAppSnackOpen,
    setIsProcessing,
    accountType,
    lmmoRole,
    secretaryRole,
    publisherRole,
    weekendEditorRole,
  ]);

  const handleAction = () => {
    if (action === 'backup') handleCreateBackup();
    if (action === 'restore') handleRestoreBackup();
  };

  const getLastBackupDate = (action, backup) => {
    const shortDateTimeFormat = t('shortDateTimeFormat');

    return t(
      action === 'backup'
        ? publisherRole
          ? 'lastUserBackup'
          : 'lastCongBackup'
        : publisherRole
        ? 'restoreUserConfirmation'
        : 'restoreConfirmation',
      {
        backup_person: backup.by,
        backup_date: dateFormat(new Date(backup.date), shortDateTimeFormat),
      }
    );
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
              {hasBackup && <Typography>{getLastBackupDate(action, backup)}</Typography>}
              {!hasBackup && <Typography>{publisherRole ? t('noUserBackupFound') : t('noBackupFound')}</Typography>}
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
