/*
This file holds the source of the truth from the table "persons".
*/
import { atom, selector } from 'recoil';

export const personsState = atom({
  key: 'persons',
  default: [],
});

export const personsActiveState = selector({
  key: 'personsActive',
  get: ({ get }) => {
    const persons = get(personsState);

    return persons
      .filter((person) => !person.is_deleted && !person.isMoved)
      .sort((a, b) => (a.person_name > b.person_name ? 1 : -1));
  },
});

export const isPersonDeleteState = atom({
  key: 'isPersonDelete',
  default: false,
});

export const selectedPersonState = atom({
  key: 'selectedPerson',
  default: {},
});

export const personsSearchKeyState = atom({
  key: 'personsSearchKey',
  default: '',
});
