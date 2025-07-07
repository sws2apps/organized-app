import { PersonType, PrivilegeType } from '@definition/person';
import { formatDate } from './date';

export const privilegesAddHistory = (newPerson: PersonType) => {
  if (newPerson.person_data.female.value) return;

  newPerson.person_data.privileges.push({
    id: crypto.randomUUID(),
    _deleted: false,
    updatedAt: new Date().toISOString(),
    privilege: 'ms',
    start_date: formatDate(new Date(), 'yyyy/MM/dd'),
    end_date: null,
  });
};

export const privilegeStartDateChange = (
  newPerson: PersonType,
  id: string,
  value: Date
) => {
  if (value === null) return;

  const current = newPerson.person_data.privileges.find(
    (history) => history.id === id
  );

  current.start_date = formatDate(value, 'yyyy/MM/dd');
  current.updatedAt = new Date().toISOString();
};

export const privilegeChange = (
  newPerson: PersonType,
  id: string,
  value: string
) => {
  const newValue = value as PrivilegeType;

  const current = newPerson.person_data.privileges.find(
    (history) => history.id === id
  );

  current.privilege = newValue;
  current.updatedAt = new Date().toISOString();
};
