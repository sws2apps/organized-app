import { promiseGetRecoil } from 'recoil-outside';
import { visitingSpeakersCongregationsState, visitingSpeakersListState } from '@states/visitingSpeakers';

export const getVisitingSpeakerByUID = async (speaker_uid: string) => {
  const visitingSpeakers = await promiseGetRecoil(visitingSpeakersListState);
  return visitingSpeakers.find((speaker) => speaker.person_uid === speaker_uid);
};

export const getCongregation = async (cong_number) => {
  const congregations = await promiseGetRecoil(visitingSpeakersCongregationsState);
  return congregations.find((record) => record.cong_number === +cong_number);
};

export const getCongregationByID = async (id) => {
  const congregations = await promiseGetRecoil(visitingSpeakersCongregationsState);
  return congregations.find((record) => record.cong_id === id);
};

export const getVisitingSpeakersCongregations = async () => {
  const congregations = await promiseGetRecoil(visitingSpeakersCongregationsState);
  const result = [];

  for (const cong of congregations) {
    if (!cong.is_local && cong.request_status === 'approved') {
      result.push(cong.cong_id);
    }
  }

  return result;
};

export const getSpeaker = async (cong_number, speaker_uid) => {
  const congregation = await getCongregation(cong_number);
  return congregation.cong_speakers.find((record) => record.person_uid === speaker_uid);
};

export const getSpeakers = async (cong_number) => {
  const cong = await getCongregation(cong_number);

  let result = [];

  if (cong) {
    result = cong.cong_speakers
      .filter((record) => !record.is_deleted)
      .sort((a, b) => {
        return a.person_name > b.person_name ? 1 : -1;
      });
  }

  return result;
};
