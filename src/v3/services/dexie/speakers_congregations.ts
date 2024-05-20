import { UpdateSpec } from 'dexie';
import { SpeakersCongregationsType } from '@definition/speakers_congregations';
import appDb from '@db/appDb';

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
      cong_location: { address: { value: '', updatedAt: '' }, lat: null, lng: null },
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
};

export const dbSpeakersCongregationsCreate = async (data: SpeakersCongregationsType) => {
  await appDb.speakers_congregations.add(data);
};

export const dbSpeakersCongregationsUpdate = async (changes: UpdateSpec<SpeakersCongregationsType>, id: string) => {
  await appDb.speakers_congregations.update(id, changes);
};
