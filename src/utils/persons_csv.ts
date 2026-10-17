import Papa from 'papaparse';
import { PersonType } from '@definition/person';
export const personsToCsv = (persons: PersonType[]) =>
  Papa.unparse(
    persons.map(({ person_data: person }) => ({
      'personalInfo.firstname': person.person_firstname.value,
      'personalInfo.middlename': person.person_middlename?.value ?? '',
      'personalInfo.lastname': person.person_lastname.value,
      'contactInfo.phoneNumber': person.phone.value,
      'contactInfo.emailAddress': person.email.value,
      'contactInfo.address': person.address.value,
    })),
    { quotes: true }
  );
