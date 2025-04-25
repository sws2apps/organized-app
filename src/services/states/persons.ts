// ** FOR SETTING STATE OUTSIDE REACT COMPONENTS OR TO AVOID USE OF USECALLBACK ** //

import { store } from '@states/index';
import {
  isPersonDeleteState,
  personCurrentDetailsState,
  personsAllState,
  personsFiltersKeyState,
  personsRecentState,
  personsSearchKeyState,
  selectedPersonState,
} from '@states/persons';
import { PersonType } from '@definition/person';

export const setIsPersonDelete = (value: boolean) => {
  store.set(isPersonDeleteState, value);
};

export const setCurrentPerson = (data: PersonType) => {
  store.set(selectedPersonState, data);
};

export const setPersonsSearchKey = (data: string) => {
  store.set(personsSearchKeyState, data);
};

export const setPersonsFiltersKey = (data: (string | number)[]) => {
  store.set(personsFiltersKeyState, data);
};

export const setPersonCurrentDetails = (data: PersonType) => {
  store.set(personCurrentDetailsState, data);
};

export const personsStateFind = (person_uid: string) => {
  const persons = store.get(personsAllState);

  const person = persons.find((record) => record.person_uid === person_uid);
  return person;
};

export const setPersonsRecent = (data: string[]) => {
  store.set(personsRecentState, data);
};
