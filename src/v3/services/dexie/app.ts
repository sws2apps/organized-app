import Dexie from 'dexie';
import { promiseGetRecoil } from 'recoil-outside';
import { appDb } from '.';
import {
  congRoleState,
  coordinatorRoleState,
  elderRoleState,
  lmmoRoleState,
  msRoleState,
  publicTalkCoordinatorRoleState,
  publisherRoleState,
  secretaryRoleState,
  settingsState,
} from '@states/settings';
import { BackupDataType, SettingsType } from '@definition/app';
import {
  AssignmentChange,
  OtherServiceChange,
  PersontType,
  SpiritualStatusChange,
  TimeAwayChange,
} from '@definition/person';

export const deleteAppDb = async () => {
  await appDb.close();
  await Dexie.delete('organized');
};

export const dbExportTable = async (table_name: string): Promise<[]> => {
  const result = await appDb.table(table_name).toArray();
  return result;
};

export const dbExportDataOnline = async () => {
  const cong_role = await promiseGetRecoil(congRoleState);

  const data: BackupDataType = {};

  const lmmoRole = cong_role.includes('lmmo') || cong_role.includes('lmmo-backup');
  const secretaryRole = cong_role.includes('secretary');
  const weekendEditorRole = cong_role.includes('coordinator') || cong_role.includes('public_talk_coordinator');
  const publicTalkCoordinatorRole = cong_role.includes('public_talk_coordinator');
  const publisherRole = cong_role.includes('publisher') || cong_role.includes('ms') || cong_role.includes('elder');

  if (lmmoRole || secretaryRole || weekendEditorRole) {
    // get persons
    data.dbPersons = await appDb.persons.toArray();

    // get deleted items
    data.dbDeleted = await appDb.deleted.toArray();
  }

  if (lmmoRole || weekendEditorRole) {
    // get source materials
    data.dbSourceMaterial = await appDb.sources.toArray();

    // get schedules
    const tmpSchedule = await appDb.sched.toArray();
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
  }

  if (publicTalkCoordinatorRole) {
    // get public talks
    data.dbPublicTalks = await appDb.public_talks.toArray();

    // get visiting speakers
    data.dbVisitingSpeakers = await appDb.visiting_speakers.toArray();
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

  if (publisherRole) {
    // get user bible studies
    data.dbUserBibleStudiesTbl = await appDb.user_bible_studies.toArray();

    // get user field service reports
    data.dbUserFieldServiceReportsTbl = await appDb.user_field_service_reports.toArray();
  }

  if (lmmoRole || secretaryRole || weekendEditorRole) {
    // remove local user settings before export
    const appSettings = (await appDb.app_settings.toArray())[0];
    delete appSettings.username;
    delete appSettings.user_avatar;
    delete appSettings.cong_role;

    // get app settings
    data.dbSettings = [appSettings];
  }

  return data;
};

export const dbRestoreSettingFromBackup = async (cong_settings: SettingsType[]) => {
  const settings = await promiseGetRecoil(settingsState);

  await appDb.app_settings.clear();
  for await (const settingItem of cong_settings) {
    const setting = {
      ...settingItem,
      username: settings.username,
      user_avatar: settings.user_avatar,
      user_local_uid: settings.user_local_uid,
      user_members_delegate: settings.user_members_delegate,
      cong_role: settings.cong_role,
    };

    await appDb.app_settings.add(setting, setting.id);
  }
};

export const dbRestorePersonsFromBackup = async (cong_persons: PersontType[]) => {
  const oldPersons: PersontType[] = await appDb.persons.toArray();

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
        newChanges.forEach((change: AssignmentChange) => {
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
            oldPerson.changes.forEach((item: AssignmentChange) => {
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
        newChanges.forEach((change: TimeAwayChange) => {
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
              oldPerson.changes.forEach((item: TimeAwayChange) => {
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
        newChanges.forEach((change: SpiritualStatusChange) => {
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
            oldPerson.changes.forEach((item: SpiritualStatusChange) => {
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
        newChanges.forEach((change: OtherServiceChange) => {
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
            oldPerson.changes.forEach((item: OtherServiceChange) => {
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
  const oldSources = await appDb.sources.toArray();

  for await (const src of cong_sourceMaterial) {
    const oldSrc = oldSources.find((source) => source.weekOf === src.weekOf);

    if (!oldSrc) {
      await appDb.sources.add(src, src.weekOf);
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

    await appDb.sources.update(src.weekOf, obj);
  }
};

export const dbRestoreScheduleFromBackup = async (cong_schedule) => {
  const oldSchedules = await appDb.sched.toArray();
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

      await appDb.sched.put(oldSchedule, oldSchedule.weekOf);
    }
  }

  // handle new schedule record
  for await (const newSchedule of cong_schedule) {
    if (newSchedule.weekOf) {
      const oldSchedule = oldSchedules.find((schedule) => schedule.weekOf === newSchedule.weekOf);
      if (!oldSchedule) {
        await appDb.sched.put(newSchedule, newSchedule.weekOf);
      }
    }
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

export const dbRestorePublicTalksFromBackup = async (cong_publicTalks) => {
  const dbPublicTalks = await appDb.public_talks.toArray();

  // new record
  if (dbPublicTalks.length === 0) {
    for await (const public_talk of cong_publicTalks) {
      await appDb.public_talks.add(public_talk, public_talk.talk_number);
    }
    return;
  }

  // update record
  for (const incomingTalk of cong_publicTalks) {
    const currentTalk = dbPublicTalks.find((talk) => talk.talk_number === incomingTalk.talk_number);

    for (const [talkLanguage] of Object.entries(incomingTalk.talk_title)) {
      const incomingModified = incomingTalk.talk_title[talkLanguage].modified;
      const currentModified = currentTalk.talk_title[talkLanguage]?.modified;
      let isUpdated = false;

      if (!currentModified) {
        currentTalk.talk_title[talkLanguage] = incomingTalk.talk_title[talkLanguage];
        isUpdated = true;
      }

      if (currentModified && incomingModified > currentModified) {
        currentTalk.talk_title[talkLanguage] = incomingTalk.talk_title[talkLanguage];
        isUpdated = true;
      }

      if (isUpdated) {
        await appDb.public_talks.update(currentTalk.talk_number, currentTalk);
      }
    }
  }
};

export const dbRestoreVisitingSpeakersFromBackup = async (cong_visitingSpeakers) => {
  const deletedCongregations = cong_visitingSpeakers.filter((record) => record.is_deleted);
  const activeCongregations = cong_visitingSpeakers.filter((record) => !record.is_deleted);

  // remove deleted congregations
  for await (const cong of deletedCongregations) {
    const isExist = await appDb.visiting_speakers.get(cong.cong_number);
    if (isExist) {
      await appDb.visiting_speakers.delete(cong.cong_number);
    }
  }

  for await (const cong of activeCongregations) {
    const oldCong = await appDb.visiting_speakers.get(cong.cong_number);

    // handle new congregations
    if (!oldCong) {
      await appDb.visiting_speakers.add(cong);
      continue;
    }

    // handle congregation update
    if (oldCong) {
      if (!oldCong.changes) oldCong.changes = [];

      // handle outer changes
      const newChanges = cong.changes || [];
      const oldChanges = oldCong.changes;

      for (const newChange of newChanges) {
        const oldChange = oldChanges.find((item) => item.field === newChange.field);

        if (!oldChange) {
          oldCong[newChange.field] = newChange.value;
          oldCong.changes.push(newChange);
        }

        if (oldChange) {
          const oldDate = new Date(oldChange.date);
          const newDate = new Date(newChange.date);

          if (newDate > oldDate) {
            oldCong[newChange.field] = newChange.value;
            oldCong.changes = oldCong.changes.filter((item) => item.field !== newChange.field);
            oldCong.changes.push(newChange);
          }
        }
      }

      // handle cong_speakers changes
      const deletedSpeakers = cong.cong_speakers.filter((record) => record.is_deleted);
      const activeSpeakers = cong.cong_speakers.filter((record) => !record.is_deleted);

      // remove deleted speakers
      for await (const speaker of deletedSpeakers) {
        oldCong.cong_speakers = oldCong.cong_speakers.filter((record) => record.person_uid !== speaker.person_uid);
      }

      for await (const speaker of activeSpeakers) {
        const oldSpeaker = oldCong.cong_speakers.find((record) => record.person_uid === speaker.person_uid);

        // add new speakers
        if (!oldSpeaker) {
          oldCong.cong_speakers.push(speaker);
          continue;
        }

        // handle speaker changes
        if (oldSpeaker) {
          if (!oldSpeaker.changes) oldSpeaker.changes = [];

          const newChanges = speaker.changes || [];
          const oldChanges = oldSpeaker.changes;

          for (const newChange of newChanges) {
            const oldChange = oldChanges.find((item) => item.field === newChange.field);

            if (!oldChange) {
              oldSpeaker[newChange.field] = newChange.value;
              oldSpeaker.changes.push(newChange);
            }

            if (oldChange) {
              const oldDate = new Date(oldChange.date);
              const newDate = new Date(newChange.date);

              if (newDate > oldDate) {
                oldSpeaker[newChange.field] = newChange.value;
                oldSpeaker.changes = oldSpeaker.changes.filter((item) => item.field !== newChange.field);
                oldSpeaker.changes.push(newChange);
              }
            }
          }
        }
      }

      await appDb.visiting_speakers.update(cong.cong_number, { ...oldCong });
    }
  }
};

export const dbRestoreUserBibleStudiesFromBackup = async (user_bibleStudies) => {
  const oldBibleStudies = await appDb.user_bible_studies.toArray();

  for await (const bibleStudy of user_bibleStudies) {
    // delete record and continue
    if (bibleStudy.isDeleted) {
      const isExist = await appDb.user_bible_studies.get(bibleStudy.uid);
      if (isExist) {
        await appDb.user_bible_studies.delete(bibleStudy.uid);
      }

      continue;
    }

    const oldRecord = oldBibleStudies.find((item) => item.uid === bibleStudy.uid);

    // add new record and continue loop
    if (!oldRecord) {
      await appDb.user_bible_studies.add(bibleStudy);
      continue;
    }

    // update existing
    if (oldRecord) {
      const newChanges = bibleStudy.changes || [];
      const oldChanges = oldRecord.changes || [];

      for (const change of newChanges) {
        const oldChange = oldChanges.find((item) => item.field === change.field);

        if (!oldChange) {
          oldRecord[change.field] = change.value;
          if (!oldRecord.changes) oldRecord.changes = [];
          oldRecord.changes.push(change);
        }

        if (oldChange) {
          const oldDate = new Date(oldChange.date);
          const newDate = new Date(change.date);

          if (newDate > oldDate) {
            oldRecord[change.field] = change.value;
            oldRecord.changes = oldRecord.changes.filter((item) => item.field !== change.field);
            oldRecord.changes.push(change);
          }
        }
      }

      await appDb.user_bible_studies.update(oldRecord.uid, { ...oldRecord });
    }
  }
};

export const dbRestoreUserFieldServiceReportsFromBackup = async (user_fieldServiceReports) => {
  const oldReports = await appDb.user_field_service_reports.toArray();

  for await (const report of user_fieldServiceReports) {
    // delete record and continue
    if (report.isDeleted) {
      const isExist = await appDb.user_field_service_reports.get(report.report_uid);
      if (isExist) {
        await appDb.user_field_service_reports.delete(report.report_uid);
      }

      continue;
    }

    const oldRecord = oldReports.find((item) => item.report_uid === report.report_uid);

    // add new record and continue loop
    if (!oldRecord) {
      await appDb.user_field_service_reports.add(report);
      continue;
    }

    // update existing
    if (oldRecord) {
      const newChanges = report.changes || [];
      const oldChanges = oldRecord.changes || [];

      for (const change of newChanges) {
        // update S4 and S21 records
        if (report.isS4 || report.isS21) {
          const oldDate = oldChanges[0] ? new Date(oldChanges[0].date) : undefined;
          const newDate = new Date(change.date);

          let isUpdate = false;

          if (!oldDate) isUpdate = true;
          if (oldDate && oldDate < newDate) isUpdate = true;

          if (isUpdate) {
            oldRecord.changes = [];
            oldRecord.changes.push(change);

            for (const [key, value] of Object.entries(report)) {
              if (key !== 'changes') oldRecord[key] = value;
            }
          }
        }

        // update daily records
        if (!report.isS4 && !report.isS21) {
          const oldChange = oldChanges.find((item) => item.field === change.field);

          if (!oldChange) {
            oldRecord[change.field] = change.value;
            if (!oldRecord.changes) oldRecord.changes = [];
            oldRecord.changes.push(change);
          }

          if (oldChange) {
            const oldDate = new Date(oldChange.date);
            const newDate = new Date(change.date);

            if (newDate > oldDate) {
              oldRecord[change.field] = change.value;
              oldRecord.changes = oldRecord.changes.filter((item) => item.field !== change.field);
              oldRecord.changes.push(change);
            }
          }
        }
      }

      await appDb.user_field_service_reports.update(report.report_uid, { ...oldRecord });
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
  const cong_settings = payload.cong_settings;
  const cong_branchReports = payload.cong_branchReports;
  const cong_fieldServiceGroup = payload.cong_fieldServiceGroup;
  const cong_fieldServiceReports = payload.cong_fieldServiceReports;
  const cong_lateReports = payload.cong_lateReports;
  const cong_meetingAttendance = payload.cong_meetingAttendance;
  const cong_minutesReports = payload.cong_minutesReports;
  const cong_serviceYear = payload.cong_serviceYear;
  const user_bibleStudies = payload.user_bibleStudies;
  const user_fieldServiceReports = payload.user_fieldServiceReports;
  const cong_publicTalks = payload.cong_publicTalks;
  const cong_visitingSpeakers = payload.cong_visitingSpeakers;

  const lmmoRole = await promiseGetRecoil(lmmoRoleState);
  const secretaryRole = await promiseGetRecoil(secretaryRoleState);
  const coordinatorRole = await promiseGetRecoil(coordinatorRoleState);
  const publicTalkCoordinatorRole = await promiseGetRecoil(publicTalkCoordinatorRoleState);
  const publisherRole = await promiseGetRecoil(publisherRoleState);
  const msRole = await promiseGetRecoil(msRoleState);
  const elderRole = await promiseGetRecoil(elderRoleState);

  const weekendEditorRole = coordinatorRole || publicTalkCoordinatorRole;
  const localPublisherRole = publisherRole || msRole || elderRole;

  if (lmmoRole || secretaryRole || weekendEditorRole) {
    // restore settings
    await dbRestoreSettingFromBackup(cong_settings);

    // restore persons
    await dbRestorePersonsFromBackup(cong_persons);
  }

  // restore source materials
  if ((lmmoRole || weekendEditorRole) && cong_sourceMaterial) {
    await dbRestoreSourceMaterialFromBackup(cong_sourceMaterial);
  }

  // restore schedule
  if ((lmmoRole || weekendEditorRole) && cong_schedule) {
    await dbRestoreScheduleFromBackup(cong_schedule);
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

  // restore cong_publicTalks data
  if ((lmmoRole || weekendEditorRole) && cong_publicTalks) {
    await dbRestorePublicTalksFromBackup(cong_publicTalks);
  }

  // restore cong_visitingSpeakers data
  if (weekendEditorRole && cong_visitingSpeakers) {
    await dbRestoreVisitingSpeakersFromBackup(cong_visitingSpeakers);
  }

  // restore user_bibleStudies data
  if (localPublisherRole && user_bibleStudies) {
    await dbRestoreUserBibleStudiesFromBackup(user_bibleStudies);
  }

  // restore user_fieldServiceReports data
  if (localPublisherRole && user_fieldServiceReports) {
    await dbRestoreUserFieldServiceReportsFromBackup(user_fieldServiceReports);
  }
};
