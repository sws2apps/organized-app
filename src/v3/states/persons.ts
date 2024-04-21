/*
This file holds the source of the truth from the table "persons".
*/
import { atom, selector } from 'recoil';
import { PersonType, PersonsTab } from '@definition/person';
import { applyAssignmentFilters, applyGroupFilters, applyNameFilters } from '@services/app/persons';
import { localStorageGetItem } from '@utils/common';

export const personsState = atom<PersonType[]>({
  key: 'persons',
  default: [],
});

export const personsActiveState = selector({
  key: 'personsActive',
  get: ({ get }) => {
    const persons = get(personsState);

    return persons
      .filter((person) => person._deleted === null)
      .sort((a, b) => (a.person_lastname.value > b.person_lastname.value ? 1 : -1));
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

export const personsFiltersKeyState = atom<(string | number)[]>({
  key: 'personsFiltersKey',
  default: [],
});

export const personCurrentDetailsState = atom<PersonType>({
  key: 'personNewDetails',
  default: {
    _deleted: null,
    person_uid: '',
    person_firstname: { value: '', updatedAt: '' },
    person_lastname: { value: '', updatedAt: '' },
    person_displayName: { value: '', updatedAt: '' },
    isMale: { value: true, updatedAt: '' },
    isFemale: { value: false, updatedAt: '' },
    birthDate: { value: null, updatedAt: '' },
    assignments: [],
    timeAway: [],
    isArchived: { value: false, updatedAt: '' },
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
    },
    unbaptizedPublisher: {
      active: { value: false, updatedAt: '' },
      history: [],
    },
    midweekMeetingStudent: {
      active: { value: true, updatedAt: '' },
      history: [
        {
          id: crypto.randomUUID(),
          startDate: { value: new Date().toISOString(), updatedAt: new Date().toISOString() },
          endDate: { value: null, updatedAt: new Date().toISOString() },
          _deleted: null,
        },
      ],
    },
    privileges: [],
    enrollments: [],
    emergencyContacts: [],
  },
});

export const personsFilteredState = selector({
  key: 'personsFiltered',
  get: ({ get }) => {
    const persons = get(personsActiveState);
    const searchKey = get(personsSearchKeyState);
    const filtersKey = get(personsFiltersKeyState);

    const filteredByName: PersonType[] = applyNameFilters(persons, searchKey);

    const filteredByAssignments: PersonType[] = applyAssignmentFilters(filteredByName, filtersKey as number[]);

    const finalResult: PersonType[] = applyGroupFilters(filteredByAssignments, filtersKey as string[]);

    return finalResult;
  },
});

export const personsRecentState = atom<string[]>({
  key: 'personsRecent',
  default: localStorageGetItem('personsRecent') ? JSON.parse(localStorageGetItem('personsRecent')) : [],
});

export const personsTabState = atom({
  key: 'personsTab',
  default: PersonsTab.ALL,
});
