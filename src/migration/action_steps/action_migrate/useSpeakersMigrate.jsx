import {
  speakersCongregationSchema,
  vistingSpeakerSchema,
} from '../../../services/dexie/schema';

import appDb from '../../db';

const useSpeakersMigrate = () => {
  const handleMigrateSpeakers = async () => {
    let oldCongregations = await appDb.visiting_speakers.toArray();

    oldCongregations = oldCongregations.filter(
      (record) => !record.is_deleted && record.is_local
    );

    const congregations = [];
    const speakers = [];

    for (const congregation of oldCongregations) {
      const objCong = structuredClone(speakersCongregationSchema);

      objCong.id = crypto.randomUUID();

      objCong.cong_data.cong_number = {
        value: congregation.cong_number,
        updatedAt: new Date().toISOString(),
      };

      objCong.cong_data.cong_name = {
        value: congregation.cong_name,
        updatedAt: new Date().toISOString(),
      };

      objCong.cong_data.request_status = 'approved';

      congregations.push(objCong);

      for (const speaker of congregation.cong_speakers) {
        const objSpeaker = structuredClone(vistingSpeakerSchema);

        const names = speaker.person_name.split(' ');
        const lastname = names.shift();
        const firstname = names.join(' ');

        objSpeaker.person_uid = speaker.person_uid;
        objSpeaker.speaker_data.cong_id = objCong.id;
        objSpeaker.speaker_data.person_firstname = {
          value: firstname,
          updatedAt: new Date().toISOString(),
        };
        objSpeaker.speaker_data.person_lastname = {
          value: lastname,
          updatedAt: new Date().toISOString(),
        };
        objSpeaker.speaker_data.person_display_name = {
          value: speaker.person_displayName,
          updatedAt: new Date().toISOString(),
        };
        objSpeaker.speaker_data.person_email = {
          value: speaker.email,
          updatedAt: new Date().toISOString(),
        };
        objSpeaker.speaker_data.person_phone = {
          value: speaker.phone,
          updatedAt: new Date().toISOString(),
        };
        objSpeaker.speaker_data.elder = {
          value: speaker.is_elder,
          updatedAt: new Date().toISOString(),
        };
        objSpeaker.speaker_data.ministerial_servant = {
          value: speaker.is_ms,
          updatedAt: new Date().toISOString(),
        };
        objSpeaker.speaker_data.talks = speaker.talks.map((talk) => {
          return {
            _deleted: false,
            updatedAt: new Date().toISOString(),
            talk_number: talk,
            talk_songs: [],
          };
        });

        speakers.push(objSpeaker);
      }
    }

    return { congregations, speakers };
  };

  return { handleMigrateSpeakers };
};

export default useSpeakersMigrate;
