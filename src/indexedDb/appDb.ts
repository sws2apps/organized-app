import BaseDexie from 'dexie';
import { settingSchema } from '@services/dexie/schema';
import { PersonsTable, personsSchema } from './tables/persons';
import { SettingsTable, settingsSchema } from './tables/settings';
import { SourcesTable, sourcesSchema } from './tables/sources';
import { AssignmentTable, assignmentSchema } from './tables/assignment';
import { WeekTypeTable, weekTypeSchema } from './tables/weekType';
import { SchedTable, schedSchema } from './tables/sched';
import {
  FieldServiceGroupsTable,
  fieldServiceGroupsSchema,
} from './tables/field_service_groups';
import {
  VisitingSpeakersTable,
  visitingSpeakersSchema,
} from './tables/visiting_speakers';
import {
  UserBibleStudiesTable,
  userBibleStudiesSchema,
} from './tables/user_bible_studies';
import {
  UserFieldServiceReportsTable,
  userFieldServiceReportsSchema,
} from './tables/user_field_service_reports';
import {
  CongFieldServiceReportsTable,
  congFieldServiceReportsSchema,
} from './tables/cong_field_service_reports';
import {
  BranchFieldServiceReportsTable,
  branchFieldServiceReportsSchema,
} from './tables/branch_field_service_reports';
import {
  BranchCongAnalysisTable,
  branchCongAnalysisSchema,
} from './tables/branch_cong_analysis';
import {
  MeetingAttendanceTable,
  meetingAttendanceSchema,
} from './tables/meeting_attendance';
import {
  SpeakersCongregationsTable,
  speakersCongregationsSchema,
} from './tables/speakers_congregations';
import { notificationSchema, NotificationTable } from './tables/notifications';
import { MetadataTable, metadataSchema } from './tables/metadata';

type DexieTables = PersonsTable &
  SettingsTable &
  SourcesTable &
  AssignmentTable &
  WeekTypeTable &
  SchedTable &
  FieldServiceGroupsTable &
  VisitingSpeakersTable &
  UserBibleStudiesTable &
  UserFieldServiceReportsTable &
  CongFieldServiceReportsTable &
  BranchFieldServiceReportsTable &
  BranchCongAnalysisTable &
  MeetingAttendanceTable &
  SpeakersCongregationsTable &
  NotificationTable &
  MetadataTable;

type Dexie<T = DexieTables> = BaseDexie & T;

const appDb = new BaseDexie('organized') as Dexie;

const schema = {
  ...personsSchema,
  ...settingsSchema,
  ...sourcesSchema,
  ...assignmentSchema,
  ...weekTypeSchema,
  ...schedSchema,
  ...fieldServiceGroupsSchema,
  ...visitingSpeakersSchema,
  ...userBibleStudiesSchema,
  ...userFieldServiceReportsSchema,
  ...congFieldServiceReportsSchema,
  ...branchFieldServiceReportsSchema,
  ...branchCongAnalysisSchema,
  ...meetingAttendanceSchema,
  ...speakersCongregationsSchema,
  ...notificationSchema,
  ...metadataSchema,
};

appDb.version(4).stores(schema);

appDb.on('populate', function () {
  appDb.app_settings.add(settingSchema);
});

export default appDb;
