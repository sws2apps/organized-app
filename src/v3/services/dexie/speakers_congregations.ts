import appDb from '@db/appDb';
import { SpeakersCongregationsType } from '@definition/speakers_congregations';

export const dbSpeakersCongregationsCreateLocal = async () => {
  const settings = await appDb.app_settings.get(1);
  const cong_number = settings.cong_settings.cong_number;

  await appDb.speakers_congregations.put({
    _deleted: null,
    cong_number: cong_number,
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
    notification_dismissed: { value: true, updatedAt: '' },
    request_status: 'approved',
  });
};

export const dbSpeakersCongregationsPut = async (data: SpeakersCongregationsType) => {
  await appDb.speakers_congregations.put(data);
};
