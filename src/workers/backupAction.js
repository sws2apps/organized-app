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
  if (
    (userRole.includes('lmmo') || userRole.includes('lmmo-backup') || userRole.includes('secretary')) &&
    isEnabled &&
    backupInterval &&
    isOnline &&
    userUID &&
    visitorID &&
    apiHost &&
    congID &&
    isCongAccountConnected
  ) {
    const { dbPersons, dbDeleted, dbSourceMaterial, dbSchedule, dbPocketTbl, dbSettings } = await dbExportDataOnline();

    let reqPayload;

    if (userRole.includes('lmmo') || userRole.includes('lmmo-backup')) {
      reqPayload = {
        cong_persons: dbPersons,
        cong_deleted: dbDeleted,
        cong_schedule: dbSchedule,
        cong_sourceMaterial: dbSourceMaterial,
        cong_swsPocket: dbPocketTbl,
        cong_settings: dbSettings,
      };
    }

    if (userRole.includes('secretary')) {
      reqPayload = {
        cong_persons: dbPersons,
        cong_deleted: dbDeleted,
        cong_settings: dbSettings,
      };
    }

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
