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

    oldCongregations = [
      {
        cong_name: 'Tsiadana',
        cong_number: -1,
        cong_speakers: [
          {
            person_uid: '251d87f0-2872-4a9d-aa8c-c00efad6c318',
            person_name: 'Markland Kaniel',
            person_displayName: 'M. Kaniel',
            is_elder: true,
            is_ms: false,
            talks: [25, 105],
            is_unavailable: false,
            is_deleted: false,
            email: '',
            phone: '',
            changes: [
              {
                date: '2024-08-25T10:40:32.882Z',
                field: 'talks',
                value: [25, 105],
              },
            ],
          },
        ],
        is_local: true,
        is_deleted: false,
        request_status: 'approved',
        changes: [],
      },
      {
        cong_name: 'Maibahoaka',
        cong_number: 2,
        cong_speakers: [
          {
            person_uid: 'c2215c19-8dbe-4997-93d5-6bb3a0739229',
            person_name: 'Andriantsoa Marco',
            person_displayName: 'Andriantsoa Marco',
            is_elder: true,
            is_ms: false,
            talks: [182],
            is_unavailable: false,
            is_deleted: false,
            email: '',
            phone: '',
            changes: [
              {
                date: '2024-03-26T17:56:50.119Z',
                field: 'person_displayName',
                value: 'Andriantsoa Marco',
              },
              {
                date: '2024-03-26T17:57:12.038Z',
                field: 'talks',
                value: [182],
              },
            ],
          },
        ],
        is_local: true,
        is_deleted: false,
        request_status: 'approved',
        changes: [],
      },
      {
        cong_name: 'Ankadindravola',
        cong_number: 3,
        cong_speakers: [
          {
            person_uid: '6feff238-ef52-4249-8ef4-6bffcad83f28',
            person_name: 'Helly Fabrice',
            person_displayName: 'Helly Fabrice',
            is_elder: true,
            is_ms: false,
            talks: [164],
            is_unavailable: false,
            is_deleted: false,
            email: '',
            phone: '',
            changes: [
              {
                date: '2024-03-26T18:23:09.692Z',
                field: 'talks',
                value: [164],
              },
            ],
          },
        ],
        is_local: true,
        is_deleted: false,
        request_status: 'approved',
        changes: [],
      },
      {
        cong_name: 'Anjomahakely',
        cong_number: 4,
        cong_speakers: [
          {
            person_uid: 'f3a42952-0a88-4231-b112-1369570a6c3f',
            person_name: 'Andriamasy ',
            person_displayName: 'Titosy ',
            talks: [],
            is_deleted: false,
            is_unavailable: false,
            is_elder: true,
            is_ms: false,
            email: '',
            phone: '',
            changes: [],
          },
        ],
        is_local: true,
        is_deleted: false,
        request_status: 'approved',
        changes: [],
      },
      {
        cong_name: 'ivandry',
        cong_number: 5,
        cong_speakers: [
          {
            person_uid: '30c14bfc-f29c-4983-a78e-d254a0f5b460',
            person_name: 'Pierre Petignat',
            person_displayName: 'P. Petignat',
            is_elder: true,
            is_ms: false,
            talks: [93],
            is_unavailable: false,
            is_deleted: false,
            email: '',
            phone: '',
            changes: [
              {
                date: '2024-03-26T17:55:20.970Z',
                field: 'talks',
                value: [93],
              },
            ],
          },
        ],
        is_local: true,
        is_deleted: false,
        request_status: 'approved',
        changes: [],
      },
      {
        cong_name: 'Nigeria',
        cong_number: 6,
        cong_speakers: [
          {
            person_uid: 'a19542c5-f051-43c2-b5e2-285bba030ffb',
            person_name: 'Ohwofosa Mudiaga',
            person_displayName: 'O. Mudiaga',
            is_elder: true,
            is_ms: false,
            talks: [41],
            is_unavailable: false,
            is_deleted: false,
            email: '',
            phone: '',
            changes: [
              {
                date: '2024-07-12T20:59:51.815Z',
                field: 'talks',
                value: [41],
              },
            ],
          },
        ],
        is_local: true,
        is_deleted: false,
        request_status: 'approved',
        changes: [],
      },
      {
        cong_name: 'Tana 1',
        cong_number: 7,
        cong_speakers: [
          {
            person_uid: 'b0a9bac8-9e02-4622-b55a-eab734823ee5',
            person_name: 'Moss Jordan',
            person_displayName: 'M. Jordan',
            is_elder: true,
            is_ms: false,
            talks: [189],
            is_unavailable: false,
            is_deleted: false,
            email: '',
            phone: '',
            changes: [
              {
                date: '2024-07-12T21:02:14.311Z',
                field: 'talks',
                value: [189],
              },
            ],
          },
        ],
        is_local: true,
        is_deleted: false,
        request_status: 'approved',
        changes: [],
      },
      {
        cong_name: 'antsirabe',
        cong_number: 8,
        cong_speakers: [
          {
            person_uid: 'ebc59029-9a8e-461e-8ba1-626ed376f3cb',
            person_name: 'Rafanambinana Adelphe',
            person_displayName: 'R. Adelphe',
            is_elder: true,
            is_ms: false,
            talks: [18],
            is_unavailable: false,
            is_deleted: false,
            email: '',
            phone: '',
            changes: [
              {
                date: '2024-07-12T21:09:56.681Z',
                field: 'talks',
                value: [18],
              },
            ],
          },
        ],
        is_local: true,
        is_deleted: false,
        request_status: 'approved',
        changes: [],
      },
      {
        cong_name: 'Tanambao Avartra',
        cong_number: 9,
        cong_speakers: [
          {
            person_uid: '58c3ad0d-ffb2-430e-be8e-cc75f0d3aa04',
            person_name: 'Acosta Elison',
            person_displayName: 'A. Elison',
            is_elder: true,
            is_ms: false,
            talks: [143],
            is_unavailable: false,
            is_deleted: false,
            email: '',
            phone: '',
            changes: [
              {
                date: '2024-07-12T21:15:23.249Z',
                field: 'talks',
                value: [143],
              },
            ],
          },
        ],
        is_local: true,
        is_deleted: false,
        request_status: 'approved',
        changes: [],
      },
      {
        cong_name: 'ZAF',
        cong_number: 10,
        cong_speakers: [
          {
            person_uid: '2cbc0397-1838-4faf-8690-c42467589d9b',
            person_name: 'Naude Hein',
            person_displayName: 'N. Hein',
            is_elder: true,
            is_ms: false,
            talks: [70],
            is_unavailable: false,
            is_deleted: false,
            email: '',
            phone: '',
            changes: [
              {
                date: '2024-07-12T21:24:34.986Z',
                field: 'talks',
                value: [70],
              },
            ],
          },
        ],
        is_local: true,
        is_deleted: false,
        request_status: 'approved',
        changes: [],
      },
      {
        cong_name: 'South AF',
        cong_number: 12,
        cong_speakers: [
          {
            person_uid: 'f4f12113-d315-4e0b-bb16-63182122c187',
            person_name: 'Bent Symon',
            person_displayName: 'B. Symon',
            is_elder: true,
            is_ms: false,
            talks: [15],
            is_unavailable: false,
            is_deleted: false,
            email: '',
            phone: '',
            changes: [
              {
                date: '2024-08-22T19:07:52.340Z',
                field: 'talks',
                value: [15],
              },
            ],
          },
        ],
        is_local: true,
        is_deleted: false,
        request_status: 'approved',
        changes: [],
      },
      {
        cong_name: 'ZAF B',
        cong_number: 13,
        cong_speakers: [
          {
            person_uid: '9a6e7aa1-b89b-4bde-8168-c25fe6d23cd8',
            person_name: 'N Hein',
            person_displayName: 'N. Hein',
            is_elder: true,
            is_ms: false,
            talks: [182],
            is_unavailable: false,
            is_deleted: false,
            email: '',
            phone: '',
            changes: [
              {
                date: '2024-08-25T10:20:48.766Z',
                field: 'talks',
                value: [182],
              },
            ],
          },
        ],
        is_local: true,
        is_deleted: false,
        request_status: 'approved',
        changes: [],
      },
      {
        cong_name: 'ZAF 3',
        cong_number: 14,
        cong_speakers: [
          {
            person_uid: 'c54c8641-1310-4d7f-9273-281d1d0f5e13',
            person_name: 'Irlan Brent',
            person_displayName: 'I. Brent',
            is_elder: true,
            is_ms: false,
            talks: [47],
            is_unavailable: false,
            is_deleted: false,
            email: '',
            phone: '',
            changes: [
              {
                date: '2024-09-07T07:52:24.970Z',
                field: 'talks',
                value: [47],
              },
            ],
          },
        ],
        is_local: true,
        is_deleted: false,
        request_status: 'approved',
        changes: [],
      },
    ];

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
