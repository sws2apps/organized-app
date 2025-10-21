import { EnrollmentType, PersonType } from '@definition/person';
import { formatDate } from '@utils/date';

export const enrollmentsAddHistory = (newPerson: PersonType) => {
  if (!newPerson.person_data.publisher_baptized.active.value) return;
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
  if (id === '') {
    return;
  }
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
  if (id === '') {
    return;
  }
  const newValue = value as EnrollmentType;

  const current = newPerson.person_data.enrollments.find(
    (history) => history.id === id
  );

  if (!current) return;

  current.enrollment = newValue;
  current.updatedAt = new Date().toISOString();
};
