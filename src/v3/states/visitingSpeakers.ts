/*
This file holds the source of the truth from the table "visiting_speakers".
*/

import { atom, selector } from 'recoil';
import { congNumberState } from './settings';
import { getPerson, personIsElder, personIsMS } from '@services/app/persons';

export const visitingSpeakersState = atom({
  key: 'visitingSpeakers',
  default: [],
});

export const visitingSpeakersActiveState = selector({
  key: 'visitingSpeakersActive',
  get: ({ get }) => {
    const visitingSpeakers = get(visitingSpeakersState);

    return visitingSpeakers.filter((record) => !record.is_deleted);
  },
});

export const visitingSpeakersListState = selector({
  key: 'visitingSpeakersList',
  get: async ({ get }) => {
    const visitingSpeakers = get(visitingSpeakersActiveState);
    const congNumber = get(congNumberState);

    const list = [];

    for await (const cong of visitingSpeakers) {
      const tmpSpeakers = structuredClone(cong.cong_speakers);
      const isSelf = cong.cong_number === +congNumber;

      for await (const speaker of tmpSpeakers) {
        if (isSelf) {
          const person = await getPerson(speaker.person_uid);

          speaker.person_name = person.person_name;
          speaker.person_displayName = person.person_displayName;
          speaker.email = person.email;
          speaker.phone = person.phone;

          speaker.is_elder = await personIsElder(speaker.person_uid);
          speaker.is_ms = await personIsMS(speaker.person_uid);
        }

        speaker.is_local = cong.is_local;
        speaker.cong_number = cong.cong_number;
        speaker.cong_id = cong.cong_id;
        speaker.cong_name = cong.cong_name || '';

        list.push(speaker);
      }
    }

    return list;
  },
});

export const visitingSpeakersCongregationsState = selector({
  key: 'visitingSpeakersCongregations',
  get: async ({ get }) => {
    const visitingSpeakers = get(visitingSpeakersActiveState);
    const congNumber = get(congNumberState);

    const list = [];

    for await (const oldCong of visitingSpeakers) {
      const cong = structuredClone(oldCong);
      const isSelf = cong.cong_number === +congNumber;

      cong.cong_speakers.length = 0;

      for await (const oldSpeaker of oldCong.cong_speakers) {
        const speaker = structuredClone(oldSpeaker);
        if (isSelf) {
          const person = await getPerson(speaker.person_uid);

          speaker.person_name = person.person_name;
          speaker.person_displayName = person.person_displayName;
          speaker.email = person.email;
          speaker.phone = person.phone;

          speaker.is_elder = await personIsElder(speaker.person_uid);
          speaker.is_ms = await personIsMS(speaker.person_uid);
        }

        speaker.is_local = cong.is_local;
        speaker.cong_number = cong.cong_number;
        speaker.cong_id = cong.cong_id;
        speaker.cong_name = cong.cong_name || '';

        cong.cong_speakers.push(speaker);
      }

      list.push(cong);
    }

    return list;
  },
});

export const congSpeakersRequestsStatusState = atom({
  key: 'congSpeakersRequestsStatus',
  default: [],
});
