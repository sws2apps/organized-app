// to minimize the size of the worker file, we recreate all its needed functions in this file

import appDb from '@shared/indexedDb/appDb';

export const apiSendCongregationBackup = async ({ apiHost, congID, visitorID, userUID, reqPayload }) => {
  const res = await fetch(`${apiHost}api/congregations/${congID}/backup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      appclient: 'organized',
      appversion: import.meta.env.PACKAGE_VERSION,
      visitorid: visitorID,
      uid: userUID,
    },
    body: JSON.stringify(reqPayload),
  });

  const data = await res.json();

  return data;
};

export const apiSendUserBackup = async ({ apiHost, visitorID, userID, reqPayload }) => {
  const res = await fetch(`${apiHost}api/sws-pocket/${userID}/backup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      appclient: 'organized',
      appversion: import.meta.env.PACKAGE_VERSION,
      visitorid: visitorID,
    },
    body: JSON.stringify(reqPayload),
  });

  const data = await res.json();

  return data;
};

export const apiFetchCongregationLastBackup = async ({ apiHost, visitorID, userUID, congID }) => {
  const res = await fetch(`${apiHost}api/congregations/${congID}/backup/last`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      appclient: 'organized',
      appversion: import.meta.env.PACKAGE_VERSION,
      visitorid: visitorID,
      uid: userUID,
    },
  });

  const data = await res.json();

  return data;
};

type BackupData = {
  dbPersons?: [];
  dbDeleted?: [];
  dbSourceMaterial?: [];
  dbSchedule?: object[];
  dbPublicTalks?: [];
  dbVisitingSpeakers?: [];
  dbBranchReportsTbl?: [];
  dbFieldServiceGroupTbl?: [];
  dbFieldServiceReportsTbl?: [];
  dbLateReportsTbl?: [];
  dbMeetingAttendanceTbl?: [];
  dbMinutesReportsTbl?: [];
  dbServiceYearTbl?: [];
  dbUserBibleStudiesTbl?: [];
  dbUserFieldServiceReportsTbl?: [];
  dbSettings?: object[];
};

export const dbExportDataOnline = async ({ cong_role }) => {
  const data: BackupData = {};

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
