import { BranchCongAnalysisType } from '@definition/branch_cong_analysis';
import { BranchFieldServiceReportType } from '@definition/branch_field_service_reports';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import { DelegatedFieldServiceReportType } from '@definition/delegated_field_service_reports';
import { FieldServiceGroupType } from '@definition/field_service_groups';
import { MeetingAttendanceType } from '@definition/meeting_attendance';
import { PersonType } from '@definition/person';
import { SchedWeekType } from '@definition/schedules';
import {
  FieldServiceGroupPublishersSortOption,
  FullnameOption,
  SettingsType,
  SourceFrequency,
} from '@definition/settings';
import { SourceWeekType } from '@definition/sources';
import { SpeakersCongregationsType } from '@definition/speakers_congregations';
import { UserBibleStudyType } from '@definition/user_bible_studies';
import {
  UserFieldServiceDailyReportType,
  UserFieldServiceMonthlyReportType,
} from '@definition/user_field_service_reports';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { Week } from '@definition/week_type';

export const sourceSchema: SourceWeekType = {
  weekOf: '',
  midweek_meeting: {
    event_name: { value: '', updatedAt: '' },
    week_date_locale: {},
    weekly_bible_reading: {},
    song_first: {},
    tgw_talk: {
      src: {},
      time: { default: 10, override: [] },
    },
    tgw_gems: {
      title: {},
      time: { default: 10, override: [] },
    },
    tgw_bible_reading: { src: {}, title: {} },
    ayf_count: {},
    ayf_part1: { src: {}, time: {}, title: {}, type: {} },
    ayf_part2: { src: {}, time: {}, title: {}, type: {} },
    ayf_part3: { src: {}, time: {}, title: {}, type: {} },
    ayf_part4: { src: {}, time: {}, title: {}, type: {} },
    song_middle: {},
    lc_count: { default: {}, override: [] },
    lc_part1: {
      desc: { default: {}, override: [] },
      time: { default: {}, override: [] },
      title: { default: {}, override: [] },
    },
    lc_part2: {
      desc: { default: {}, override: [] },
      time: { default: {}, override: [] },
      title: { default: {}, override: [] },
    },
    lc_part3: {
      desc: [],
      time: [],
      title: [],
    },
    lc_cbs: {
      src: {},
      time: { default: 30, override: [] },
      title: { default: {}, override: [] },
    },
    co_talk_title: { src: '', updatedAt: '' },
    song_conclude: { default: {}, override: [] },
  },
  weekend_meeting: {
    event_name: { value: '', updatedAt: '' },
    song_first: [{ type: 'main', value: '', updatedAt: '' }],
    public_talk: [{ type: 'main', value: '', updatedAt: '' }],
    co_talk_title: {
      public: { src: '', updatedAt: '' },
      service: { src: '', updatedAt: '' },
    },
    song_middle: {},
    w_study: {},
    song_conclude: {
      default: {},
      override: [{ type: 'main', value: '', updatedAt: '' }],
    },
  },
};

export const scheduleSchema: SchedWeekType = {
  weekOf: '',
  midweek_meeting: {
    chairman: {
      main_hall: [{ type: 'main', value: '', name: '', updatedAt: '' }],
      aux_class_1: { type: 'main', value: '', name: '', updatedAt: '' },
    },
    opening_prayer: [{ type: 'main', value: '', name: '', updatedAt: '' }],
    tgw_talk: [{ type: 'main', value: '', name: '', updatedAt: '' }],
    tgw_gems: [{ type: 'main', value: '', name: '', updatedAt: '' }],
    tgw_bible_reading: {
      main_hall: [{ type: 'main', value: '', name: '', updatedAt: '' }],
      aux_class_1: { type: 'main', value: '', name: '', updatedAt: '' },
      aux_class_2: { type: 'main', value: '', name: '', updatedAt: '' },
    },
    ayf_part1: {
      main_hall: {
        student: [{ type: 'main', value: '', name: '', updatedAt: '' }],
        assistant: [{ type: 'main', value: '', name: '', updatedAt: '' }],
      },
      aux_class_1: {
        student: { type: 'main', value: '', name: '', updatedAt: '' },
        assistant: { type: 'main', value: '', name: '', updatedAt: '' },
      },
      aux_class_2: {
        student: { type: 'main', value: '', name: '', updatedAt: '' },
        assistant: { type: 'main', value: '', name: '', updatedAt: '' },
      },
    },
    ayf_part2: {
      main_hall: {
        student: [{ type: 'main', value: '', name: '', updatedAt: '' }],
        assistant: [{ type: 'main', value: '', name: '', updatedAt: '' }],
      },
      aux_class_1: {
        student: { type: 'main', value: '', name: '', updatedAt: '' },
        assistant: { type: 'main', value: '', name: '', updatedAt: '' },
      },
      aux_class_2: {
        student: { type: 'main', value: '', name: '', updatedAt: '' },
        assistant: { type: 'main', value: '', name: '', updatedAt: '' },
      },
    },
    ayf_part3: {
      main_hall: {
        student: [{ type: 'main', value: '', name: '', updatedAt: '' }],
        assistant: [{ type: 'main', value: '', name: '', updatedAt: '' }],
      },
      aux_class_1: {
        student: { type: 'main', value: '', name: '', updatedAt: '' },
        assistant: { type: 'main', value: '', name: '', updatedAt: '' },
      },
      aux_class_2: {
        student: { type: 'main', value: '', name: '', updatedAt: '' },
        assistant: { type: 'main', value: '', name: '', updatedAt: '' },
      },
    },
    ayf_part4: {
      main_hall: {
        student: [{ type: 'main', value: '', name: '', updatedAt: '' }],
        assistant: [{ type: 'main', value: '', name: '', updatedAt: '' }],
      },
      aux_class_1: {
        student: { type: 'main', value: '', name: '', updatedAt: '' },
        assistant: { type: 'main', value: '', name: '', updatedAt: '' },
      },
      aux_class_2: {
        student: { type: 'main', value: '', name: '', updatedAt: '' },
        assistant: { type: 'main', value: '', name: '', updatedAt: '' },
      },
    },
    lc_part1: [{ type: 'main', value: '', name: '', updatedAt: '' }],
    lc_part2: [{ type: 'main', value: '', name: '', updatedAt: '' }],
    lc_part3: [{ type: 'main', value: '', name: '', updatedAt: '' }],
    lc_cbs: {
      conductor: [{ type: 'main', value: '', name: '', updatedAt: '' }],
      reader: [{ type: 'main', value: '', name: '', updatedAt: '' }],
    },
    closing_prayer: [{ type: 'main', value: '', name: '', updatedAt: '' }],
    circuit_overseer: { type: 'main', value: '', name: '', updatedAt: '' },
    week_type: [{ type: 'main', value: Week.NORMAL, updatedAt: '' }],
  },
  weekend_meeting: {
    chairman: [{ type: 'main', value: '', name: '', updatedAt: '' }],
    opening_prayer: [{ type: 'main', value: '', name: '', updatedAt: '' }],
    public_talk_type: [{ type: 'main', value: 'localSpeaker', updatedAt: '' }],
    speaker: {
      part_1: [{ type: 'main', value: '', name: '', updatedAt: '' }],
      part_2: [{ type: 'main', value: '', name: '', updatedAt: '' }],
      substitute: [{ type: 'main', value: '', name: '', updatedAt: '' }],
    },
    wt_study: {
      conductor: [{ type: 'main', value: '', name: '', updatedAt: '' }],
      reader: [{ type: 'main', value: '', name: '', updatedAt: '' }],
    },
    closing_prayer: [{ type: 'main', value: '', name: '', updatedAt: '' }],
    circuit_overseer: { type: 'main', value: '', name: '', updatedAt: '' },
    week_type: [{ type: 'main', value: Week.NORMAL, updatedAt: '' }],
    outgoing_talks: [],
  },
};

export const personSchema: PersonType = {
  _deleted: { value: false, updatedAt: '' },
  person_uid: '',
  person_data: {
    person_firstname: { value: '', updatedAt: '' },
    person_lastname: { value: '', updatedAt: '' },
    person_display_name: { value: '', updatedAt: '' },
    male: { value: true, updatedAt: '' },
    female: { value: false, updatedAt: '' },
    birth_date: { value: null, updatedAt: '' },
    assignments: [],
    timeAway: [],
    archived: { value: false, updatedAt: '' },
    disqualified: { value: false, updatedAt: '' },
    email: { value: '', updatedAt: '' },
    address: { value: '', updatedAt: '' },
    phone: { value: '', updatedAt: '' },
    first_report: { value: null, updatedAt: '' },
    publisher_baptized: {
      active: { value: false, updatedAt: '' },
      anointed: { value: false, updatedAt: '' },
      other_sheep: { value: true, updatedAt: '' },
      baptism_date: { value: null, updatedAt: '' },
      history: [],
    },
    publisher_unbaptized: {
      active: { value: false, updatedAt: '' },
      history: [],
    },
    midweek_meeting_student: {
      active: { value: true, updatedAt: '' },
      history: [
        {
          id: crypto.randomUUID(),
          _deleted: false,
          updatedAt: new Date().toISOString(),
          start_date: new Date().toISOString(),
          end_date: null,
        },
      ],
    },
    privileges: [],
    enrollments: [],
    emergency_contacts: [],
    categories: ['main'],
  },
};

export const settingSchema: SettingsType = {
  id: 1,
  cong_settings: {
    country_code: '',
    cong_number: '',
    cong_name: '',
    cong_master_key: '',
    cong_access_code: '',
    cong_location: { address: '', lat: 0, lng: 0, updatedAt: '' },
    cong_new: true,
    cong_circuit: [{ type: 'main', value: '', updatedAt: '' }],
    display_name_enabled: {
      meetings: { value: false, updatedAt: '' },
      others: { value: false, updatedAt: '' },
    },
    schedule_exact_date_enabled: { value: false, updatedAt: '' },
    fullname_option: [
      { type: 'main', value: FullnameOption.FIRST_BEFORE_LAST, updatedAt: '' },
    ],
    short_date_format: [{ type: 'main', value: 'MM/dd/yyyy', updatedAt: '' }],
    cong_discoverable: { value: false, updatedAt: '' },
    time_away_public: { value: false, updatedAt: '' },
    format_24h_enabled: [{ type: 'main', value: true, updatedAt: '' }],
    week_start_sunday: [{ type: 'main', value: false, updatedAt: '' }],
    attendance_online_record: { value: false, updatedAt: '' },
    special_months: [],
    source_material: {
      auto_import: {
        enabled: { value: true, updatedAt: '' },
        frequency: { value: SourceFrequency.BIWEEKLY, updatedAt: '' },
      },
      language: [{ type: 'main', value: 'E', updatedAt: '' }],
    },
    circuit_overseer: {
      firstname: { value: '', updatedAt: '' },
      lastname: { value: '', updatedAt: '' },
      display_name: { value: '', updatedAt: '' },
      visits: [],
    },
    midweek_meeting: [
      {
        type: 'main',
        class_count: { value: 1, updatedAt: '' },
        opening_prayer_auto_assigned: { value: false, updatedAt: '' },
        closing_prayer_auto_assigned: { value: false, updatedAt: '' },
        time: { value: '00:00', updatedAt: '' },
        weekday: { value: 2, updatedAt: '' },
        aux_class_counselor_default: {
          enabled: { value: false, updatedAt: '' },
          person: { value: '', updatedAt: '' },
        },
      },
    ],
    weekend_meeting: [
      {
        type: 'main',
        opening_prayer_auto_assigned: { value: false, updatedAt: '' },
        time: { value: '00:00', updatedAt: '' },
        substitute_speaker_enabled: { value: false, updatedAt: '' },
        weekday: { value: 7, updatedAt: '' },
        w_study_conductor_default: { value: '', updatedAt: '' },
        substitute_w_study_conductor_displayed: { value: true, updatedAt: '' },
        consecutive_monthly_parts_notice_shown: { value: true, updatedAt: '' },
        outgoing_talks_schedule_public: { value: false, updatedAt: '' },
      },
    ],
    language_groups: [],
    responsabilities: {
      coordinator: '',
      secretary: '',
      service: '',
      updatedAt: '',
    },
    data_sync: { value: false, updatedAt: '' },
    field_service_group_publishers_sort_method: {
      updatedAt: '',
      value: FieldServiceGroupPublishersSortOption.MANUAL,
    },
  },
  user_settings: {
    cong_role: [],
    account_type: '',
    backup_automatic: {
      enabled: { value: true, updatedAt: '' },
      interval: { value: 15, updatedAt: '' },
    },
    hour_credits_enabled: { value: false, updatedAt: '' },
    firstname: { value: '', updatedAt: '' },
    lastname: { value: '', updatedAt: '' },
    theme_follow_os_enabled: { value: false, updatedAt: '' },
    user_avatar: undefined,
    user_local_uid: '',
    user_members_delegate: [],
    data_view: 'main',
  },
};

export const vistingSpeakerSchema: VisitingSpeakerType = {
  _deleted: { value: false, updatedAt: '' },
  person_uid: '',
  speaker_data: {
    cong_id: '',
    person_display_name: { value: '', updatedAt: '' },
    person_firstname: { value: '', updatedAt: '' },
    person_lastname: { value: '', updatedAt: '' },
    person_notes: { value: '', updatedAt: '' },
    elder: { value: false, updatedAt: '' },
    ministerial_servant: { value: false, updatedAt: '' },
    person_email: { value: '', updatedAt: '' },
    person_phone: { value: '', updatedAt: '' },
    local: { value: false, updatedAt: '' },
    talks: [],
  },
};

export const speakersCongregationSchema: SpeakersCongregationsType = {
  _deleted: { value: false, updatedAt: '' },
  cong_data: {
    cong_id: '',
    cong_number: { value: '', updatedAt: '' },
    cong_name: { value: '', updatedAt: '' },
    cong_circuit: { value: '', updatedAt: '' },
    cong_location: {
      address: { value: '', updatedAt: '' },
      lat: undefined,
      lng: undefined,
    },
    midweek_meeting: {
      weekday: { value: 2, updatedAt: '' },
      time: { value: '18:30', updatedAt: '' },
    },
    weekend_meeting: {
      weekday: { value: 6, updatedAt: '' },
      time: { value: '09:00', updatedAt: '' },
    },
    public_talk_coordinator: {
      name: { value: '', updatedAt: '' },
      email: { value: '', updatedAt: '' },
      phone: { value: '', updatedAt: '' },
    },
    coordinator: {
      name: { value: '', updatedAt: '' },
      email: { value: '', updatedAt: '' },
      phone: { value: '', updatedAt: '' },
    },
    request_status: 'pending',
    request_id: '',
  },
};

export const meetingAttendanceSchema: MeetingAttendanceType = {
  _deleted: { value: false, updatedAt: '' },
  month_date: '',
  week_1: {
    midweek: [
      { type: 'main', online: undefined, present: undefined, updatedAt: '' },
    ],
    weekend: [
      { type: 'main', online: undefined, present: undefined, updatedAt: '' },
    ],
  },
  week_2: {
    midweek: [
      { type: 'main', online: undefined, present: undefined, updatedAt: '' },
    ],
    weekend: [
      { type: 'main', online: undefined, present: undefined, updatedAt: '' },
    ],
  },
  week_3: {
    midweek: [
      { type: 'main', online: undefined, present: undefined, updatedAt: '' },
    ],
    weekend: [
      { type: 'main', online: undefined, present: undefined, updatedAt: '' },
    ],
  },
  week_4: {
    midweek: [
      { type: 'main', online: undefined, present: undefined, updatedAt: '' },
    ],
    weekend: [
      { type: 'main', online: undefined, present: undefined, updatedAt: '' },
    ],
  },
  week_5: {
    midweek: [
      { type: 'main', online: undefined, present: undefined, updatedAt: '' },
    ],
    weekend: [
      { type: 'main', online: undefined, present: undefined, updatedAt: '' },
    ],
  },
};

export const userBibleStudySchema: UserBibleStudyType = {
  person_uid: '',
  person_data: { _deleted: false, person_name: '', updatedAt: '' },
};

export const userFieldServiceDailyReportSchema: UserFieldServiceDailyReportType =
  {
    report_date: '',
    report_data: {
      _deleted: false,
      hours: { field_service: '', credit: '' },
      timer: { start: 0, state: 'not_started', value: 0 },
      bible_studies: { value: 0, records: [] },
      record_type: 'daily',
      comments: '',
      updatedAt: '',
    },
  };

export const userFieldServiceMonthlyReportSchema: UserFieldServiceMonthlyReportType =
  {
    report_date: '',
    report_data: {
      _deleted: false,
      updatedAt: '',
      shared_ministry: false,
      hours: {
        field_service: { daily: '', monthly: '' },
        credit: { daily: '', monthly: '' },
      },
      bible_studies: { daily: 0, monthly: 0, records: [] },
      comments: '',
      record_type: 'monthly',
      status: 'pending',
    },
  };

export const congFieldServiceReportSchema: CongFieldServiceReportType = {
  report_id: '',
  report_data: {
    _deleted: false,
    updatedAt: '',
    report_date: '',
    person_uid: '',
    shared_ministry: false,
    hours: {
      field_service: 0,
      credit: { value: 0, approved: 0 },
    },
    bible_studies: 0,
    comments: '',
    late: {
      value: false,
      submitted: '',
    },
    status: 'confirmed',
  },
};

export const SchemaBranchFieldServiceReport: BranchFieldServiceReportType = {
  report_date: '',
  report_data: {
    _deleted: false,
    updatedAt: '',
    submitted: false,
    publishers_active: 0,
    weekend_meeting_average: 0,
    publishers: { report_count: 0, bible_studies: 0 },
    APs: { report_count: 0, bible_studies: 0, hours: 0 },
    FRs: { report_count: 0, bible_studies: 0, hours: 0 },
  },
};

export const SchemaBranchCongAnalysis: BranchCongAnalysisType = {
  report_date: '',
  report_data: {
    _deleted: false,
    updatedAt: '',
    submitted: false,
    meeting_average: { midweek: 0, weekend: 0 },
    publishers: { active: 0, inactive: 0, reactivated: 0 },
    territories: { total: 0, uncovered: 0 },
  },
};

export const SchemaFieldServiceGroup: FieldServiceGroupType = {
  group_id: '',
  group_data: {
    _deleted: false,
    updatedAt: '',
    sort_index: 0,
    name: '',
    members: [],
  },
};

export const delegatedFieldServiceReportSchema: DelegatedFieldServiceReportType =
  {
    report_id: '',
    report_data: {
      _deleted: false,
      updatedAt: '',
      shared_ministry: false,
      hours: {
        field_service: { daily: '', monthly: '' },
        credit: { daily: '', monthly: '' },
      },
      bible_studies: { daily: 0, monthly: 0, records: [] },
      comments: '',
      status: 'pending',
      person_uid: '',
      report_date: '',
    },
  };
