import Dexie from 'dexie';
import { exportDB, importDB } from 'dexie-export-import';
import download from 'downloadjs';
import appDb from './mainDb';
import backupDb from './backupDb';
import { encryptString } from '../utils/swsEncryption';
import { dbGetAppSettings, dbUpdateAppSettings } from './dbAppSettings';

export const initAppDb = async () => {
  await appDb.open();
};

export const initBackupDb = async () => {
  await backupDb.open();
};

export const deleteDbByName = async (dbName) => {
  await Dexie.delete(dbName);
};

export const deleteDbBackup = async (dbName) => {
  await backupDb.close();
  await backupDb.delete();
};

export const deleteDb = async () => {
  const databases = await Dexie.getDatabaseNames();

  for (let i = 0; i < databases.length; i++) {
    Dexie.delete(databases[i]);
  }
};

export const isDbExist = async (dbName) => {
  return new Promise((resolve, reject) => {
    Dexie.exists(dbName)
      .then(function (exists) {
        if (exists) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(function (error) {
        reject('error');
      });
  });
};

export const isValidJSON = async (fileJSON) => {
  let isValid = false;
  const getJSON = () => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsText(fileJSON);
      reader.onload = () => resolve(JSON.parse(reader.result));
      reader.onerror = (error) => reject(error);
    });
  };

  const data = await getJSON();
  if (data.formatName === 'dexie') {
    if (data.data.databaseName === 'lmm_oa') {
      isValid = true;
    }
  }
  return isValid;
};

export const dbRestoreDb = async (fileJSON) => {
  // get user credentials before import
  const { userPass, username } = await dbGetAppSettings();

  // do restore
  await appDb.close();
  await appDb.delete();
  await importDB(fileJSON);

  // append saved user credentials
  await appDb.open();
  await dbUpdateAppSettings({ userPass: userPass, username: username });
  await appDb.close();
};

export const dbExportDb = async (passcode) => {
  try {
    // remove user credentials before export
    let appSettings = await dbGetAppSettings();
    const { userPass, username } = appSettings;
    delete appSettings.userPass;
    delete appSettings.username;
    await dbUpdateAppSettings({ ...appSettings }, true);

    // export indexedDb
    const blob = await exportDB(appDb);

    // pause export and restore credentials as soon as indexedDb is exported
    await dbUpdateAppSettings({ userPass: userPass, username: username });

    // resume export function
    const convertBase64 = () => {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };

    const data = await convertBase64();
    const encryptedData = await encryptString(passcode, data);

    const newBlob = new Blob([encryptedData], { type: 'text/plain' });

    download(newBlob, 'lmm-oa.backup.db', 'text/plain');
  } catch {
    return;
  }
};

export const dbExportJsonDb = async (passcode) => {
  const blob = await exportDB(appDb);
  const convertBase64 = () => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const data = await convertBase64();
  const encryptedData = await encryptString(passcode, data);
  return encryptedData;
};

export const dbExportDataOnline = async () => {
  // get persons
  const dbPersons = await appDb.persons.toArray();

  // get source materials
  const dbSourceMaterial = await appDb.src.toArray();

  // get schedules
  const dbSchedule = await appDb.sched_MM.toArray();

  // get sws-pocket schedules
  const dbPocketTbl = await appDb.sws_pocket.toArray();

  // remove user credentials before export
  const appSettings = await dbGetAppSettings();
  const { userPass, username } = appSettings;
  delete appSettings.userPass;
  delete appSettings.username;
  await dbUpdateAppSettings({ ...appSettings }, true);

  // get app settings
  const dbSettings = await appDb.app_settings.toArray();

  // restore credentials
  await dbUpdateAppSettings({ userPass: userPass, username: username });

  return { dbPersons, dbSourceMaterial, dbSchedule, dbPocketTbl, dbSettings };
};

export const dbRestoreCongregationBackup = async (
  cong_persons,
  cong_schedule,
  cong_sourceMaterial,
  cong_swsPocket,
  cong_settings
) => {
  // get user credentials before import
  const { userPass, username } = await dbGetAppSettings();

  // restore settings
  await appDb.app_settings.clear();
  for (let i = 0; i < cong_settings.length; i++) {
    const setting = cong_settings[i];
    await appDb.app_settings.add(setting, setting.id);
  }

  // append saved user credentials
  await dbUpdateAppSettings({ userPass: userPass, username: username });

  // restore persons
  await appDb.persons.clear();
  for (let i = 0; i < cong_persons.length; i++) {
    const person = cong_persons[i];
    await appDb.persons.add(person, person.id);
  }

  // restore source materials
  await appDb.src.clear();
  for (let i = 0; i < cong_sourceMaterial.length; i++) {
    const src = cong_sourceMaterial[i];
    await appDb.src.add(src, src.weekOf);
  }

  // restore schedule
  await appDb.sched_MM.clear();
  for (let i = 0; i < cong_schedule.length; i++) {
    const schedule = cong_schedule[i];
    await appDb.sched_MM.add(schedule, schedule.weekOf);
  }

  // restore sws pocket info
  await appDb.sws_pocket.clear();
  for (let i = 0; i < cong_swsPocket.length; i++) {
    const pocket = cong_swsPocket[i];
    await appDb.sws_pocket.add(pocket, pocket.id);
  }
};
