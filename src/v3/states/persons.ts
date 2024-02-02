/*
This file holds the source of the truth from the table "persons".
*/
import { atom, selector } from 'recoil';
import {
  personIsActivePublisher,
  personIsAuxiliaryPioneer,
  personIsBaptized,
  personIsElder,
  personIsMS,
  personIsPublisher,
  personIsRegularPioneer,
  personIsSpecialPioneer,
  personIsValidPublisher,
  personsFilter,
} from '@services/cpe/persons';

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

export const personsFilteredState = selector({
  key: 'personsFiltered',
  get: async ({ get }) => {
    const persons = get(personsActiveState);
    const search = get(personsSearchKeyState);

    const result = await personsFilter({ persons, data: { txtSearch: search } });
    return result;
  },
});

export const personsSearchableState = selector({
  key: 'personsSearchable',
  get: async ({ get }) => {
    const persons = get(personsActiveState);
    const result = [];

    for await (const person of persons) {
      const obj = structuredClone(person);

      obj.isElder = await await personIsElder(person.person_uid);
      obj.isMS = await personIsMS(person.person_uid);
      obj.isPublisher = await personIsPublisher(person.person_uid);
      obj.isValid = await personIsValidPublisher(person.person_uid);
      obj.isBaptized = await personIsBaptized(person.person_uid);
      obj.isActive = await personIsActivePublisher(person.person_uid);
      obj.isAuxP = await personIsAuxiliaryPioneer(person.person_uid);
      obj.isFR = await personIsRegularPioneer(person.person_uid);
      obj.isSFTS = await personIsSpecialPioneer(person.person_uid);

      result.push(obj);
    }

    return result;
  },
});
