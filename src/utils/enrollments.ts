import { EnrollmentType, PersonType } from '@definition/person';
import { formatDate } from '@utils/date';

export const enrollmentsAddHistory = (newPerson: PersonType) => {
  newPerson.person_data.enrollments.push({
    id: crypto.randomUUID(),
    _deleted: false,
    updatedAt: new Date().toISOString(),
    enrollment: 'AP',
    start_date: formatDate(new Date(), 'yyyy/MM/dd'),
    end_date: null,
  });
};

export const enrollmentStartDateChange = (
  newPerson: PersonType,
  id: string,
  value: Date
) => {
  // in case there will be errors commenting out for first time:  if (value === null) return;

  const current = newPerson.person_data.enrollments.find(
    (history) => history.id === id
  );

  current.start_date = formatDate(value, 'yyyy/MM/dd');
  current.updatedAt = new Date().toISOString();
};

export const enrollmentChange = (
  newPerson: PersonType,
  id: string,
  value: string
) => {
  const newValue = value as EnrollmentType;

  const current = newPerson.person_data.enrollments.find(
    (history) => history.id === id
  );

  current.enrollment = newValue;
  current.updatedAt = new Date().toISOString();
};
