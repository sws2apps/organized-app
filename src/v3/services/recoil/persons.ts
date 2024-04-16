import { promiseSetRecoil } from 'recoil-outside';
import {
  isPersonDeleteState,
  personCurrentDetailsState,
  personsFiltersKeyState,
  personsSearchKeyState,
  selectedPersonState,
} from '@states/persons';
import { PersonType } from '@definition/person';

export const setIsPersonDelete = async (value) => {
  await promiseSetRecoil(isPersonDeleteState, value);
};

export const setCurrentPerson = async (data) => {
  await promiseSetRecoil(selectedPersonState, data);
};

export const setPersonsSearchKey = async (data) => {
  await promiseSetRecoil(personsSearchKeyState, data);
};

export const setPersonsFiltersKey = async (data: (string | number)[]) => {
  await promiseSetRecoil(personsFiltersKeyState, data);
};

export const setPersonCurrentDetails = async (data: PersonType) => {
  await promiseSetRecoil(personCurrentDetailsState, data);
};
