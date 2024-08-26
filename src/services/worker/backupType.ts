import { OutgoingTalkExportScheduleType } from '@definition/schedules';

export type PersonBackupType = {
  _deleted: string;
  person_uid: string;
  person_data: {
    person_firstname: string;
    person_lastname: string;
    person_display_name: string;
    male: string;
    female: string;
    birth_date: string;
    assignments: string;
    timeAway: string;
    archived: string;
    disqualified: string;
    email: string;
    address: string;
    phone: string;
    first_month_report: string;
    publisher_baptized: string;
    publisher_unbaptized: string;
    midweek_meeting_student: string;
    privileges: string;
    enrollments: string;
    emergency_contacts: string;
  };
};

export type BackupDataType = {
  cong_master_key?: string;
  cong_access_code?: string;
  speakers_key?: string;
  cong_settings?: {
    cong_discoverable?: { value: boolean; updatedAt: string };
  };
  cong_persons?: PersonBackupType[];
  speakers_congregations?: SpeakersCongregationBackupType[];
  visiting_speakers?: VisitingSpeakerBackupType[];
  outgoing_speakers?: VisitingSpeakerBackupType[];
  outgoing_talks?: OutgoingTalkExportScheduleType[];
};

export type SpeakersCongregationBackupType = {
  _deleted: string;
  id: string;
  cong_data: {
    cong_id: string;
    cong_number: string;
    cong_name: string;
    cong_circuit: string;
    cong_location: string;
    midweek_meeting: string;
    weekend_meeting: string;
    public_talk_coordinator: string;
    coordinator: string;
    request_status: string;
    request_id: string;
  };
};

export type VisitingSpeakerBackupType = {
  person_uid: string;
  _deleted: string;
  speaker_data: {
    cong_id: string;
    person_firstname: string;
    person_lastname: string;
    person_display_name: string;
    person_notes: string;
    person_email: string;
    person_phone: string;
    elder: string;
    ministerial_servant: string;
    talks: string;
  };
};
