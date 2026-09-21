import { dbResetExportState } from '@services/dexie/metadata';
import { dbBranchCongAnalysisClear } from '@services/dexie/branch_cong_analysis';
import { dbBranchFieldReportClear } from '@services/dexie/branch_field_service_reports';
import { dbFieldServiceReportsClear } from '@services/dexie/cong_field_service_reports';
import { dbFieldServiceGroupClear } from '@services/dexie/field_service_groups';
import { dbMeetingAttendanceClear } from '@services/dexie/meeting_attendance';
import { dbPersonsClear } from '@services/dexie/persons';
import { dbSpeakersCongregationsClear } from '@services/dexie/speakers_congregations';
import { dbUserBibleStudyClear } from '@services/dexie/user_bible_studies';
import { dbUserFieldServiceReportsClear } from '@services/dexie/user_field_service_reports';
import { dbVisitingSpeakersClear } from '@services/dexie/visiting_speakers';
import { dbUpcomingEventsClear } from '@services/dexie/upcoming_events';
import appDb from '@db/appDb';
import type { ImportDbType } from '@definition/backup';

/** Commit the selected backup tables and their sync metadata together. */
export const dbImportBackupData = async (data: ImportDbType) => {
  const tableNames = new Set(['metadata']);

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    tableNames.add(
      key === 'cong_settings' || key === 'user_settings' ? 'app_settings' : key
    );
  }

  const tables = [...tableNames].map((name) => appDb.table(name));

  await appDb.transaction('rw', tables, async () => {
    if (data.branch_cong_analysis) {
      await dbBranchCongAnalysisClear();
      await appDb.branch_cong_analysis.bulkPut(data.branch_cong_analysis);
    }

    if (data.branch_field_service_reports) {
      await dbBranchFieldReportClear();
      await appDb.branch_field_service_reports.bulkPut(
        data.branch_field_service_reports
      );
    }

    if (data.cong_field_service_reports) {
      await dbFieldServiceReportsClear();
      await appDb.cong_field_service_reports.bulkPut(
        data.cong_field_service_reports
      );
    }

    if (data.field_service_groups) {
      await dbFieldServiceGroupClear();
      await appDb.field_service_groups.bulkPut(data.field_service_groups);
    }

    if (data.meeting_attendance) {
      await dbMeetingAttendanceClear();
      await appDb.meeting_attendance.bulkPut(data.meeting_attendance);
    }

    if (data.persons) {
      await dbPersonsClear();
      await appDb.persons.bulkPut(data.persons);
    }

    if (data.sched) {
      await appDb.sched.bulkPut(data.sched);
    }

    if (data.sources) {
      await appDb.sources.bulkPut(data.sources);
    }

    if (data.speakers_congregations) {
      await dbSpeakersCongregationsClear();
      await appDb.speakers_congregations.bulkPut(data.speakers_congregations);
    }

    if (data.user_bible_studies) {
      await dbUserBibleStudyClear();
      await appDb.user_bible_studies.bulkPut(data.user_bible_studies);
    }

    if (data.user_field_service_reports) {
      await dbUserFieldServiceReportsClear();
      await appDb.user_field_service_reports.bulkPut(
        data.user_field_service_reports
      );
    }

    if (data.visiting_speakers) {
      await dbVisitingSpeakersClear();
      await appDb.visiting_speakers.bulkPut(data.visiting_speakers);
    }

    if (data.cong_settings) {
      await appDb.app_settings.update(1, {
        cong_settings: data.cong_settings,
      });
    }

    if (data.user_settings) {
      await appDb.app_settings.update(1, {
        user_settings: data.user_settings,
      });
    }

    if (data.upcoming_events) {
      await dbUpcomingEventsClear();
      await appDb.upcoming_events.bulkPut(data.upcoming_events);
    }

    await dbResetExportState();
  });
};
