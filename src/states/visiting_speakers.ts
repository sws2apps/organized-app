/*
This file holds the source of the truth from the table "visiting_speakers".
*/

import { atom } from 'jotai';
import { congNameState, congNumberState } from './settings';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { speakersCongregationsActiveState } from './speakers_congregations';
import { personsState } from './persons';
import { personIsElder, personIsMS } from '@services/app/persons';

export const visitingSpeakersState = atom<VisitingSpeakerType[]>([]);

export const visitingSpeakersActiveState = atom((get) => {
  const speakers = get(visitingSpeakersState);
  return speakers.filter((record) => !record._deleted.value);
});

export const myCongSpeakersState = atom((get) => {
  const speakers = get(visitingSpeakersActiveState);

  if (!speakers) return [];

  const congregations = get(speakersCongregationsActiveState);
  const congName = get(congNameState);

  const congId = congregations.find(
    (record) => record.cong_data.cong_name.value === congName
  )?.id;

  const outgoingSpeakers = speakers.filter(
    (record) => record.speaker_data.cong_id === congId
  );

  return outgoingSpeakers;
});

export const outgoingSpeakersState = atom((get) => {
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
});

export const localSpeakersState = atom((get) => {
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
});

export const incomingSpeakersState = atom((get) => {
  const speakers = get(visitingSpeakersActiveState);
  const congregations = get(speakersCongregationsActiveState);
  const congNumber = get(congNumberState);

  const localId = congregations.find(
    (record) => record.cong_data.cong_number.value === congNumber
  )?.id;

  const incomingSpeakers =
    speakers.filter((record) => {
      const isLocal = record.speaker_data.cong_id === localId;

      if (isLocal) return false;

      const speakerCong = congregations.find(
        (c) => c.id === record.speaker_data.cong_id
      );

      if (!speakerCong || speakerCong._deleted.value) return false;

      return true;
    }) || [];

  return incomingSpeakers;
});
