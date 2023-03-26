import { AssignmentType } from '../classes/AssignmentType';
import { Persons } from '../classes/Persons';
import { Schedules } from '../classes/Schedules';
import { Setting } from '../classes/Setting';
import { Sources } from '../classes/Sources';
import { WeekTypeList } from '../classes/WeekType';

await Setting.load();
await AssignmentType.loadAll();
await WeekTypeList.loadAll();
await Sources.loadAll();
await Persons.loadAll();
await Schedules.loadAll();
Schedules.buildHistory();
await Setting.falseUpdate();
