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
import {
  delegatedFieldServiceReportsSchema,
  DelegatedFieldServiceReportsTable,
} from './tables/delegated_field_service_reports';
import { SettingsType } from '@definition/settings';
import { LANGUAGE_LIST } from '@constants/index';
import {
  upcomingEventsSchema,
  UpcomingEventsTable,
} from './tables/upcoming_events';
import { publicTalkSchema, PublicTalkTable } from './tables/public_talk';
import { songSchema, SongTable } from './tables/songs';

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
  UpcomingEventsTable &
  MetadataTable &
  DelegatedFieldServiceReportsTable &
  PublicTalkTable &
  SongTable;

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
};

appDb
  .version(5)
  .stores(schema)
  .upgrade(async (prevDb) => {
    const oldSettings = (await prevDb
      .table('app_settings')
      .get(1)) as SettingsType;

    const sourceAutoImport = oldSettings.cong_settings[
      'source_material_auto_import'
    ] as SettingsType['cong_settings']['source_material']['auto_import'];

    if (sourceAutoImport) {
      const lang = localStorage.getItem('ui_lang');
      const jwLang =
        LANGUAGE_LIST.find((record) => record.locale === lang)?.code || 'E';

      const settings = structuredClone(oldSettings);

      settings.cong_settings.source_material = {
        auto_import: sourceAutoImport,
        language: [
          {
            type: 'main',
            value: jwLang.toUpperCase(),
            updatedAt: new Date().toISOString(),
            _deleted: false,
          },
        ],
      };

      delete settings.cong_settings['source_material_auto_import'];

      await prevDb.table('app_settings').put(settings);
    }
  });

appDb.version(6).stores(schema);

appDb.version(7).stores({ ...schema, ...metadataSchema });

appDb.version(8).stores({
  ...schema,
  ...metadataSchema,
  ...delegatedFieldServiceReportsSchema,
});

appDb.version(9).stores({
  ...schema,
  ...metadataSchema,
  ...delegatedFieldServiceReportsSchema,
  ...upcomingEventsSchema,
});

appDb.version(10).stores({
  ...schema,
  ...metadataSchema,
  ...delegatedFieldServiceReportsSchema,
  ...weekTypeSchema,
});

appDb.version(11).stores({
  ...schema,
  ...metadataSchema,
  ...delegatedFieldServiceReportsSchema,
  ...weekTypeSchema,
  ...publicTalkSchema,
  ...songSchema,
});

appDb.version(12).stores({
  ...schema,
  ...metadataSchema,
  ...delegatedFieldServiceReportsSchema,
  ...weekTypeSchema,
  ...publicTalkSchema,
  ...songSchema,
  ...upcomingEventsSchema,
});

appDb.on('populate', function () {
  appDb.app_settings.add(settingSchema);
});

export default appDb;
