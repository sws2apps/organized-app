type SpeakerTalk = {
  _deleted: string | null;
  updatedAt: string;
  talk_number: number;
  talk_songs: number[];
};

export type VisitingSpeakerType = {
  person_uid: string;
  _deleted: string | null;
  cong_number: string;
  person_firstname: { value: string; updatedAt: string };
  person_lastname: { value: string; updatedAt: string };
  person_display_name: { value: string; updatedAt: string };
  person_notes: { value: string; updatedAt: string };
  talks: SpeakerTalk[];
};
