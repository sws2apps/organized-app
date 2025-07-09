import { PersonType } from '@definition/person';
import { formatDate } from './date';
import { dateFirstDayMonth } from '@utils/date';
import { isPrivilegeType } from '@definition/person';

export const privilegesAddHistory = (newPerson: PersonType) => {
  if (newPerson.person_data.female.value) return;

  newPerson.person_data.privileges.push({
    id: crypto.randomUUID(),
    _deleted: false,
    updatedAt: new Date().toISOString(),
    privilege: 'ms',
    start_date: formatDate(dateFirstDayMonth(), 'yyyy/MM/dd'),
    end_date: null,
  });
};

export const privilegeStartDateChange = (
  newPerson: PersonType,
  id: string,
  value: Date
) => {
  // in case there will be errors commenting out for first time:  if (value === null) return;

  const current = newPerson.person_data.privileges.find(
    (history) => history.id === id
  );

  if (!current) {
    console.error(`Privilege with id ${id} not found`);
    return;
  }

  current.start_date = formatDate(value, 'yyyy/MM/dd');
  current.updatedAt = new Date().toISOString();
};

export const privilegeChange = (
  newPerson: PersonType,
  id: string,
  value: string
) => {
  const current = newPerson.person_data.privileges.find(
    (history) => history.id === id
  );

  if (!current) {
    console.error(`Privilege with id ${id} not found`);
    return;
  }

  if (!isPrivilegeType(value)) {
    console.error(`Invalid privilege type: ${value}`);
    return;
  }

  current.privilege = value;
  current.updatedAt = new Date().toISOString();
};
