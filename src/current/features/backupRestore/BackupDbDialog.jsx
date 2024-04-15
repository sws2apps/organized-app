import { useCallback, useEffect, useRef } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { apiHostState, backupDbOpenState } from '../../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { isProcessingBackupState } from '../../states/congregation';
import { dbExportDataOnline } from '../../indexedDb/dbUtility';
import BackupMain from './BackupMain';
import { Setting } from '../../classes/Setting';
import { displayError } from '../../utils/error';
import { LateReports } from '../../classes/LateReports';
import { MinutesReports } from '../../classes/MinutesReports';
import { FSGList } from '../../classes/FSGList';
import { BibleStudies } from '../../classes/BibleStudies';
import { UserS4Records } from '../../classes/UserS4Records';
import { apiSendCongregationBackup, apiSendUserBackup } from '../../api';

const BackupDbDialog = () => {
  const cancel = useRef();

  const { t } = useTranslation('ui');

  const [open, setOpen] = useRecoilState(backupDbOpenState);

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setIsProcessing = useSetRecoilState(isProcessingBackupState);

  const apiHost = useRecoilValue(apiHostState);

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

        const accountType = Setting.account_type;
        const lmmoRole = Setting.cong_role.includes('lmmo') || Setting.cong_role.includes('lmmo-backup');
        const secretaryRole = Setting.cong_role.includes('secretary');
        const weekendEditorRole =
          Setting.cong_role.includes('coordinator') || Setting.cong_role.includes('public_talk_coordinator');
        const publicTalkCoordinatorRole = Setting.cong_role.includes('public_talk_coordinator');
        const publisherRole =
          Setting.cong_role.includes('publisher') ||
          Setting.cong_role.includes('ms') ||
          Setting.cong_role.includes('elder');

        const reqPayload = {
          cong_persons: dbData.dbPersons,
          cong_deleted: dbData.dbDeleted,
          cong_settings: dbData.dbSettings,
          cong_schedule: lmmoRole || weekendEditorRole ? dbData.dbSchedule : undefined,
          cong_sourceMaterial: lmmoRole || weekendEditorRole ? dbData.dbSourceMaterial : undefined,
          cong_branchReports: secretaryRole ? dbData.dbBranchReportsTbl : undefined,
          cong_fieldServiceGroup: secretaryRole ? dbData.dbFieldServiceGroupTbl : undefined,
          cong_fieldServiceReports: secretaryRole ? dbData.dbFieldServiceReportsTbl : undefined,
          cong_lateReports: secretaryRole ? dbData.dbLateReportsTbl : undefined,
          cong_meetingAttendance: secretaryRole ? dbData.dbMeetingAttendanceTbl : undefined,
          cong_minutesReports: secretaryRole ? dbData.dbMinutesReportsTbl : undefined,
          cong_publicTalks: publicTalkCoordinatorRole ? dbData.dbPublicTalks : undefined,
          cong_visitingSpeakers: publicTalkCoordinatorRole ? dbData.dbVisitingSpeakers : undefined,
          cong_serviceYear: secretaryRole ? dbData.dbServiceYearTbl : undefined,
          user_bibleStudies: publisherRole ? dbData.dbUserBibleStudiesTbl : undefined,
          user_fieldServiceReports: publisherRole ? dbData.dbUserFieldServiceReportsTbl : undefined,
        };

        let status;
        let data;

        if (accountType === 'vip') {
          const result = await apiSendCongregationBackup(reqPayload);
          status = result.status;
          data = result.data;
        }

        if (accountType === 'pocket') {
          const result = await apiSendUserBackup(reqPayload);
          status = result.status;
          data = result.data;
        }

        if (!cancel.current) {
          if (status === 200) {
            if (secretaryRole) {
              await LateReports.cleanDeleted();
              await MinutesReports.cleanDeleted();
              await FSGList.cleanDeleted();
            }

            if (publisherRole) {
              await BibleStudies.cleanDeleted();
              await UserS4Records.cleanDeleted();
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
