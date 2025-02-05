import { UpdateSpec } from 'dexie';
import { SpeakersCongregationsType } from '@definition/speakers_congregations';
import { speakersCongregationSchema } from './schema';
import appDb from '@db/appDb';

const dbUpdateSpeakersCongregationsMetadata = async () => {
  const metadata = await appDb.metadata.get(1);

  if (!metadata) return;

  metadata.metadata.speakers_congregations = {
    ...metadata.metadata.speakers_congregations,
    send_local: true,
  };

  await appDb.metadata.put(metadata);
};

export const dbSpeakersCongregationsCreateLocal = async () => {
  const settings = await appDb.app_settings.get(1);
  const cong_number = settings.cong_settings.cong_number;

  await appDb.speakers_congregations.add({
    _deleted: { value: false, updatedAt: '' },
    id: crypto.randomUUID(),
    cong_data: {
      cong_number: { value: cong_number, updatedAt: new Date().toISOString() },
      cong_id: '',
      cong_circuit: { value: '', updatedAt: '' },
      cong_name: { value: '', updatedAt: '' },
      cong_location: {
        address: { value: '', updatedAt: '' },
        lat: null,
        lng: null,
      },
      midweek_meeting: {
        time: { value: '', updatedAt: '' },
        weekday: { value: null, updatedAt: '' },
      },
      weekend_meeting: {
        time: { value: '', updatedAt: '' },
        weekday: { value: null, updatedAt: '' },
      },
      coordinator: {
        email: { value: '', updatedAt: '' },
        name: { value: '', updatedAt: '' },
        phone: { value: '', updatedAt: '' },
      },
      public_talk_coordinator: {
        email: { value: '', updatedAt: '' },
        name: { value: '', updatedAt: '' },
        phone: { value: '', updatedAt: '' },
      },
      request_id: '',
      request_status: 'approved',
    },
  });

  await dbUpdateSpeakersCongregationsMetadata();
};

export const dbSpeakersCongregationsCreate = async (
  data: SpeakersCongregationsType
) => {
  await appDb.speakers_congregations.add(data);
  await dbUpdateSpeakersCongregationsMetadata();
};

export const dbSpeakersCongregationsUpdate = async (
  changes: UpdateSpec<SpeakersCongregationsType>,
  id: string
) => {
  await appDb.speakers_congregations.update(id, changes);
  await dbUpdateSpeakersCongregationsMetadata();
};

export const dbSpeakersCongregationsDummy = async () => {
  const cong0 = structuredClone(speakersCongregationSchema);
  cong0.id = crypto.randomUUID();
  cong0._deleted.updatedAt = new Date().toISOString();
  cong0.cong_data.cong_number = { value: '11163', updatedAt: '' };
  cong0.cong_data.request_status = 'approved';

  const cong1 = structuredClone(speakersCongregationSchema);
  cong1.id = crypto.randomUUID();
  cong1._deleted.updatedAt = new Date().toISOString();
  cong1.cong_data.cong_circuit = {
    value: 'WA- 5',
    updatedAt: new Date().toISOString(),
  };
  cong1.cong_data.cong_location = {
    address: {
      value: '5933 39th Ave S Seattle WA  98118-2616',
      updatedAt: new Date().toISOString(),
    },
    lat: 47.54865,
    lng: -122.28381,
  };
  cong1.cong_data.cong_name = {
    value: 'Yesler - Seattle WA',
    updatedAt: new Date().toISOString(),
  };
  cong1.cong_data.cong_number = {
    value: '11338',
    updatedAt: new Date().toISOString(),
  };
  cong1.cong_data.coordinator = {
    name: { value: 'Coordinator 1', updatedAt: new Date().toISOString() },
    email: {
      value: 'coordinator1@fakemail.com',
      updatedAt: new Date().toISOString(),
    },
    phone: { value: '+81 965-431-3024', updatedAt: new Date().toISOString() },
  };
  cong1.cong_data.public_talk_coordinator = {
    name: {
      value: 'Public Talk Coordinator 1',
      updatedAt: new Date().toISOString(),
    },
    email: {
      value: 'public-talk-coordinator1@fakemail.com',
      updatedAt: new Date().toISOString(),
    },
    phone: { value: '+49 258-627-6644', updatedAt: new Date().toISOString() },
  };
  cong1.cong_data.request_status = 'approved';

  const cong2 = structuredClone(speakersCongregationSchema);
  cong2.id = crypto.randomUUID();
  cong2._deleted.updatedAt = new Date().toISOString();
  cong2.cong_data.cong_circuit = {
    value: 'WA- 8-B',
    updatedAt: new Date().toISOString(),
  };
  cong2.cong_data.cong_location = {
    address: {
      value: '13006 NE 100th St Kirkland WA  98033-5255',
      updatedAt: new Date().toISOString(),
    },
    lat: 47.690079,
    lng: -122.167178,
  };
  cong2.cong_data.cong_name = {
    value: 'Lake Hills - Bellevue WA',
    updatedAt: new Date().toISOString(),
  };
  cong2.cong_data.cong_number = {
    value: '10066',
    updatedAt: new Date().toISOString(),
  };
  cong2.cong_data.coordinator = {
    name: { value: 'Coordinator 2', updatedAt: new Date().toISOString() },
    email: {
      value: 'coordinator2@fakemail.com',
      updatedAt: new Date().toISOString(),
    },
    phone: { value: '+91 936-400-4116', updatedAt: new Date().toISOString() },
  };
  cong2.cong_data.public_talk_coordinator = {
    name: {
      value: 'Public Talk Coordinator 2',
      updatedAt: new Date().toISOString(),
    },
    email: {
      value: 'public-talk-coordinator2@fakemail.com',
      updatedAt: new Date().toISOString(),
    },
    phone: { value: '+1 976-686-7996', updatedAt: new Date().toISOString() },
  };
  cong2.cong_data.request_status = 'approved';

  await appDb.speakers_congregations.bulkAdd([cong0, cong1, cong2]);
};

export const dbSpeakersCongregationsClear = async () => {
  const records = await appDb.speakers_congregations.toArray();

  if (records.length === 0) return;

  for (const record of records) {
    record._deleted = { value: true, updatedAt: new Date().toISOString() };
  }

  await appDb.speakers_congregations.bulkPut(records);
};
