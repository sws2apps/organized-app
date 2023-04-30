import { dbExportDataOnline } from '../indexedDb/dbUtility';

let isEnabled;
let userUID;
let visitorID;
let apiHost;
let congID;
let isOnline = navigator.onLine;
let backupInterval;
let isCongAccountConnected;
let userRole = [];

export const setUserRole = (value) => {
  userRole = value;
};

export const setIsEnabled = (value) => {
  isEnabled = value;
};

export const setBackupInterval = (value = 1) => {
  backupInterval = value * 60000;
};

export const setUserUID = (uid) => {
  userUID = uid;
};

export const setVisitorID = (visitorId) => {
  visitorID = visitorId;
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

  if (
    (lmmoRole || secretaryRole) &&
    isEnabled &&
    backupInterval &&
    isOnline &&
    userUID &&
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

    await fetch(`${apiHost}api/congregations/${congID}/backup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        visitorid: visitorID,
        uid: userUID,
      },
      body: JSON.stringify(reqPayload),
    });
  }

  setTimeout(runBackupSchedule, backupInterval);
};

runBackupSchedule();
