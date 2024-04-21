type SpeakerTalk = {
  _deleted: string | null;
  talk_number: { value: number; updatedAt: string };
  talk_songs: { value: number[]; updatedAt: string };
};

type CongSpeakerType = {
  person_uid: string;
  _deleted: string | null;
  person_firstname: { value: string; updatedAt: string };
  person_lastname: { value: string; updatedAt: string };
  person_displayName: { value: string; updatedAt: string };
  person_notes: { value: string; updatedAt: string };
  talks: SpeakerTalk[];
};

export type VisitingSpeakerType = {
  cong_number: number;
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
  cong_speakers: CongSpeakerType[];
};
