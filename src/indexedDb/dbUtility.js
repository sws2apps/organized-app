import Dexie from 'dexie';
import appDb from './mainDb';
import { Setting } from '../classes/Setting';

export const initAppDb = async () => {
  await appDb.open();
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

export const dbExportDataOnline = async () => {
  // get persons
  const dbPersons = await appDb.persons.toArray();

  // get deleted items
  const dbDeleted = await appDb.deleted.toArray();

  // get source materials
  const dbSourceMaterial = await appDb.src.toArray();

  // get schedules
  const tmpSchedule = await appDb.sched_MM.toArray();
  const dbSchedule = [];
  for (const schedule of tmpSchedule) {
    const obj = {};
    for (const [key, value] of Object.entries(schedule)) {
      if (key.indexOf('_name') === -1 && key.indexOf('_dispName') === -1) {
        obj[key] = value;
      }
    }
    dbSchedule.push(obj);
  }

  // get sws-pocket schedules
  const dbPocketTbl = await appDb.sws_pocket.toArray();

  // remove local user settings before export
  const appSettings = (await appDb.app_settings.toArray())[0];
  delete appSettings.username;
  delete appSettings.user_avatar;
  delete appSettings.local_uid;
  delete appSettings.pocket_members;
  delete appSettings.pocket_local_id;

  // get app settings
  const dbSettings = [appSettings];

  return { dbPersons, dbDeleted, dbSourceMaterial, dbSchedule, dbPocketTbl, dbSettings };
};

export const dbRestoreCongregationBackup = async (
  cong_persons,
  cong_schedule,
  cong_sourceMaterial,
  cong_swsPocket,
  cong_settings
) => {
  // restore settings
  await appDb.app_settings.clear();
  for (let i = 0; i < cong_settings.length; i++) {
    const setting = {
      ...cong_settings[i],
      username: Setting.username,
      user_avatar: Setting.user_avatar,
      local_uid: Setting.local_uid,
      pocket_members: Setting.pocket_members,
      pocket_local_id: Setting.pocket_local_id,
    };

    await appDb.app_settings.add(setting, setting.id);
  }

  // restore persons
  const oldPersons = await appDb.persons.toArray();
  // handle modified person record
  for await (const oldPerson of oldPersons) {
    const newPerson = cong_persons.find((person) => person.person_uid === oldPerson.person_uid);
    if (newPerson) {
      const oldChanges = oldPerson.changes;
      let newChanges = newPerson.changes;

      if (newChanges) {
        newChanges = newChanges.filter((item) => item.field !== 'lastAssignment');
        newChanges = newChanges.filter((item) => item.field !== 'assignments');

        // handle non-assignments and non-time away changes
        newChanges.forEach((change) => {
          if (change.field !== 'timeAway') {
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
                oldPerson.changes = oldPerson.changes.filter((item) => item.field !== change.field);
              }

              if (!oldPerson.changes) {
                oldPerson.changes = [];
              }

              oldPerson.changes.push(change);
            }
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

      if (oldPerson.id) delete oldPerson.id;
      oldPerson.changes = oldPerson.changes?.filter((item) => item.field !== 'lastAssignment') || [];
      oldPerson.changes = oldPerson.changes.filter((item) => item.field !== 'assignments');

      await appDb.table('persons').update(oldPerson.person_uid, oldPerson);
    }
  }

  // handle new person record
  for await (const newPerson of cong_persons) {
    const oldPerson = oldPersons.find((person) => person.person_uid === newPerson.person_uid);
    if (!oldPerson) {
      if (newPerson.id) delete newPerson.id;
      newPerson.changes = newPerson.changes?.filter((item) => item.field !== 'lastAssignment') || [];
      newPerson.changes = newPerson.changes.filter((item) => item.field !== 'assignments');
      await appDb.persons.add(newPerson);
    }
  }

  // restore source materials
  const oldSources = await appDb.src.toArray();
  for await (const src of cong_sourceMaterial) {
    const isSrcExist = oldSources.find((source) => source.weekOf === src.weekOf);

    if (!isSrcExist) {
      await appDb.src.add(src, src.weekOf);
    }

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
    if (newSchedule.weekOf) {
      const oldSchedule = oldSchedules.find((schedule) => schedule.weekOf === newSchedule.weekOf);
      if (!oldSchedule) {
        await appDb.sched_MM.put(newSchedule, newSchedule.weekOf);
      }
    }
  }

  // restore sws pocket info
  await appDb.sws_pocket.clear();
  for (let i = 0; i < cong_swsPocket.length; i++) {
    const pocket = cong_swsPocket[i];
    await appDb.sws_pocket.add(pocket, pocket.id);
  }
};
