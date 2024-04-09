import { promiseSetRecoil } from 'recoil-outside';
import {
  isPersonDeleteState,
  personCurrentDetailsState,
  personsFiltersKeyState,
  personsSearchKeyState,
  selectedPersonState,
} from '@states/persons';
import { PersontType } from '@definition/person';

export const setIsPersonDelete = async (value) => {
  await promiseSetRecoil(isPersonDeleteState, value);
};

export const setCurrentPerson = async (data) => {
  await promiseSetRecoil(selectedPersonState, data);
};

export const setPersonsSearchKey = async (data) => {
  await promiseSetRecoil(personsSearchKeyState, data);
};

export const setPersonsFiltersKey = async (data: string[]) => {
  await promiseSetRecoil(personsFiltersKeyState, data);
};

export const setPersonCurrentDetails = async (data: PersontType) => {
  await promiseSetRecoil(personCurrentDetailsState, data);
};
