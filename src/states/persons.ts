/*
This file holds the source of the truth from the table "persons".
*/
import { atom } from 'jotai';
import { PersonType, PersonsTab } from '@definition/person';
import {
  applyAssignmentFilters,
  applyGroupFilters,
  applyNameFilters,
  personsSortByName,
} from '@services/app/persons';
import { localStorageGetItem } from '@utils/common';
import { userDataViewState } from './settings';
import { APRecordType } from '@definition/ministry';
import { fieldServiceGroupsState } from './field_service_groups';

export const personsState = atom<PersonType[]>([]);

export const personsAllState = atom((get) => {
  const persons = get(personsState);

  return personsSortByName(persons);
});

export const personsActiveState = atom((get) => {
  const persons = get(personsAllState);

  return persons.filter((person) => {
    if (person._deleted.value) return false;

    const archived = person.person_data.archived?.value ?? false;
    return !archived;
  });
});

export const isPersonDeleteState = atom(false);

export const selectedPersonState = atom<PersonType>({} as PersonType);

export const personsSearchKeyState = atom('');

export const personsFiltersKeyState = atom<(string | number)[]>([]);

export const personCurrentDetailsState = atom<PersonType>({
  _deleted: { value: false, updatedAt: '' },
  person_uid: '',
  person_data: {
    person_firstname: { value: '', updatedAt: '' },
    person_lastname: { value: '', updatedAt: '' },
    person_display_name: { value: '', updatedAt: '' },
    male: { value: true, updatedAt: '' },
    female: { value: false, updatedAt: '' },
    birth_date: { value: null, updatedAt: '' },
    assignments: [{ type: 'main', updatedAt: '', values: [] }],
    timeAway: [],
    archived: { value: false, updatedAt: '' },
    disqualified: { value: false, updatedAt: '' },
    email: { value: '', updatedAt: '' },
    address: { value: '', updatedAt: '' },
    phone: { value: '', updatedAt: '' },
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
          _deleted: false,
          updatedAt: '',
          start_date: new Date().toISOString(),
          end_date: null,
        },
      ],
    },
    privileges: [],
    enrollments: [],
    emergency_contacts: [],
    family_members: {
      head: false,
      members: [],
      updatedAt: '',
    },
  },
});

export const personsByViewState = atom((get) => {
  const languageGroups = get(fieldServiceGroupsState);
  const dataView = get(userDataViewState);
  const persons = get(personsActiveState);

  const group = languageGroups.find((g) => g.group_id === dataView);

  return persons.filter((record) => {
    if (dataView === 'main') return true;

    if (!group) return true;

    return group.group_data.members.some(
      (m) => m.person_uid === record.person_uid
    );
  });
});

export const personsFilteredState = atom((get) => {
  const personsAll = get(personsAllState);
  const searchKey = get(personsSearchKeyState);
  const filtersKey = get(personsFiltersKeyState);
  const personsByView = get(personsByViewState);

  const archived = filtersKey.includes('archived');

  const filteredByName: PersonType[] = applyNameFilters({
    persons: personsByView,
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
});

export const personsRecentState = atom<string[]>(
  localStorageGetItem('personsRecent')
    ? (JSON.parse(localStorageGetItem('personsRecent')) as string[])
    : []
);

export const personsTabState = atom(PersonsTab.ALL);

export const applicationsState = atom<APRecordType[]>([]);

export const applicationsNewState = atom((get) => {
  const applications = get(applicationsState);

  return applications
    .filter((record) => !record.status || record.status === 'waiting')
    .sort((a, b) => b.submitted.localeCompare(a.submitted));
});

export const applicationsCountState = atom((get) => {
  const applications = get(applicationsNewState);

  return applications.length.toString();
});

export const applicationsApprovedState = atom((get) => {
  const applications = get(applicationsState);

  return applications
    .filter((record) => record.status === 'approved')
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
});

export const personsFilterOpenState = atom(false);
