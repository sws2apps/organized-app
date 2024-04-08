/*
This file holds the source of the truth from the table "persons".
*/
import { PersontType } from '@definition/person';
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

export const personsFiltersKeyState = atom<string[]>({
  key: 'personsFiltersKey',
  default: [],
});

export const personCurrentDetailsState = atom<PersontType>({
  key: 'personNewDetails',
  default: {
    person_uid: crypto.randomUUID(),
    person_firstname: { value: '', updatedAt: '' },
    person_lastname: { value: '', updatedAt: '' },
    person_displayName: { value: '', updatedAt: '' },
    isMale: { value: true, updatedAt: '' },
    isFemale: { value: false, updatedAt: '' },
    birthDate: { value: null, updatedAt: '' },
    isUnavailable: { value: false, updatedAt: '' },
    assignments: { values: [], _deleted: [] },
    timeAway: { values: [], _deleted: [] },
    isMoved: { value: false, updatedAt: '' },
    isDisqualified: { value: false, updatedAt: '' },
    email: { value: '', updatedAt: '' },
    address: { value: '', updatedAt: '' },
    phone: { value: '', updatedAt: '' },
    firstMonthReport: { value: null, updatedAt: '' },
    baptizedPublisher: {
      active: { value: false, updatedAt: '' },
      isAnointed: { value: false, updatedAt: '' },
      isOtherSheep: { value: true, updatedAt: '' },
      baptismDate: { value: null, updatedAt: '' },
      history: [],
      _deleted: [],
    },
    unbaptizedPublisher: {
      active: { value: false, updatedAt: '' },
      history: [],
      _deleted: [],
    },
    midweekMeetingStudent: {
      active: { value: true, updatedAt: '' },
      history: [
        {
          id: crypto.randomUUID(),
          startDate: { value: new Date().toISOString(), updatedAt: new Date().toISOString() },
          endDate: {
            value: null,
            updatedAt: new Date().toISOString(),
          },
        },
      ],
      _deleted: [],
    },
    privileges: { history: [], _deleted: [] },
    enrollments: { history: [], _deleted: [] },
  },
});
