/*
This file holds the source of the truth from the table "persons".
*/
import { atom, selector } from 'recoil';
import { PersonType, PersonsTab } from '@definition/person';
import {
  applyAssignmentFilters,
  applyGroupFilters,
  applyNameFilters,
} from '@services/app/persons';
import { buildPersonFullname, localStorageGetItem } from '@utils/common';
import { fullnameOptionState } from './settings';

export const personsState = atom<PersonType[]>({
  key: 'persons',
  default: [],
});

export const personsAllState = selector({
  key: 'personsAll',
  get: ({ get }) => {
    const persons = get(personsState);
    const fullnameOption = get(fullnameOptionState);

    return persons
      .filter((person) => person._deleted.value === false)
      .sort((a, b) => {
        const fullnameA = buildPersonFullname(
          a.person_data.person_lastname.value,
          a.person_data.person_firstname.value,
          fullnameOption
        );
        const fullnameB = buildPersonFullname(
          b.person_data.person_lastname.value,
          b.person_data.person_firstname.value,
          fullnameOption
        );

        return fullnameA > fullnameB ? 1 : -1;
      });
  },
});

export const personsActiveState = selector({
  key: 'personsActive',
  get: ({ get }) => {
    const persons = get(personsAllState);

    return persons.filter((person) => !person.person_data.archived.value);
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
    _deleted: { value: false, updatedAt: '' },
    person_uid: '',
    person_data: {
      person_firstname: { value: '', updatedAt: '' },
      person_lastname: { value: '', updatedAt: '' },
      person_display_name: { value: '', updatedAt: '' },
      male: { value: true, updatedAt: '' },
      female: { value: false, updatedAt: '' },
      birth_date: { value: null, updatedAt: '' },
      assignments: [],
      timeAway: [],
      archived: { value: false, updatedAt: '' },
      disqualified: { value: false, updatedAt: '' },
      email: { value: '', updatedAt: '' },
      address: { value: '', updatedAt: '' },
      phone: { value: '', updatedAt: '' },
      first_month_report: { value: null, updatedAt: '' },
      publisher_baptized: {
        active: { value: false, updatedAt: '' },
        anointed: { value: false, updatedAt: '' },
        other_sheep: { value: true, updatedAt: '' },
        baptism_date: { value: null, updatedAt: '' },
        history: [],
      },
      publisher_unbaptized: {
        active: { value: false, updatedAt: '' },
        history: [],
      },
      midweek_meeting_student: {
        active: { value: true, updatedAt: '' },
        history: [
          {
            id: crypto.randomUUID(),
            start_date: {
              value: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            end_date: { value: null, updatedAt: new Date().toISOString() },
            _deleted: { value: false, updatedAt: '' },
          },
        ],
      },
      privileges: [],
      enrollments: [],
      emergency_contacts: [],
      categories: ['main'],
    },
  },
});

export const personsFilteredState = selector({
  key: 'personsFiltered',
  get: ({ get }) => {
    const personsAll = get(personsAllState);
    const persons = get(personsActiveState);
    const searchKey = get(personsSearchKeyState);
    const filtersKey = get(personsFiltersKeyState);

    const archived = filtersKey.includes('archived');

    const filteredByName: PersonType[] = applyNameFilters({
      persons,
      searchKey,
      archived,
      allPersons: personsAll,
    });

    const filteredByAssignments: PersonType[] = applyAssignmentFilters(
      filteredByName,
      filtersKey as number[]
    );

    const finalResult: PersonType[] = applyGroupFilters(
      filteredByAssignments,
      filtersKey as string[]
    );

    return finalResult;
  },
});

export const personsRecentState = atom<string[]>({
  key: 'personsRecent',
  default: localStorageGetItem('personsRecent')
    ? JSON.parse(localStorageGetItem('personsRecent'))
    : [],
});

export const personsTabState = atom({
  key: 'personsTab',
  default: PersonsTab.ALL,
});
