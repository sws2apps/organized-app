import BaseDexie from 'dexie';
import { PersonsTable, personsSchema } from './tables/persons';
import { SettingsTable, settingsSchema } from './tables/settings';
import { SourcesTable, sourcesSchema } from './tables/sources';
import { AssignmentTable, assignmentSchema } from './tables/assignment';
import { WeekTypeTable, weekTypeSchema } from './tables/weekType';
import { SchedTable, schedSchema } from './tables/sched';
import { settingSchema } from '@services/dexie/schema';

type DexieTables = PersonsTable & SettingsTable & SourcesTable & AssignmentTable & WeekTypeTable & SchedTable;

type Dexie<T = DexieTables> = BaseDexie & T;

const appDb = new BaseDexie('organized') as Dexie;

const schema = {
  ...personsSchema,
  ...settingsSchema,
  ...sourcesSchema,
  ...assignmentSchema,
  ...weekTypeSchema,
  ...schedSchema,
};

appDb.version(1).stores(schema);

appDb.on('populate', function () {
  appDb.app_settings.add(settingSchema);
});

export default appDb;
