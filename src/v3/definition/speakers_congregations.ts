export type SpeakersCongregationsType = {
  cong_number: string;
  _deleted: string | null;
  cong_id: string;
  cong_name: { value: string; updatedAt: string };
  cong_address: { value: string; updatedAt: string };
  weekend_meeting_day: { value: number; updatedAt: string };
  weekend_meeting_time: { value: string; updatedAt: string };
  cong_public_talk_coordinator_name: { value: string; updatedAt: string };
  cong_public_talk_coordinator_email: { value: string; updatedAt: string };
  cong_public_talk_coordinator_phone: { value: string; updatedAt: string };
  cong_coordinator_name: { value: string; updatedAt: string };
  cong_coordinator_email: { value: string; updatedAt: string };
  cong_coordinator_phone: { value: string; updatedAt: string };
  request_status: { value: 'pending' | 'disapproved' | 'approved'; updatedAt: string };
  notification_dismissed: { value: boolean; updatedAt: string };
};
