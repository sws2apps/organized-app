import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { congAccountConnectedState, isAppDataSyncingState, lastAppDataSyncState } from '@states/app';
import { useAppTranslation, useGlobal } from '@hooks/index';
import { setIsAppDataSyncing } from '@services/recoil/app';
import { dbExportDataOnline } from '@services/dexie/app';
import { accountTypeState } from '@states/settings';
import { apiSendCongregationBackup } from '@services/api/congregation';
import { apiSendUserBackup } from '@services/api/user';
import worker from '@services/worker/backupWorker';
import { delay } from '@utils/dev';

const useCongregation = () => {
  const { t } = useAppTranslation();

  const { lmmoRole, publicTalkCoordinatorRole, secretaryRole, weekendEditorRole, publisherRole } = useGlobal();

  const isSyncing = useRecoilValue(isAppDataSyncingState);
  const lastSync = useRecoilValue(lastAppDataSyncState);
  const accountType = useRecoilValue(accountTypeState);
  const isConnected = useRecoilValue(congAccountConnectedState);

  const getSecondaryText = () => {
    let label = t('tr_syncAppDataInProgress');

    if (!isSyncing) {
      if (lastSync === 'now') {
        label = t('tr_lastSyncAppDataNow');
      }

      if (lastSync === 'recently') {
        label = t('tr_lastSyncAppDataRecently');
      }

      if (lastSync >= 1) {
        label = t('tr_lastSyncAppData', { duration: lastSync });
      }
    }

    return label;
  };

  const handleManualSync = async () => {
    try {
      await setIsAppDataSyncing(true);

      await delay(5000);

      const dbData = await dbExportDataOnline();

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

      if (accountType === 'vip') {
        const result = await apiSendCongregationBackup(reqPayload);
        status = result.status;
      }

      if (accountType === 'pocket') {
        const result = await apiSendUserBackup(reqPayload);
        status = result.status;
      }

      if (status === 200) {
        worker.postMessage({ field: 'lastBackup', value: new Date().toISOString() });
      }

      await setIsAppDataSyncing(false);
    } catch (err) {
      await setIsAppDataSyncing(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      const svgIcon = document.querySelector('#organized-icon-synced');
      const g = svgIcon.querySelector('g');
      const checkMark = g.querySelector('path');
      checkMark.style.animation = 'fade-out 0s ease-in-out forwards';
    }
  }, [isConnected]);

  useEffect(() => {
    if (isSyncing) {
      const svgIcon = document.querySelector<SVGElement>('#organized-icon-synced');
      const g = svgIcon.querySelector('g');
      const checkMark = g.querySelector('path');

      checkMark.style.animation = 'fade-out 0s ease-in-out forwards';
      svgIcon.style.animation = 'rotate 2s linear infinite';
    }
  }, [isSyncing]);

  useEffect(() => {
    if (!isSyncing && isConnected) {
      const svgIcon = document.querySelector<SVGElement>('#organized-icon-synced');
      const g = svgIcon.querySelector('g');
      const checkMark = g.querySelector('path');

      svgIcon.style.animation = '';
      checkMark.style.animation = 'fade-in 0.25s ease-in-out forwards';
    }
  }, [isSyncing, isConnected]);

  return { isSyncing, secondaryText: getSecondaryText(), handleManualSync, isConnected };
};

export default useCongregation;
