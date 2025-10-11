import { PersonType, isPrivilegeType } from '@definition/person';
import { dateFirstDayMonth } from '@utils/date';
import { formatDate } from './date';

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
