import { dbExportDataOnline } from '../indexedDb/dbUtility';

let isEnabled;
let visitorID;
let apiHost;
let congID;
let isOnline = navigator.onLine;
let backupInterval;
let isCongAccountConnected;
let userRole = [];
let accountType;
let userUID;
let userID;

export const setUserRole = (value) => {
  userRole = value;
};

export const setAccountType = (value) => {
  accountType = value;
};

export const setIsEnabled = (value) => {
  isEnabled = value;
};

export const setBackupInterval = (value = 1) => {
  backupInterval = value * 60000;
};

export const setVisitorID = (visitorId) => {
  visitorID = visitorId;
};

export const setUserUID = (uid) => {
  userUID = uid;
};

export const setUserID = (userId) => {
  userID = userId;
};

export const setApiHost = (host) => {
  apiHost = host;
};

export const setCongID = (id) => {
  congID = id;
};

export const setIsOnline = (value) => {
  isOnline = value;
};

export const setIsCongAccountConnected = (value) => {
  isCongAccountConnected = value;
};

const runBackupSchedule = async () => {
  const lmmoRole = userRole.includes('lmmo') || userRole.includes('lmmo-backup');
  const secretaryRole = userRole.includes('secretary');
  const weekendEditorRole = userRole.includes('coordinator') || userRole.includes('public_talk_coordinator');
  const publicTalkCoordinatorRole = userRole.includes('public_talk_coordinator');
  const publisherRole = userRole.includes('publisher') || userRole.includes('ms') || userRole.includes('elder');

  if (
    (lmmoRole || secretaryRole || weekendEditorRole || publisherRole) &&
    isEnabled &&
    backupInterval &&
    isOnline &&
    visitorID &&
    apiHost &&
    congID &&
    isCongAccountConnected
  ) {
    const dbData = await dbExportDataOnline(userRole);

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
      await fetch(`${apiHost}api/v2/congregations/${congID}/backup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
          uid: userUID,
        },
        body: JSON.stringify(reqPayload),
      });
    }

    if (accountType === 'pocket' && userID) {
      await fetch(`${apiHost}api/v2/sws-pocket/${userID}/backup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'cpe',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
        },
        body: JSON.stringify(reqPayload),
      });
    }
  }

  setTimeout(runBackupSchedule, backupInterval);
};

runBackupSchedule();
