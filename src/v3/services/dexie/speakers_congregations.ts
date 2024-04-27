import appDb from '@db/appDb';

export const dbSpeakersCongregationsCreateLocal = async () => {
  const settings = await appDb.app_settings.get(1);
  const cong_number = settings.cong_settings.cong_number;

  await appDb.speakers_congregations.put({
    _deleted: null,
    cong_location: { value: '', updatedAt: '' },
    cong_coordinator_email: { value: '', updatedAt: '' },
    cong_coordinator_name: { value: '', updatedAt: '' },
    cong_coordinator_phone: { value: '', updatedAt: '' },
    cong_id: '',
    cong_name: { value: '', updatedAt: '' },
    cong_number: cong_number,
    cong_public_talk_coordinator_email: { value: '', updatedAt: '' },
    cong_public_talk_coordinator_name: { value: '', updatedAt: '' },
    cong_public_talk_coordinator_phone: { value: '', updatedAt: '' },
    notification_dismissed: { value: true, updatedAt: '' },
    request_status: { value: 'approved', updatedAt: '' },
    weekend_meeting_day: { value: 7, updatedAt: '' },
    weekend_meeting_time: { value: '', updatedAt: '' },
  });
};
