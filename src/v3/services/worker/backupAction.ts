import { delay } from '@utils/dev';
import { dbExportDataOnline, apiSendCongregationBackup, apiSendUserBackup } from './backupUtils';

const setting = {
  isEnabled: false,
  visitorID: undefined,
  apiHost: undefined,
  congID: undefined,
  isOnline: navigator.onLine,
  backupInterval: 300000,
  isCongAccountConnected: undefined,
  userRole: [],
  accountType: undefined,
  userUID: undefined,
  userID: undefined,
  lastBackup: undefined,
};

self.onmessage = function (event) {
  if (event.data.field) {
    setting[event.data.field] = event.data.value;
  }

  if (event.data === 'startWorker') {
    runBackupSchedule();
    checkLastSync();
  }
};

const runBackupSchedule = async () => {
  try {
    const {
      backupInterval,
      accountType,
      apiHost,
      congID,
      isCongAccountConnected,
      isEnabled,
      isOnline,
      userID,
      userRole,
      userUID,
      visitorID,
    } = setting;
    const adminRole = userRole.includes('admin');
    const lmmoRole = userRole.includes('lmmo') || userRole.includes('lmmo-backup');
    const secretaryRole = userRole.includes('secretary');
    const weekendEditorRole = userRole.includes('coordinator') || userRole.includes('public_talk_coordinator');
    const publicTalkCoordinatorRole = userRole.includes('public_talk_coordinator');
    const publisherRole = userRole.includes('publisher') || userRole.includes('ms') || userRole.includes('elder');
    const canBackup = adminRole || lmmoRole || secretaryRole || weekendEditorRole || publisherRole;
    if (
      canBackup &&
      isEnabled &&
      backupInterval &&
      isOnline &&
      visitorID &&
      apiHost &&
      congID &&
      isCongAccountConnected
    ) {
      self.postMessage('Syncing');
      await delay(5000);
      const dbData = await dbExportDataOnline({ cong_role: userRole });
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
        cong_serviceYear: secretaryRole ? dbData.dbServiceYearTbl : undefined,
        user_bibleStudies: publisherRole ? dbData.dbUserBibleStudiesTbl : undefined,
        user_fieldServiceReports: publisherRole ? dbData.dbUserFieldServiceReportsTbl : undefined,
        cong_publicTalks: publicTalkCoordinatorRole ? dbData.dbPublicTalks : undefined,
        cong_visitingSpeakers: publicTalkCoordinatorRole ? dbData.dbVisitingSpeakers : undefined,
      };
      if (accountType === 'vip' && userUID) {
        const data = await apiSendCongregationBackup({ apiHost, congID, reqPayload, userUID, visitorID });
        if (data && data.message === 'BACKUP_SENT') {
          setting.lastBackup = new Date().toISOString();
        }
      }
      if (accountType === 'pocket' && userID) {
        const data = await apiSendUserBackup({ apiHost, reqPayload, userID, visitorID });
        if (data && data.message === 'BACKUP_SENT') {
          setting.lastBackup = new Date().toISOString();
        }
      }
    }
    self.postMessage('Done');
    setTimeout(runBackupSchedule, backupInterval);
  } catch {
    self.postMessage('Done');
    setTimeout(runBackupSchedule, setting.backupInterval);
  }
};

const checkLastSync = () => {
  const { isOnline, lastBackup } = setting;

  if (isOnline && lastBackup) {
    let result: string | number = 0;

    const lastDate = new Date(lastBackup).getTime();
    const currentDate = new Date().getTime();

    const msDifference = currentDate - lastDate;
    const resultS = Math.floor(msDifference / 1000);
    const resultM = Math.floor(resultS / 60);

    if (resultS <= 30) {
      result = 'now';
    }

    if (resultS > 30 && resultS < 60) {
      result = 'recently';
    }

    if (resultS >= 60) {
      result = resultM;
    }

    self.postMessage({ lastBackup: result });
  }

  setTimeout(checkLastSync, 500);
};
