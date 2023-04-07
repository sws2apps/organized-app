import { useCallback, useEffect, useRef } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { apiHostState, backupDbOpenState, visitorIDState } from '../../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { congIDState, isProcessingBackupState } from '../../states/congregation';
import { dbExportDataOnline } from '../../indexedDb/dbUtility';
import BackupMain from './BackupMain';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';
import { Setting } from '../../classes/Setting';

const BackupDbDialog = () => {
  const cancel = useRef();

  const { t } = useTranslation('ui');
  const { user } = useFirebaseAuth();

  const [open, setOpen] = useRecoilState(backupDbOpenState);

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setIsProcessing = useSetRecoilState(isProcessingBackupState);

  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);
  const congID = useRecoilValue(congIDState);

  const handleClose = useCallback(
    (event, reason) => {
      if (reason === 'clickaway' || reason === 'backdropClick') {
        return;
      }
      setOpen(false);
    },
    [setOpen]
  );

  const handleCreateBackup = async () => {
    try {
      if (apiHost !== '') {
        setIsProcessing(true);
        cancel.current = false;

        const { dbPersons, dbDeleted, dbSourceMaterial, dbSchedule, dbPocketTbl, dbSettings } =
          await dbExportDataOnline();

        let reqPayload;

        if (Setting.cong_role.includes('lmmo') || Setting.cong_role.includes('lmmo-backup')) {
          reqPayload = {
            cong_persons: dbPersons,
            cong_deleted: dbDeleted,
            cong_schedule: dbSchedule,
            cong_sourceMaterial: dbSourceMaterial,
            cong_swsPocket: dbPocketTbl,
            cong_settings: dbSettings,
          };
        }

        if (Setting.cong_role.includes('secretary')) {
          reqPayload = {
            cong_persons: dbPersons,
            cong_deleted: dbDeleted,
            cong_settings: dbSettings,
          };
        }

        const res = await fetch(`${apiHost}api/congregations/${congID}/backup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            visitorid: visitorID,
            uid: user.uid,
          },
          body: JSON.stringify(reqPayload),
        });

        if (!cancel.current) {
          const data = await res.json();

          if (res.status === 200) {
            setAppMessage(t('backupSuccess'));
            setAppSeverity('success');
            setAppSnackOpen(true);
            setOpen(false);
            return;
          }

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
      action="backup"
      open={open}
      handleClose={handleClose}
      title={t('createBackup')}
      handleCreateBackup={handleCreateBackup}
    />
  );
};

export default BackupDbDialog;
