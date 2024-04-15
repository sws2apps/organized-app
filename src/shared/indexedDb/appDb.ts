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

const schema = {
  ...personsSchema,
  ...settingsSchema,
  ...sourcesSchema,
  ...publicTalksSchema,
  ...assignmentSchema,
  ...weekTypeSchema,
  ...schedSchema,
};

appDb.version(4).stores(schema);

appDb.on('populate', function () {
  appDb.app_settings.add({
    id: 1,
    firstname: { value: '', updatedAt: '' },
    lastname: { value: '', updatedAt: '' },
    source_lang: '',
    cong_number: '',
    cong_name: '',
    cong_new: true,
    cong_code: '',
    cong_role: [],
    class_count: { value: 1, updatedAt: '' },
    midweek_meeting_day: { value: 2, updatedAt: '' },
    meeting_time: { value: '', updatedAt: '' },
    user_avatar: undefined,
    co_name: { value: '', updatedAt: '' },
    co_displayName: { value: '', updatedAt: '' },
    autoBackup: { value: false, updatedAt: '' },
    autoBackup_interval: { value: 0, updatedAt: '' },
    schedule_useFullname: { value: false, updatedAt: '' },
    account_type: '',
    opening_prayer_MM_autoAssign: { value: false, updatedAt: '' },
    user_local_uid: '',
    user_members_delegate: [],
    opening_prayer_WM_autoAssign: { value: false, updatedAt: '' },
    weekend_meeting_day: { value: 6, updatedAt: '' },
    midweek_meeting_useExactDate: { value: false, updatedAt: '' },
    weekend_meeting_useSubstituteSpeaker: { value: false, updatedAt: '' },
    follow_os_theme: { value: false, updatedAt: '' },
    enable_hour_credits: { value: false, updatedAt: '' },
    user_time_away: [],
    public_talk_sync: '',
  });
});

export default appDb;
