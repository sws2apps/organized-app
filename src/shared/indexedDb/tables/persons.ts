import { Table } from 'dexie';
import { PersonType } from '@definition/person';

export type PersonsTable = {
  persons: Table<PersonType>;
};

export const personsSchema = {
  persons:
    '&person_uid, _deleted, person_firstname, person_lastname, person_displayName, isMale, isFemale, birthDate, isUnavailable, assignments, timeAway, isDisqualified, email, address, phone, firstMonthReport, baptizedPublisher, unbaptizedPublisher, midweekMeetingStudent, privileges, enrollments, emergencyContacts, isArchived',
};
