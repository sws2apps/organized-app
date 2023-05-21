import { useCallback, useEffect, useRef } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { apiHostState, restoreDbOpenState, visitorIDState } from '../../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { congIDState, isProcessingBackupState } from '../../states/congregation';
import { dbRestoreCongregationBackup } from '../../indexedDb/dbUtility';
import BackupMain from './BackupMain';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';

const RestoreDbDialog = () => {
  const cancel = useRef();

  const { t } = useTranslation('ui');

  const [open, setOpen] = useRecoilState(restoreDbOpenState);

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setIsProcessing = useSetRecoilState(isProcessingBackupState);

  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);
  const congID = useRecoilValue(congIDState);

  const { user } = useFirebaseAuth();

  const handleClose = useCallback(
    (event, reason) => {
      if (reason === 'clickaway' || reason === 'backdropClick') {
        return;
      }
      setOpen(false);
    },
    [setOpen]
  );

  const restoreBackup = async () => {
    try {
      if (apiHost !== '') {
        cancel.current = false;

        setIsProcessing(true);

        const res = await fetch(`${apiHost}api/congregations/${congID}/backup`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            appclient: 'cpe',
            appversion: import.meta.env.PACKAGE_VERSION,
            visitorid: visitorID,
            uid: user.uid,
          },
        });

        if (!cancel.current) {
          const data = await res.json();

          if (res.status === 200) {
            await dbRestoreCongregationBackup(data);

            window.location.reload();
            return;
          }

          setIsProcessing(false);
          setAppMessage(data.message);
          setAppSeverity('error');
          setAppSnackOpen(true);
          setOpen(false);
        }
      }
    } catch (err) {
      if (!cancel.current) {
        setIsProcessing(false);
        setAppMessage(err.message);
        setAppSeverity('error');
        setAppSnackOpen(true);
        setOpen(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, []);

  return (
    <BackupMain
      action="restore"
      open={open}
      handleClose={handleClose}
      title={t('restoreBackup')}
      handleRestoreBackup={restoreBackup}
    />
  );
};

export default RestoreDbDialog;
