import { getCongregation, getCongregationByID, getSpeaker } from '@services/app/visitingSpeakers';
import { appDb } from '.';
import { promiseGetRecoil } from 'recoil-outside';
import { congNameState, congNumberState } from '@states/settings';
import { visitingSpeakerSchema } from './schema';
import { getPerson } from '@services/app/persons';

export const acknowledgeRequestApproval = async (cong_number) => {
  cong_number = +cong_number;

  await appDb.visiting_speakers.update(cong_number, {
    notif_dismissed: true,
    request_status: 'approved',
  });
};

export const updateSpeakersRequestsStatus = async (congregations) => {
  for await (const cong of congregations) {
    const cong_number = +cong.cong_number;

    type Request = {
      request_status: string;
      cong_speakers: [];
    };

    const obj = <Request>{ request_status: cong.request_status };

    if (cong.request_status === 'disapproved') {
      obj.cong_speakers = [];
    }

    await appDb.visiting_speakers.update(cong_number, obj);
  }
};

export const createLocalCongregation = async () => {
  const congName = await promiseGetRecoil(congNameState);
  const congNumber = await promiseGetRecoil(congNumberState);

  const data = {
    cong_name: congName,
    cong_number: +congNumber,
    cong_speakers: [],
    is_local: true,
    is_deleted: false,
    request_status: 'approved',
    changes: [],
  };

  await appDb.visiting_speakers.put(data);

  return data;
};

export const addVisitingSpeaker = async ({
  person_uid,
  person_name,
  person_displayName,
  is_elder,
  is_ms,
  is_self,
  cong_number,
  email,
  phone,
}: {
  person_uid: string;
  person_name: string;
  person_displayName: string;
  is_elder: boolean;
  is_ms: boolean;
  is_self?: boolean;
  cong_number: number;
  email: string;
  phone: string;
}) => {
  let startCong;

  const congNumber = await promiseGetRecoil(congNumberState);
  const congName = await promiseGetRecoil(congNameState);

  if (is_self) {
    // check if local congregation exists
    startCong = await getCongregation(congNumber);

    if (!startCong) {
      startCong = await createLocalCongregation();
    }
  }

  if (!is_self) {
    startCong = await getCongregation(cong_number);
  }

  const cong = structuredClone(startCong);

  // create new speaker record
  const speaker = structuredClone(visitingSpeakerSchema);

  if (is_self) {
    const person = await getPerson(person_uid);
    speaker.person_name = person.person_name;
    speaker.person_displayName = person.person_displayName;
    speaker.cong_name = congName;
    speaker.cong_number = +congNumber;
    speaker.is_elder = false;
    speaker.is_ms = false;
    speaker.email = '';
    speaker.phone = '';
  } else {
    speaker.person_name = person_name;
    speaker.person_displayName = person_displayName;
    speaker.cong_name = cong.cong_name;
    speaker.cong_number = cong_number;
    speaker.is_elder = is_elder;
    speaker.is_ms = is_ms;
    speaker.email = email;
    speaker.phone = phone;
  }

  speaker.is_local = cong.cong_id ? false : true;
  speaker.cong_id = cong.cong_id || '';
  speaker.person_uid = person_uid;

  // remove sibling record
  cong.cong_speakers = cong.cong_speakers.filter((speaker) => speaker.person_uid !== person_uid);

  // add record to db
  const newSpeakers = cong.cong_speakers.concat({
    person_uid: speaker.person_uid,
    person_name: speaker.person_name,
    person_displayName: speaker.person_displayName,
    talks: [],
    is_deleted: false,
    is_unavailable: false,
    is_elder: speaker.is_elder,
    is_ms: speaker.is_ms,
    email: speaker.email,
    phone: speaker.phone,
    changes: [],
  });

  await appDb.visiting_speakers.update(cong.cong_number, {
    cong_speakers: newSpeakers,
  });
};

export const updateIncomingSpeaker = async ({
  person_uid,
  person_name,
  person_displayName,
  is_elder,
  is_ms,
  talks,
  cong_number,
  email,
  phone,
}) => {
  const cong = await getCongregation(cong_number);
  const speaker = await getSpeaker(cong_number, person_uid);
  speaker.person_name = person_name;
  speaker.person_displayName = person_displayName;
  speaker.talks = talks;
  speaker.is_elder = is_elder;
  speaker.is_ms = is_ms;
  speaker.email = email;
  speaker.phone = phone;
  speaker.changes = [];

  // clean record before saving to db
  const newSpeakers = cong.cong_speakers.map((speaker) => {
    const tmp = structuredClone(speaker);

    delete tmp.cong_name;
    delete tmp.cong_number;
    delete tmp.cong_id;
    delete tmp.is_local;

    return tmp;
  });

  await appDb.visiting_speakers.update(cong_number, {
    cong_speakers: newSpeakers,
  });
};

export const updateIncomingSpeakers = async (data) => {
  for await (const cong of data) {
    const currentCong = await getCongregationByID(cong.cong_id);

    for await (const speaker of cong.speakers) {
      const speakerExist = await getSpeaker(currentCong.cong_number, speaker.speaker_uid);

      if (!speakerExist) {
        await addVisitingSpeaker({
          person_uid: speaker.speaker_uid,
          person_name: speaker.speaker_name,
          person_displayName: speaker.speaker_displayName,
          is_elder: speaker.speaker_isElder,
          is_ms: speaker.speaker_isMS,
          email: speaker.speaker_email,
          phone: speaker.speaker_phone,
          cong_number: currentCong.cong_number,
        });
      }

      if (speakerExist) {
        await updateIncomingSpeaker({
          person_uid: speaker.speaker_uid,
          person_name: speaker.speaker_name,
          person_displayName: speaker.speaker_displayName,
          is_elder: speaker.speaker_isElder,
          is_ms: speaker.speaker_isMS,
          email: speaker.speaker_email,
          phone: speaker.speaker_phone,
          talks: speaker.speaker_talks,
          cong_number: currentCong.cong_number,
        });
      }
    }
  }
};

export const deleteCongregation = async (cong_number) => {
  cong_number = +cong_number;

  await appDb.visiting_speakers.update(cong_number, {
    cong_speakers: [],
    changes: [],
    request_status: '',
    notif_dismissed: false,
    is_deleted: true,
  });
};

export const updateSpeakerTalks = async ({ talks, person_uid, cong_number }) => {
  talks = talks.map((talk) => {
    return talk.talk_number;
  });

  const selfCongNumber = await promiseGetRecoil(congNumberState);
  const oldCong = await getCongregation(cong_number);
  const currentCong = structuredClone(oldCong);

  const speaker = currentCong.cong_speakers.find((record) => record.person_uid === person_uid);
  speaker.changes = speaker.changes.filter((record) => record.field !== 'talks');
  speaker.changes.push({ date: new Date().toISOString(), field: 'talks', value: talks });
  speaker.talks = talks;

  const isSelf = currentCong.cong_number === +selfCongNumber;

  const newSpeakers = currentCong.cong_speakers.map((speaker) => {
    const tmp = structuredClone(speaker);

    delete tmp.cong_name;
    delete tmp.cong_number;
    delete tmp.cong_id;
    delete tmp.is_local;

    if (isSelf) {
      tmp.person_displayName = '';
      tmp.person_name = '';
      tmp.is_elder = false;
      tmp.is_ms = false;
      tmp.email = '';
      tmp.phone = '';
    }

    return tmp;
  });

  await appDb.visiting_speakers.update(cong_number, {
    cong_speakers: newSpeakers,
  });
};

export const deleteVisitingSpeaker = async ({ person_uid, cong_number }) => {
  const selfCongNumber = await promiseGetRecoil(congNumberState);
  const oldCong = await getCongregation(cong_number);

  const currentCong = structuredClone(oldCong);

  const speaker = currentCong.cong_speakers.find((record) => record.person_uid === person_uid);
  speaker.is_deleted = true;

  const isSelf = currentCong.cong_number === +selfCongNumber;

  delete speaker.cong_name;
  delete speaker.cong_number;
  delete speaker.cong_id;
  delete speaker.is_local;

  if (isSelf) {
    speaker.person_displayName = '';
    speaker.person_name = '';
    speaker.is_elder = false;
    speaker.is_ms = false;
    speaker.email = '';
    speaker.phone = '';
  }

  currentCong.cong_speakers = currentCong.cong_speakers.filter((speaker) => speaker.person_uid !== person_uid);
  currentCong.cong_speakers.push(speaker);

  await appDb.visiting_speakers.update(cong_number, {
    cong_speakers: currentCong.cong_speakers,
  });
};

export const createCongregation = async ({ cong_id, cong_name, cong_number }) => {
  cong_number = +cong_number;

  const data = <
    {
      cong_name: string;
      cong_number: number;
      cong_speakers: [];
      is_local: boolean;
      is_deleted: boolean;
      request_status: string;
      changes: [];
      cong_id?: string;
    }
  >{
    cong_name: cong_name,
    cong_number: cong_number,
    cong_speakers: [],
    is_local: cong_id ? false : true,
    is_deleted: false,
    request_status: cong_id ? 'pending' : 'approved',
    changes: [],
  };

  if (cong_id) {
    data.cong_id = cong_id;
  }

  const appData = await appDb.visiting_speakers.toArray();
  const isDeleted = appData.find((record) => record.cong_number === cong_number);

  if (!isDeleted) {
    await appDb.visiting_speakers.put(data);
  }

  if (isDeleted) {
    await appDb.visiting_speakers.update(cong_number, {
      is_deleted: false,
    });
  }
};

export const updateSpeakerDetails = async ({ fieldName, fieldValue, person_uid, cong_number }) => {
  const congNumber = await promiseGetRecoil(congNumberState);

  const oldCong = await getCongregation(cong_number);
  const currentCong = structuredClone(oldCong);

  const speaker = currentCong.cong_speakers.find((record) => record.person_uid === person_uid);
  speaker.changes = speaker.changes.filter((record) => record.field !== fieldName);
  speaker.changes.push({ date: new Date().toISOString(), field: fieldName, value: fieldValue });
  speaker[fieldName] = fieldValue;

  const isSelf = currentCong.cong_number === +congNumber;

  delete speaker.cong_name;
  delete speaker.cong_number;
  delete speaker.cong_id;
  delete speaker.is_local;

  if (isSelf) {
    speaker.person_displayName = '';
    speaker.person_name = '';
    speaker.is_elder = false;
    speaker.is_ms = false;
    speaker.email = '';
    speaker.phone = '';
  }

  currentCong.cong_speakers = currentCong.cong_speakers.filter((speaker) => speaker.person_uid !== person_uid);
  currentCong.cong_speakers.push(speaker);

  await appDb.visiting_speakers.update(cong_number, {
    cong_speakers: currentCong.cong_speakers,
  });
};
