import { promiseSetRecoil } from 'recoil-outside';
import { isPersonDeleteState, personsSearchKeyState, selectedPersonState } from '@states/persons';

export const setIsPersonDelete = async (value) => {
  await promiseSetRecoil(isPersonDeleteState, value);
};

export const setCurrentPerson = async (data) => {
  await promiseSetRecoil(selectedPersonState, data);
};

export const setPersonsSearchKeyState = async (data) => {
  await promiseSetRecoil(personsSearchKeyState, data);
};
