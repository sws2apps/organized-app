import { PersonType } from '@definition/person';
import { SchedWeekType } from '@definition/schedules';
import { FullnameOption, SettingsType } from '@definition/settings';
import { SourceWeekType } from '@definition/sources';
import { SpeakersCongregationsType } from '@definition/speakers_congregations';
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
  released: [{ type: 'main', value: false, updatedAt: '' }],
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
    first_month_report: { value: null, updatedAt: '' },
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
          start_date: {
            value: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          end_date: { value: null, updatedAt: new Date().toISOString() },
          _deleted: { value: false, updatedAt: '' },
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
    cong_location: { address: '', lat: 0, lng: 0 },
    cong_new: true,
    cong_circuit: [{ type: 'main', value: '' }],
    display_name_enabled: { value: false, updatedAt: '' },
    fullname_option: { value: FullnameOption.FIRST_BEFORE_LAST, updatedAt: '' },
    circuit_overseer: {
      firstname: { value: '', updatedAt: '' },
      lastname: { value: '', updatedAt: '' },
      display_name: { value: '', updatedAt: '' },
    },
    cong_discoverable: { value: false, updatedAt: '' },
    midweek_meeting: [
      {
        type: 'main',
        class_count: { value: 1, updatedAt: '' },
        opening_prayer_auto_assign: { value: false, updatedAt: '' },
        time: '00:00',
        schedule_exact_date_enabled: { value: false, updatedAt: '' },
        weekday: 2,
      },
    ],
    weekend_meeting: [
      {
        type: 'main',
        opening_prayer_auto_assigned: { value: false, updatedAt: '' },
        time: '00:00',
        substitute_speaker_enabled: { value: false, updatedAt: '' },
        weekday: 7,
        w_study_conductor_default: { value: '', updatedAt: '' },
      },
    ],
    language_groups: [],
  },
  user_settings: {
    cong_role: [],
    account_type: '',
    backup_automatic: {
      enabled: { value: true, updatedAt: '' },
      interval: { value: 5, updatedAt: '' },
    },
    hour_credits_enabled: { value: false, updatedAt: '' },
    firstname: { value: '', updatedAt: '' },
    lastname: { value: '', updatedAt: '' },
    theme_follow_os_enabled: { value: false, updatedAt: '' },
    user_avatar: undefined,
    user_local_uid: '',
    user_members_delegate: [],
    user_time_away: [],
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
