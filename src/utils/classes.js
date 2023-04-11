import { AssignmentType } from '../classes/AssignmentType';
import { FSGList } from '../classes/FSGList';
import { S88s } from '../classes/S88s';
import { Persons } from '../classes/Persons';
import { Schedules } from '../classes/Schedules';
import { ServiceYear } from '../classes/ServiceYear';
import { Setting } from '../classes/Setting';
import { Sources } from '../classes/Sources';
import { WeekTypeList } from '../classes/WeekType';
import appDb from '../indexedDb/mainDb';

export const classesInitialize = async () => {
  await appDb.open();
  await Setting.load();
  await AssignmentType.loadAll();
  await WeekTypeList.loadAll();
  await Sources.loadAll();
  await Persons.loadAll();
  await Schedules.loadAll();
  Schedules.buildHistory();
  await FSGList.loadAll();
  await ServiceYear.loadAll();
  await ServiceYear.checkCurrent();
  await S88s.loadAll();
  console.log('CPE: Classes initialized');
};
