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
import { displayError } from '../../utils/error';
import { LateReports } from '../../classes/LateReports';
import { MinutesReports } from '../../classes/MinutesReports';
import { FSGList } from '../../classes/FSGList';

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

        const dbData = await dbExportDataOnline();
        const lmmoRole = Setting.cong_role.includes('lmmo') || Setting.cong_role.includes('lmmo-backup');
        const secretaryRole = Setting.cong_role.includes('secretary');

        const reqPayload = {
          cong_persons: dbData.dbPersons,
          cong_deleted: dbData.dbDeleted,
          cong_settings: dbData.dbSettings,
          cong_schedule: lmmoRole ? dbData.dbSchedule : undefined,
          cong_sourceMaterial: lmmoRole ? dbData.dbSourceMaterial : undefined,
          cong_swsPocket: lmmoRole ? dbData.dbPocketTbl : undefined,
          cong_branchReports: secretaryRole ? dbData.dbBranchReportsTbl : undefined,
          cong_fieldServiceGroup: secretaryRole ? dbData.dbFieldServiceGroupTbl : undefined,
          cong_fieldServiceReports: secretaryRole ? dbData.dbFieldServiceReportsTbl : undefined,
          cong_lateReports: secretaryRole ? dbData.dbLateReportsTbl : undefined,
          cong_meetingAttendance: secretaryRole ? dbData.dbMeetingAttendanceTbl : undefined,
          cong_minutesReports: secretaryRole ? dbData.dbMinutesReportsTbl : undefined,
          cong_serviceYear: secretaryRole ? dbData.dbServiceYearTbl : undefined,
        };

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
            if (secretaryRole) {
              await LateReports.cleanDeleted();
              await MinutesReports.cleanDeleted();
              await FSGList.cleanDeleted();
            }

            setAppMessage(t('backupSuccess'));
            setAppSeverity('success');
            setAppSnackOpen(true);
            setOpen(false);

            return;
          }

          setAppMessage(displayError(data.message));
          setAppSeverity('warning');
          setAppSnackOpen(true);
          setOpen(false);
        }
      }
    } catch (err) {
      if (!cancel.current) {
        setIsProcessing(false);
        setAppMessage(displayError(err.message));
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
