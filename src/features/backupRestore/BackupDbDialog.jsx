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

        let reqPayload;

        if (lmmoRole) {
          const { dbPersons, dbDeleted, dbSourceMaterial, dbSchedule, dbPocketTbl, dbSettings } = dbData;

          reqPayload = {
            cong_persons: dbPersons,
            cong_deleted: dbDeleted,
            cong_schedule: dbSchedule,
            cong_sourceMaterial: dbSourceMaterial,
            cong_swsPocket: dbPocketTbl,
            cong_settings: dbSettings,
          };
        }

        if (secretaryRole) {
          const {
            dbPersons,
            dbDeleted,
            dbSettings,
            dbBranchReportsTbl,
            dbFieldServiceGroupTbl,
            dbFieldServiceReportsTbl,
            dbLateReportsTbl,
            dbMeetingAttendanceTbl,
            dbMinutesReportsTbl,
            dbServiceYearTbl,
          } = dbData;

          reqPayload = {
            cong_persons: dbPersons,
            cong_deleted: dbDeleted,
            cong_settings: dbSettings,
            cong_branchReports: dbBranchReportsTbl,
            cong_fieldServiceGroup: dbFieldServiceGroupTbl,
            cong_fieldServiceReports: dbFieldServiceReportsTbl,
            cong_lateReports: dbLateReportsTbl,
            cong_meetingAttendance: dbMeetingAttendanceTbl,
            cong_minutesReports: dbMinutesReportsTbl,
            cong_serviceYear: dbServiceYearTbl,
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
