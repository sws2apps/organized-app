import Dexie from 'dexie';
import { exportDB, importDB } from 'dexie-export-import';
import download from 'downloadjs';
import appDb from './mainDb';
import { encryptString } from '../utils/swsEncryption';
import { dbGetAppSettings, dbUpdateAppSettings } from './dbAppSettings';

export const initAppDb = async () => {
  await appDb.open();
};

export const deleteDbByName = async (dbName) => {
  await Dexie.delete(dbName);
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

  // get deleted items
  const dbDeleted = await appDb.deleted.toArray();

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

  return { dbPersons, dbDeleted, dbSourceMaterial, dbSchedule, dbPocketTbl, dbSettings };
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
  const oldPersons = await appDb.persons.toArray();
  // handle modified person record
  for await (const oldPerson of oldPersons) {
    const newPerson = cong_persons.find((person) => person.person_uid === oldPerson.person_uid);
    if (newPerson) {
      const oldChanges = oldPerson.changes;
      const newChanges = newPerson.changes;

      if (newChanges) {
        // handle non-assignments and non-time away changes
        newChanges.forEach((change) => {
          if (change.field !== 'timeAway' && change.field !== 'assignments') {
            let isChanged = false;

            const oldChange = oldChanges?.find((old) => old.field === change.field);
            const originalDate = oldChange?.date || undefined;

            if (!oldChange) {
              isChanged = true;
            }

            if (originalDate) {
              const dateA = new Date(originalDate);
              const dateB = new Date(change.date);

              if (dateB > dateA) {
                isChanged = true;
              }
            }

            if (isChanged) {
              oldPerson[change.field] = change.value;

              if (oldPerson.changes) {
                const findIndex = oldPerson.changes.findIndex((item) => item.field === change.field) || -1;
                if (findIndex !== -1) oldPerson.changes.splice(findIndex, 1);
              }

              if (!oldPerson.changes) {
                oldPerson.changes = [];
              }

              oldPerson.changes.push(change);
            }
          }
        });

        // handle assignments changes
        newChanges.forEach((change) => {
          if (change.field === 'assignments') {
            // handle deleted assignment
            if (change.isDeleted) {
              const toBeDeleted = oldPerson[change.field].findIndex((item) => item.code === change.value.code);
              if (toBeDeleted !== -1) oldPerson[change.field].splice(toBeDeleted, 1);
            }

            // handle added item
            if (change.isAdded) {
              const isExist = oldPerson[change.field].findIndex((item) => item.code === change.value.code);
              if (!isExist) oldPerson[change.field].push(change.value);
            }

            // update changes
            if (!oldPerson.changes) oldPerson.changes = [];
            const findIndex = oldPerson.changes.findIndex((item) => item.value.code === change.value.code);
            if (findIndex !== -1) oldPerson.changes.splice(findIndex, 1);
            oldPerson.changes.push(change);
          }
        });

        // handle time away changes
        newChanges.forEach((change) => {
          if (change.field === 'timeAway') {
            // handle deleted item
            if (change.isDeleted) {
              const toBeDeleted = oldPerson[change.field].findIndex(
                (item) => item.timeAwayId === change.value.timeAwayId
              );
              if (toBeDeleted !== -1) oldPerson[change.field].splice(toBeDeleted, 1);
            }

            // handle added item
            if (change.isAdded) {
              oldPerson[change.field].push(change.value);
              if (!oldPerson.changes) oldPerson.changes = [];
              oldPerson.changes.push(change);
            }

            // handle modified item
            if (change.isModified) {
              const toBeModified = oldPerson[change.field].findIndex(
                (item) => item.timeAwayId === change.value.timeAwayId
              );

              if (toBeModified !== -1) oldPerson[change.field].splice(toBeModified, 1);
              oldPerson[change.field].push(change.value);
            }

            // update changes
            if (change.isDeleted || change.isModified) {
              if (!oldPerson.changes) oldPerson.changes = [];
              const findIndex = oldPerson.changes.findIndex(
                (item) => item.value.timeAwayId === change.value.timeAwayId
              );
              if (findIndex !== -1) oldPerson.changes.splice(findIndex, 1);
              oldPerson.changes.push(change);
            }
          }
        });
      }

      await appDb.table('persons').update(oldPerson.id, oldPerson);
    }
  }

  // handle new person record
  for await (const newPerson of cong_persons) {
    const oldPerson = oldPersons.find((person) => person.person_uid === newPerson.person_uid);
    if (!oldPerson) {
      await appDb.persons.add(newPerson);
    }
  }

  // restore source materials
  const oldSources = await appDb.src.toArray();
  await appDb.src.clear();
  for await (const src of cong_sourceMaterial) {
    await appDb.src.add(src, src.weekOf);

    // restore keepOverride if qualified
    const newKeepOverride = src.keepOverride || undefined;
    const oldSrc = oldSources.find((week) => week.weekOf === src.weekOf);

    if (oldSrc) {
      const oldKeepOverride = oldSrc.keepOverride;
      let isRestore = false;

      if (!newKeepOverride) {
        isRestore = true;
      }

      if (newKeepOverride && oldKeepOverride) {
        const oldDate = new Date(oldKeepOverride);
        const newDate = new Date(newKeepOverride);

        if (oldDate > newDate) {
          isRestore = true;
        }
      }

      if (isRestore) {
        const obj = {};
        for (const [key, value] of Object.entries(oldSrc)) {
          if (key.indexOf('_override') !== -1) {
            obj[key] = value;
          }
        }

        await appDb.src.update(src.weekOf, obj);
      }
    }
  }

  // restore schedule
  const oldSchedules = await appDb.sched_MM.toArray();
  // handle modified schedule
  for await (const oldSchedule of oldSchedules) {
    const newSchedule = cong_schedule.find((schedule) => schedule.weekOf === oldSchedule.weekOf);
    if (newSchedule) {
      const oldChanges = oldSchedule.changes;
      const newChanges = newSchedule.changes;

      if (newChanges) {
        newChanges.forEach((change) => {
          let isChanged = false;

          const oldChange = oldChanges?.find((old) => old.field === change.field);
          const originalDate = oldChange?.date || undefined;

          if (!oldChange) {
            isChanged = true;
          }

          if (originalDate) {
            const dateA = new Date(originalDate);
            const dateB = new Date(change.date);

            if (dateB > dateA) {
              isChanged = true;
            }
          }

          if (isChanged) {
            oldSchedule[change.field] = change.value;

            if (oldSchedule.changes) {
              const findIndex = oldSchedule.changes.findIndex((item) => item.field === change.field) || -1;
              if (findIndex !== -1) oldSchedule.changes.splice(findIndex, 1);
            }

            if (!oldSchedule.changes) {
              oldSchedule.changes = [];
            }

            oldSchedule.changes.push(change);
          }
        });
      }

      await appDb.sched_MM.put(oldSchedule, oldSchedule.weekOf);
    }
  }

  // handle new schedule record
  for await (const newSchedule of cong_schedule) {
    const oldSchedule = oldSchedules.find((schedule) => schedule.weekOf === newSchedule.weekOf);
    if (!oldSchedule) {
      await appDb.sched_MM.put(newSchedule, newSchedule.weekOf);
    }
  }

  // restore sws pocket info
  await appDb.sws_pocket.clear();
  for (let i = 0; i < cong_swsPocket.length; i++) {
    const pocket = cong_swsPocket[i];
    await appDb.sws_pocket.add(pocket, pocket.id);
  }
};
