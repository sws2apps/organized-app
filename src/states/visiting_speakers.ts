/*
This file holds the source of the truth from the table "visiting_speakers".
*/

import { atom, selector } from 'recoil';
import { congNumberState } from './settings';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { speakersCongregationsState } from './speakers_congregations';
import { personsState } from './persons';
import { personIsElder, personIsMS } from '@services/app/persons';

export const visitingSpeakersState = atom<VisitingSpeakerType[]>({
  key: 'visitingSpeakers',
  default: [],
});

export const visitingSpeakersActiveState = selector({
  key: 'visitingSpeakersActive',
  get: ({ get }) => {
    const speakers = get(visitingSpeakersState);
    return speakers.filter((record) => !record._deleted.value);
  },
});

export const myCongSpeakersState = selector({
  key: 'myCongSpeakers',
  get: ({ get }) => {
    const speakers = get(visitingSpeakersActiveState);

    if (!speakers) return [];

    const congregations = get(speakersCongregationsState);
    const congNumber = get(congNumberState);

    const congId = congregations.find(
      (record) => record.cong_data.cong_number.value === congNumber
    )?.id;

    const outgoingSpeakers = speakers.filter(
      (record) =>
        record._deleted.value === false &&
        record.speaker_data.cong_id === congId
    );

    return outgoingSpeakers;
  },
});

export const outgoingSpeakersState = selector({
  key: 'outgoingSpeakers',
  get: ({ get }) => {
    const speakers = get(myCongSpeakersState);
    const persons = get(personsState);

    const outgoingSpeakers = speakers
      .filter((record) => !record.speaker_data.local.value)
      .map((speaker) => {
        const findPerson = persons.find(
          (record) => record.person_uid === speaker.person_uid
        );

        return {
          person_uid: speaker.person_uid,
          _deleted: speaker._deleted,
          speaker_data: {
            ...speaker.speaker_data,
            person_display_name: {
              value: findPerson?.person_data.person_display_name.value || '',
              updatedAt: '',
            },
            person_firstname: {
              value: findPerson?.person_data.person_firstname.value || '',
              updatedAt: '',
            },
            person_lastname: {
              value: findPerson?.person_data.person_lastname.value || '',
              updatedAt: '',
            },
            elder: {
              value: findPerson ? personIsElder(findPerson) : false,
              updatedAt: '',
            },
            ministerial_servant: {
              value: findPerson ? personIsMS(findPerson) : false,
              updatedAt: '',
            },
            person_email: {
              value: findPerson?.person_data.email.value || '',
              updatedAt: '',
            },
            person_phone: {
              value: findPerson?.person_data.phone.value || '',
              updatedAt: '',
            },
          },
        } as VisitingSpeakerType;
      });

    return outgoingSpeakers;
  },
});

export const localSpeakersState = selector({
  key: 'localSpeakers',
  get: ({ get }) => {
    const speakers = get(myCongSpeakersState);
    const persons = get(personsState);

    const localSpeakers = speakers
      .filter((record) => record.speaker_data.local.value)
      .map((speaker) => {
        const findPerson = persons.find(
          (record) => record.person_uid === speaker.person_uid
        );

        return {
          person_uid: speaker.person_uid,
          _deleted: speaker._deleted,
          speaker_data: {
            ...speaker.speaker_data,
            person_display_name: {
              value: findPerson?.person_data.person_display_name.value || '',
              updatedAt: '',
            },
            person_firstname: {
              value: findPerson?.person_data.person_firstname.value || '',
              updatedAt: '',
            },
            person_lastname: {
              value: findPerson?.person_data.person_lastname.value || '',
              updatedAt: '',
            },
            elder: {
              value: findPerson ? personIsElder(findPerson) : false,
              updatedAt: '',
            },
            ministerial_servant: {
              value: findPerson ? personIsMS(findPerson) : false,
              updatedAt: '',
            },
            person_email: {
              value: findPerson?.person_data.email.value || '',
              updatedAt: '',
            },
            person_phone: {
              value: findPerson?.person_data.phone.value || '',
              updatedAt: '',
            },
          },
        } as VisitingSpeakerType;
      });

    return localSpeakers;
  },
});

export const incomingSpeakersState = selector({
  key: 'incomingSpeakers',
  get: ({ get }) => {
    const speakers = get(visitingSpeakersActiveState);
    const congregations = get(speakersCongregationsState);
    const congNumber = get(congNumberState);

    const congId = congregations.find(
      (record) => record.cong_data.cong_number.value === congNumber
    )?.id;

    const incomingSpeakers =
      speakers.filter(
        (record) =>
          record.speaker_data.cong_id !== congId &&
          record._deleted.value === false
      ) || [];

    return incomingSpeakers;
  },
});
