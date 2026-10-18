import { exportCsv } from '@utils/csv';
import { PersonType } from '@definition/person';
export const personsToCsv = (persons: PersonType[]) =>
  exportCsv(
    [
      'personalInfo.firstname',
      'personalInfo.middlename',
      'personalInfo.lastname',
      'contactInfo.phoneNumber',
      'contactInfo.emailAddress',
      'contactInfo.address',
    ],
    persons.map(({ person_data: person }) => [
      person.person_firstname.value,
      person.person_middlename?.value ?? '',
      person.person_lastname.value,
      person.phone.value,
      person.email.value,
      person.address.value,
    ])
  );
