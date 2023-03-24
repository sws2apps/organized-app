import { dbExportDataOnline } from '../indexedDb/dbUtility';

let isEnabled;
let userUID;
let visitorID;
let apiHost;
let congID;
let isOnline = navigator.onLine;
let backupInterval;
let isCongAccountConnected;

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

const isDev = process.env.NODE_ENV === 'development';

const runBackupSchedule = async () => {
  if (isDev) backupInterval = 20000;

  if (isEnabled && backupInterval && isOnline && userUID && visitorID && apiHost && congID && isCongAccountConnected) {
    const { dbPersons, dbDeleted, dbSourceMaterial, dbSchedule, dbPocketTbl, dbSettings } = await dbExportDataOnline();

    const reqPayload = {
      cong_persons: dbPersons,
      cong_deleted: dbDeleted,
      cong_schedule: dbSchedule,
      cong_sourceMaterial: dbSourceMaterial,
      cong_swsPocket: dbPocketTbl,
      cong_settings: dbSettings,
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
