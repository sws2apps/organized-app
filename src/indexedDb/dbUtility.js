import Dexie from 'dexie';
import appDb from './mainDb';
import { Setting } from '../classes/Setting';

export const initAppDb = async () => {
  await appDb.open();
};

export const deleteAppDb = async () => {
  await appDb.close();
  await Dexie.delete('cpe_sws');
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

export const dbExportDataOnline = async (cong_role = Setting.cong_role) => {
  const data = {};

  const lmmoRole = cong_role.includes('lmmo') || cong_role.includes('lmmo-backup');
  const secretaryRole = cong_role.includes('secretary');

  // get persons
  data.dbPersons = await appDb.persons.toArray();

  // get deleted items
  data.dbDeleted = await appDb.deleted.toArray();

  if (lmmoRole) {
    // get source materials
    data.dbSourceMaterial = await appDb.src.toArray();

    // get schedules
    const tmpSchedule = await appDb.sched_MM.toArray();
    data.dbSchedule = [];
    for (const schedule of tmpSchedule) {
      const obj = {};
      for (const [key, value] of Object.entries(schedule)) {
        if (key.indexOf('_name') === -1 && key.indexOf('_dispName') === -1) {
          obj[key] = value;
        }
      }
      data.dbSchedule.push(obj);
    }

    // get sws-pocket schedules
    data.dbPocketTbl = await appDb.sws_pocket.toArray();
  }

  if (secretaryRole) {
    // get branch reports
    data.dbBranchReportsTbl = await appDb.branchReports.toArray();

    // get field service group
    data.dbFieldServiceGroupTbl = await appDb.fieldServiceGroup.toArray();

    // get field service reports
    data.dbFieldServiceReportsTbl = await appDb.fieldServiceReports.toArray();

    // get late reports
    data.dbLateReportsTbl = await appDb.lateReports.toArray();

    // get meeting attendance
    data.dbMeetingAttendanceTbl = await appDb.meetingAttendance.toArray();

    // get minutes reports
    data.dbMinutesReportsTbl = await appDb.minutesReports.toArray();

    // get service year
    data.dbServiceYearTbl = await appDb.serviceYear.toArray();
  }

  // remove local user settings before export
  const appSettings = (await appDb.app_settings.toArray())[0];
  delete appSettings.username;
  delete appSettings.user_avatar;
  delete appSettings.cong_role;

  // get app settings
  data.dbSettings = [appSettings];

  return { ...data };
};

export const dbRestoreSettingFromBackup = async (cong_settings) => {
  await appDb.app_settings.clear();
  for await (const settingItem of cong_settings) {
    const setting = {
      ...settingItem,
      username: Setting.username,
      user_avatar: Setting.user_avatar,
      user_local_uid: Setting.user_local_uid,
      user_members_delegate: Setting.user_members_delegate,
      cong_role: Setting.cong_role,
    };

    await appDb.app_settings.add(setting, setting.id);
  }
};

export const dbRestorePersonsFromBackup = async (cong_persons) => {
  const oldPersons = await appDb.persons.toArray();
  // handle modified person record
  for await (const oldPerson of oldPersons) {
    const newPerson = cong_persons.find((person) => person.person_uid === oldPerson.person_uid);
    if (newPerson) {
      const oldChanges = oldPerson.changes;
      let newChanges = newPerson.changes;

      if (newChanges) {
        newChanges = newChanges.filter((item) => item.field !== 'lastAssignment');

        // handle non-assignments and non-time away changes
        newChanges.forEach((change) => {
          if (
            change.field !== 'timeAway' &&
            change.field !== 'assignments' &&
            change.field !== 'spiritualStatus' &&
            change.field !== 'otherService'
          ) {
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

        // handle assignments changes
        newChanges.forEach((change) => {
          if (change.field === 'assignments') {
            if (!oldPerson.assignments) oldPerson.assignments = [];

            // handle deleted assignment
            if (change.isDeleted) {
              oldPerson.assignments = oldPerson.assignments.filter((item) => item.code !== change.value.code);
            }

            // handle added item
            if (change.isAdded) {
              const isExist = oldPerson.assignments.find((item) => item.code === change.value.code);
              if (!isExist) oldPerson.assignments.push(change.value);
            }

            // update changes
            if (!oldPerson.changes) oldPerson.changes = [];
            const filteredChanges = [];
            oldPerson.changes.forEach((item) => {
              if (item.field === 'assignments' && item.value.code === change.value.code) {
                return;
              }
              filteredChanges.push(item);
            });
            oldPerson.changes = [...filteredChanges];
            oldPerson.changes.push(change);
          }
        });

        // handle time away changes
        newChanges.forEach((change) => {
          if (change.field === 'timeAway') {
            if (!oldPerson.timeAway) oldPerson.timeAway = [];

            // handle deleted item
            if (change.isDeleted) {
              oldPerson.timeAway = oldPerson.timeAway.filter((item) => item.timeAwayId !== change.value.timeAwayId);
            }

            // handle added item
            if (change.isAdded) {
              const isExist = oldPerson.timeAway.find((item) => item.timeAwayId === change.value.timeAwayId);
              if (!isExist) {
                oldPerson.timeAway.push(change.value);
                if (!oldPerson.changes) oldPerson.changes = [];
                oldPerson.changes.push(change);
              }
            }

            // handle modified item
            if (change.isModified) {
              oldPerson[change.field] = oldPerson[change.field].filter(
                (item) => item.timeAwayId !== change.value.timeAwayId
              );
              oldPerson[change.field].push(change.value);
            }

            // update changes
            if (change.isDeleted || change.isModified) {
              if (!oldPerson.changes) oldPerson.changes = [];
              const filteredChanges = [];
              oldPerson.changes.forEach((item) => {
                if (item.field === 'timeAway' && item.value.timeAwayId === change.value.timeAwayId) {
                  return;
                }
                filteredChanges.push(item);
              });
              oldPerson.changes = [...filteredChanges];
              oldPerson.changes.push(change);
            }
          }
        });

        // handle status changes
        newChanges.forEach((change) => {
          if (change.field === 'spiritualStatus') {
            if (!oldPerson.spiritualStatus) oldPerson.spiritualStatus = [];

            // handle deleted item
            if (change.isDeleted) {
              oldPerson.spiritualStatus = oldPerson.spiritualStatus.filter(
                (item) => item.statusId !== change.value.statusId
              );
            }

            // handle added item
            if (change.isAdded) {
              const isExist = oldPerson.spiritualStatus.find((item) => item.statusId === change.value.statusId);
              if (!isExist) {
                oldPerson.spiritualStatus.push(change.value);
              }
            }

            // handle modified item
            if (change.isModified) {
              oldPerson.spiritualStatus = oldPerson.spiritualStatus.filter(
                (item) => item.statusId !== change.value.statusId
              );
              oldPerson.spiritualStatus.push(change.value);
            }

            // update changes
            if (!oldPerson.changes) oldPerson.changes = [];
            const filteredChanges = [];
            oldPerson.changes.forEach((item) => {
              if (item.field === 'spiritualStatus' && item.value.statusId === change.value.statusId) {
                return;
              }
              filteredChanges.push(item);
            });
            oldPerson.changes = [...filteredChanges];
            oldPerson.changes.push(change);
          }
        });

        // handle service changes
        newChanges.forEach((change) => {
          if (change.field === 'otherService') {
            if (!oldPerson.otherService) oldPerson.otherService = [];

            // handle deleted item
            if (change.isDeleted) {
              oldPerson.otherService = oldPerson.otherService.filter(
                (item) => item.serviceId !== change.value.serviceId
              );
            }

            // handle added item
            if (change.isAdded) {
              const isExist = oldPerson.otherService.find((item) => item.serviceId === change.value.serviceId);
              if (!isExist) {
                oldPerson.otherService.push(change.value);
              }
            }

            // handle modified item
            if (change.isModified) {
              oldPerson.otherService = oldPerson.otherService.filter(
                (item) => item.serviceId !== change.value.serviceId
              );
              oldPerson.otherService.push(change.value);
            }

            // update changes
            if (!oldPerson.changes) oldPerson.changes = [];
            const filteredChanges = [];
            oldPerson.changes.forEach((item) => {
              if (item.field === 'otherService' && item.value.serviceId === change.value.serviceId) {
                return;
              }
              filteredChanges.push(item);
            });
            oldPerson.changes = [...filteredChanges];
            oldPerson.changes.push(change);
          }
        });
      }

      if (oldPerson.id) delete oldPerson.id;
      oldPerson.changes = oldPerson.changes?.filter((item) => item.field !== 'lastAssignment') || [];

      await appDb.persons.update(oldPerson.person_uid, oldPerson);
    }
  }

  // handle new person record
  for await (const newPerson of cong_persons) {
    const oldPerson = oldPersons.find((person) => person.person_uid === newPerson.person_uid);
    if (!oldPerson) {
      if (newPerson.id) delete newPerson.id;
      newPerson.changes = newPerson.changes.filter((item) => item.field !== 'lastAssignment');
      await appDb.persons.add(newPerson);
    }
  }
};

export const dbRestoreSourceMaterialFromBackup = async (cong_sourceMaterial) => {
  const oldSources = await appDb.src.toArray();
  for await (const src of cong_sourceMaterial) {
    const oldSrc = oldSources.find((source) => source.weekOf === src.weekOf);

    if (!oldSrc) {
      await appDb.src.add(src, src.weekOf);
      continue;
    }

    // restore standard field
    const obj = {};
    for (const [key, value] of Object.entries(src)) {
      if (key.indexOf('_override') === -1) {
        obj[key] = value;
      }
    }

    // restore keepOverride if qualified
    const newKeepOverride = src.keepOverride || undefined;
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
      for (const [key, value] of Object.entries(oldSrc)) {
        if (key.indexOf('_override') !== -1) {
          obj[key] = value;
        }
      }
    }

    if (!isRestore) {
      for (const [key, value] of Object.entries(src)) {
        if (key.indexOf('_override') !== -1) {
          obj[key] = value;
        }
      }
    }

    await appDb.src.update(src.weekOf, obj);
  }
};

export const dbRestoreScheduleFromBackup = async (cong_schedule) => {
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

          if (!isChanged) {
            if (!oldSchedule[change.field]) oldSchedule[change.field] = change.value;
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
};

export const dbRestorePocketFromBackup = async (cong_swsPocket) => {
  await appDb.sws_pocket.clear();
  for await (const pocket of cong_swsPocket) {
    await appDb.sws_pocket.add(pocket, pocket.id);
  }
};

export const dbRestoreServiceYearFromBackup = async (cong_serviceYear) => {
  const allSYs = await appDb.serviceYear.toArray();

  for await (const newSY of cong_serviceYear) {
    const foundSY = allSYs.find((record) => record.value === newSY.value);
    if (foundSY && foundSY.uid !== newSY.uid) {
      await appDb.serviceYear.delete(foundSY.uid);
      await appDb.serviceYear.add({ uid: newSY.uid, value: newSY.value });

      // update service year uid
      let attendances = await appDb.meetingAttendance.toArray();
      attendances = attendances.filter((record) => record.service_year === foundSY.uid);
      for await (const attendance of attendances) {
        const update = JSON.parse(JSON.stringify(attendance));
        update.service_year = newSY.uid;

        await appDb.serviceYear.update(update.uid, update);
      }

      let fieldServiceReports = await appDb.fieldServiceReports.toArray();
      fieldServiceReports = fieldServiceReports.filter((record) => record.service_year === foundSY.uid);
      for await (const report of fieldServiceReports) {
        const update = JSON.parse(JSON.stringify(report));
        update.service_year = newSY.uid;

        await appDb.fieldServiceReports.update(update.uid, update);
      }

      let branchReports = await appDb.branchReports.toArray();
      branchReports = branchReports.filter((record) => record.service_year === foundSY.uid);
      for await (const report of branchReports) {
        const update = JSON.parse(JSON.stringify(report));
        update.service_year = newSY.uid;

        await appDb.branchReports.update(update.uid, update);
      }

      let minutesReports = await appDb.minutesReports.toArray();
      minutesReports = minutesReports.filter((record) => record.service_year === foundSY.uid);
      for await (const report of minutesReports) {
        const update = { ...report };
        update.service_year = newSY.uid;

        await appDb.minutesReports.update(update.uid, update);
      }

      let lateReports = await appDb.lateReports.toArray();
      lateReports = lateReports.filter((record) => record.service_year === foundSY.uid);
      for await (const report of lateReports) {
        const update = { ...report };
        update.service_year = newSY.uid;

        await appDb.lateReports.update(update.uid, update);
      }
    }

    if (!foundSY) {
      await appDb.serviceYear.add({ uid: newSY.uid, value: newSY.value });
    }
  }
};

export const dbRestoreLateReportsFromBackup = async (cong_lateReports) => {
  const oldLateReports = await appDb.lateReports.toArray();

  for await (const newLateReport of cong_lateReports) {
    const oldLateReport = oldLateReports.find(
      (record) => record.service_year === newLateReport.service_year && record.person_uid === newLateReport.person_uid
    );

    if (!oldLateReport) {
      await appDb.lateReports.add(newLateReport);
    }
  }
};

export const dbRestoreMinutesReportsFromBackup = async (cong_minutesReports) => {
  const oldReports = await appDb.minutesReports.toArray();

  for await (const newReport of cong_minutesReports) {
    const oldReport = oldReports.find(
      (record) => record.service_year === newReport.service_year && record.person_uid === newReport.person_uid
    );

    if (!oldReport) {
      await appDb.minutesReports.add(newReport);
    }
  }
};

export const dbRestoreMeetingAttendanceFromBackup = async (cong_meetingAttendance) => {
  const oldData = await appDb.meetingAttendance.toArray();

  for await (const attendance of cong_meetingAttendance) {
    if (attendance.changes && attendance.changes.length > 0) {
      const foundAttendance = oldData.find(
        (record) => record.service_year === attendance.service_year && record.month_value === attendance.month_value
      );

      if (!foundAttendance) {
        const newRecord = JSON.parse(JSON.stringify(attendance));
        newRecord.uid = window.crypto.randomUUID();

        await appDb.meetingAttendance.add(newRecord);
      }

      if (foundAttendance) {
        const changes = attendance.changes;
        changes.sort((a, b) => {
          return a.date > b.date ? 1 : -1;
        });

        for (const change of changes) {
          const oldChange = foundAttendance.changes.find(
            (item) => item.type === change.type && item.index === change.index
          );

          let isUpdate = false;

          if (!oldChange) isUpdate = true;
          if (oldChange) {
            const dateA = new Date(oldChange.date);
            const dateB = new Date(change.date);

            if (dateB > dateA) isUpdate = true;
          }

          if (isUpdate) {
            let meetingArray =
              change.type === 'midweek' ? foundAttendance.midweek_meeting : foundAttendance.weekend_meeting;

            meetingArray = meetingArray.filter((record) => record.index !== change.index);
            meetingArray.push({ index: change.index, count: change.count });

            if (change.type === 'midweek') {
              foundAttendance.midweek_meeting = meetingArray;
            }

            if (change.type === 'weekend') {
              foundAttendance.weekend_meeting = meetingArray;
            }

            const newChanges = [];
            for (const oldChange of foundAttendance.changes) {
              if (oldChange.type === change.type && oldChange.index === change.index) {
                continue;
              }

              newChanges.push(oldChange);
            }

            foundAttendance.changes = [...newChanges];
            foundAttendance.changes.push(change);

            await appDb.meetingAttendance.update(foundAttendance.uid, foundAttendance);
          }
        }
      }
    }
  }
};

export const dbRestoreBranchReportsFromBackup = async (cong_branchReports) => {
  const oldData = await appDb.branchReports.toArray();

  for await (const report of cong_branchReports) {
    if (report.updatedAt !== null) {
      const oldReport = oldData.find((item) => item.report === report.report && item.month === report.month);

      if (!oldReport) {
        await appDb.branchReports.add(report);
      }

      if (oldReport) {
        const reportDate = new Date(report.updatedAt);
        const oldDate = new Date(oldReport.updatedAt);

        if (reportDate > oldDate) {
          oldReport.updatedAt = report.updatedAt;
          oldReport.details = report.details;

          await appDb.branchReports.update(oldReport.report_uid, oldReport);
        }
      }
    }
  }
};

export const dbRestoreFieldServiceReportsFromBackup = async (cong_fieldServiceReports) => {
  const oldData = await appDb.fieldServiceReports.toArray();

  for await (const report of cong_fieldServiceReports) {
    const oldRecord = oldData.find(
      (record) => record.service_year === report.service_year && record.person_uid === report.person_uid
    );

    if (!oldRecord) {
      await appDb.fieldServiceReports.add(report);
    }

    if (oldRecord) {
      for (const monthReport of report.months) {
        const oldMonth = oldRecord.months.find((record) => record.month_value === monthReport.month_value);

        if (!oldMonth) {
          oldRecord.months.push(monthReport);
        }

        if (oldMonth) {
          for (const change of monthReport.changes) {
            const oldChange = oldMonth.changes.find((item) => item.field === change.field);
            if (!oldChange) {
              oldMonth[change.field] = change.value;
              oldMonth.changes.push(change);
            }

            if (oldChange) {
              const oldDate = new Date(oldChange.date);
              const newDate = new Date(change.date);

              if (newDate > oldDate) {
                oldMonth[change.field] = change.value;
                oldMonth.changes = oldMonth.changes.filter((item) => item.field !== change.field);
                oldMonth.changes.push(change);
              }
            }
          }
        }
      }

      await appDb.fieldServiceReports.update(oldRecord.uid, oldRecord);
    }
  }
};

export const dbRestoreFieldServiceGroupFromBackup = async (cong_fieldServiceGroup) => {
  const oldData = await appDb.fieldServiceGroup.toArray();

  for await (const newList of cong_fieldServiceGroup) {
    const oldList = oldData.find((item) => item.fieldServiceGroup_uid === newList.fieldServiceGroup_uid);

    if (!oldList) {
      await appDb.fieldServiceGroup.add(newList);
    }

    if (oldList) {
      // check for deleted groups
      const deletedGroups = newList.changes.filter((record) => record.type === 'deleted');
      for (const deleted of deletedGroups) {
        oldList.groups = oldList.groups.filter((record) => record.group_uid !== deleted.group_uid);

        const newChanges = [];
        for (const change of oldList.changes) {
          if (change.type === 'deleted' && change.group_uid === deleted.group_uid) continue;
          newChanges.push(change);
        }
        oldList.changes = [...newChanges];
        oldList.changes.push(deleted);
      }

      // check for added or modified groups
      const activeGroups = newList.changes.filter((record) => record.type === 'added' || record.type === 'modified');
      activeGroups.sort((a, b) => {
        return a.index > b.index ? 1 : -1;
      });

      const oldGroups = JSON.parse(JSON.stringify(oldList.groups));
      oldList.groups.length = 0;

      for (const group of activeGroups) {
        const current = oldGroups.find((item) => item.group_uid === group.group_uid);
        if (current) {
          oldList.groups.push(current);
        }

        if (!current) {
          oldList.groups.push({ group_uid: group.group_uid, persons: [] });
        }

        const newChanges = [];
        for (const change of oldList.changes) {
          if (change.type === group.type && change.group_uid === group.group_uid) continue;
          newChanges.push(change);
        }
        oldList.changes = [...newChanges];
        oldList.changes.push(group);
      }

      // handle person changes
      const personChanges = newList.changes.filter(
        (record) =>
          record.type === 'person_added' || record.type === 'person_modified' || record.type === 'person_removed'
      );

      personChanges.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA > dateB ? 1 : -1;
      });

      for (const personChange of personChanges) {
        const currentGroup = oldList.groups.find((group) => group.group_uid === personChange.group_uid);

        const currentPerson = currentGroup.persons.find((person) => person.person_uid === personChange.person_uid);

        if (!currentPerson && personChange.type === 'person_added') {
          currentGroup.persons.push({ person_uid: personChange.person_uid, isAssistant: false, isOverseer: false });
        }

        if (personChange.type === 'person_removed' || personChange.type === 'person_modified') {
          currentGroup.persons = currentGroup.persons.filter((person) => person.person_uid !== personChange.person_uid);
        }

        if (personChange.type === 'person_modified') {
          const isOverseer = personChange.isOverseer || false;
          const isAssistant = personChange.isAssistant || false;
          currentGroup.persons.push({ person_uid: personChange.person_uid, isAssistant, isOverseer });
        }

        const newChanges = [];
        for (const change of oldList.changes) {
          if (
            change.type === personChange.type &&
            change.group_uid === personChange.group_uid &&
            change.person_uid === personChange.person_uid
          )
            continue;
          newChanges.push(change);
        }
        oldList.changes = [...newChanges];
        oldList.changes.push(personChange);
      }

      await appDb.fieldServiceGroup.update(oldList.fieldServiceGroup_uid, oldList);
    }
  }
};

export const dbRestoreCongregationBackup = async (payload) => {
  const cong_persons = payload.cong_persons;
  const cong_schedule = payload.cong_schedule;
  const cong_sourceMaterial = payload.cong_sourceMaterial;
  const cong_swsPocket = payload.cong_swsPocket;
  const cong_settings = payload.cong_settings;
  const cong_branchReports = payload.cong_branchReports;
  const cong_fieldServiceGroup = payload.cong_fieldServiceGroup;
  const cong_fieldServiceReports = payload.cong_fieldServiceReports;
  const cong_lateReports = payload.cong_lateReports;
  const cong_meetingAttendance = payload.cong_meetingAttendance;
  const cong_minutesReports = payload.cong_minutesReports;
  const cong_serviceYear = payload.cong_serviceYear;

  const lmmoRole = Setting.cong_role.includes('lmmo') || Setting.cong_role.includes('lmmo-backup');
  const secretaryRole = Setting.cong_role.includes('secretary');

  // restore settings
  await dbRestoreSettingFromBackup(cong_settings);

  // restore persons
  await dbRestorePersonsFromBackup(cong_persons);

  // restore source materials
  if (lmmoRole && cong_sourceMaterial) {
    await dbRestoreSourceMaterialFromBackup(cong_sourceMaterial);
  }

  // restore schedule
  if (lmmoRole && cong_schedule) {
    await dbRestoreScheduleFromBackup(cong_schedule);
  }

  // restore sws pocket info
  if (lmmoRole && cong_swsPocket) {
    await dbRestorePocketFromBackup(cong_swsPocket);
  }

  // restore cong_serviceYear data
  if (secretaryRole && cong_serviceYear) {
    await dbRestoreServiceYearFromBackup(cong_serviceYear);
  }

  // restore cong_serviceYear data
  if (secretaryRole && cong_lateReports) {
    await dbRestoreLateReportsFromBackup(cong_lateReports);
  }

  // restore cong_minutesReports data
  if (secretaryRole && cong_minutesReports) {
    await dbRestoreMinutesReportsFromBackup(cong_minutesReports);
  }

  // restore cong_meetingAttendance data
  if (secretaryRole && cong_meetingAttendance) {
    await dbRestoreMeetingAttendanceFromBackup(cong_meetingAttendance);
  }

  // restore cong_branchReports data
  if (secretaryRole && cong_branchReports) {
    await dbRestoreBranchReportsFromBackup(cong_branchReports);
  }

  // restore cong_branchReports data
  if (secretaryRole && cong_fieldServiceReports) {
    await dbRestoreFieldServiceReportsFromBackup(cong_fieldServiceReports);
  }

  // restore cong_fieldServiceGroup data
  if (secretaryRole && cong_fieldServiceGroup) {
    await dbRestoreFieldServiceGroupFromBackup(cong_fieldServiceGroup);
  }
};
