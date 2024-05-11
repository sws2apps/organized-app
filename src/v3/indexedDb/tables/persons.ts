import { Table } from 'dexie';
import { PersonType } from '@definition/person';

export type PersonsTable = {
  persons: Table<PersonType>;
};

export const personsSchema = {
  persons:
    '&person_uid, _deleted, person_firstname, person_lastname, person_display_name, male, female, birth_date, isUnavailable, assignments, timeAway, disqualified, email, address, phone, first_month_report, publisher_baptized, publisher_unbaptized, midweek_meeting_student, privileges, enrollments, emergency_contacts, archived',
};
