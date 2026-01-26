import { PersonType } from '@definition/person';
import { generateDisplayName } from './common';

export const changeFirstname = (newPerson: PersonType, value: string) => {
  newPerson.person_data.person_firstname.value = value;
  newPerson.person_data.person_firstname.updatedAt = new Date().toISOString();

  const dispName = generateDisplayName(
    newPerson.person_data.person_lastname.value,
    value
  );
  newPerson.person_data.person_display_name.value = dispName;
  newPerson.person_data.person_display_name.updatedAt =
    new Date().toISOString();
};

export const changeLastname = (newPerson: PersonType, value: string) => {
  newPerson.person_data.person_lastname.value = value;
  newPerson.person_data.person_lastname.updatedAt = new Date().toISOString();

  const dispName = generateDisplayName(
    value,
    newPerson.person_data.person_firstname.value
  );
  newPerson.person_data.person_display_name.value = dispName;
  newPerson.person_data.person_display_name.updatedAt =
    new Date().toISOString();
};

export const toggleGender = (
  newPerson: PersonType,
  value: 'male' | 'female'
) => {
  if (value === 'male') {
    newPerson.person_data.male.value = true;
    newPerson.person_data.male.updatedAt = new Date().toISOString();

    newPerson.person_data.female.value = false;
    newPerson.person_data.female.updatedAt = new Date().toISOString();
  }

  if (value === 'female') {
    newPerson.person_data.male.value = false;
    newPerson.person_data.male.updatedAt = new Date().toISOString();

    newPerson.person_data.female.value = true;
    newPerson.person_data.female.updatedAt = new Date().toISOString();
  }
};

export const changeBirthDate = (newPerson: PersonType, value: Date) => {
  newPerson.person_data.birth_date.value =
    value === null ? null : new Date(value).toISOString();
  newPerson.person_data.birth_date.updatedAt = new Date().toISOString();
};

export const changeEmailAddress = (newPerson: PersonType, value: string) => {
  newPerson.person_data.email.value = value;
  newPerson.person_data.email.updatedAt = new Date().toISOString();
};

export const changePhone = (newPerson: PersonType, value: string) => {
  newPerson.person_data.phone.value = value;
  newPerson.person_data.phone.updatedAt = new Date().toISOString();
};

export const changeAddress = (newPerson: PersonType, value: string) => {
  newPerson.person_data.address.value = value;
  newPerson.person_data.address.updatedAt = new Date().toISOString();
};
