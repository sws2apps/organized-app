import BaseDexie from 'dexie';
import { PersonsTable, personsSchema } from './tables/persons';
import { SettingsTable, settingsSchema } from './tables/settings';
import { SourcesTable, sourcesSchema } from './tables/sources';
import { PublicTalksTable, publicTalksSchema } from './tables/publicTalks';
import { AssignmentTable, assignmentSchema } from './tables/assignment';
import { WeekTypeTable, weekTypeSchema } from './tables/weekType';
import { SchedTable, schedSchema } from './tables/sched';

type DexieTables = PersonsTable &
  SettingsTable &
  SourcesTable &
  PublicTalksTable &
  AssignmentTable &
  WeekTypeTable &
  SchedTable;

type Dexie<T = DexieTables> = BaseDexie & T;

const appDb = new BaseDexie('organized') as Dexie;

const schema = Object.assign(
  {},
  personsSchema,
  settingsSchema,
  sourcesSchema,
  publicTalksSchema,
  assignmentSchema,
  weekTypeSchema,
  schedSchema
);

appDb.version(4).stores(schema);

appDb.on('populate', function () {
  appDb.app_settings.add({
    id: 1,
    cong_number: '',
    cong_name: '',
    cong_role: [],
    class_count: 1,
    midweek_meeting_day: 1,
    weekend_meeting_day: 6,
    user_members_delegate: [],
    user_local_uid: '',
    schedule_useFullname: false,
    opening_prayer_MM_autoAssign: false,
    opening_prayer_WM_autoAssign: false,
    midweek_meeting_useExactDate: false,
    weekend_meeting_useSubstituteSpeaker: false,
    autoBackup: { value: true, updatedAt: new Date().toISOString() },
    autoBackup_interval: { value: 5, updatedAt: new Date().toISOString() },
    follow_os_theme: { value: true, updatedAt: new Date().toISOString() },
    user_time_away: { data: [], changes: [] },
  });
});

export default appDb;
