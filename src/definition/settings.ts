import { AppRoleType } from './app';
import { AssignmentFieldType } from './assignment';

export enum FullnameOption {
  FIRST_BEFORE_LAST = 1,
  LAST_BEFORE_FIRST = 2,
}

export type AccountTypeState = 'vip' | 'pocket';

export enum SourceFrequency {
  WEEKLY = 1,
  BIWEEKLY = 2,
  MONTHLY = 4,
}

export enum PublishersSortOption {
  MANUAL = 1,
  ALPHABETICAL = 2,
}

export enum FirstDayWeekOption {
  SUNDAY = 0,
  MONDAY = 1,
  SATURDAY = 6,
}

export type CircuitOverseerVisitType = {
  _deleted: boolean;
  id: string;
  weekOf: string;
  updatedAt: string;
};

export type SpecialMonthType = {
  _deleted: boolean;
  updatedAt: string;
  year: string;
  months: string[];
};

export type SettingsType = {
  id: number;
  cong_settings: {
    country_code: string;
    cong_number: string;
    cong_name: string;
    cong_master_key: string;
    cong_access_code: string;
    cong_location: {
      address: string;
      lat: number;
      lng: number;
      updatedAt: string;
    };
    cong_migrated?: boolean;
    cong_new: boolean;
    cong_circuit: {
      type: string;
      value: string;
      updatedAt: string;
      _deleted: boolean;
    }[];
    cong_discoverable: { value: boolean; updatedAt: string };
    fullname_option: {
      type: string;
      value: FullnameOption;
      updatedAt: string;
      _deleted: boolean;
    }[];
    short_date_format: {
      type: string;
      value: string;
      updatedAt: string;
      _deleted: boolean;
    }[];
    display_name_enabled: {
      type: string;
      updatedAt: string;
      _deleted: boolean;
      meetings: boolean;
      others: boolean;
    }[];
    schedule_exact_date_enabled: {
      value: boolean;
      updatedAt: string;
      type: string;
      _deleted: boolean;
    }[];
    time_away_public: { value: boolean; updatedAt: string };
    source_material: {
      auto_import: {
        enabled: { value: boolean; updatedAt: string };
        frequency: { value: SourceFrequency; updatedAt: string };
      };
      language: {
        type: string;
        value: string;
        updatedAt: string;
        _deleted: boolean;
      }[];
    };
    special_months: SpecialMonthType[];
    midweek_meeting: {
      type: string;
      _deleted: { value: boolean; updatedAt: string };
      weekday: { value: number; updatedAt: string };
      time: { value: string; updatedAt: string };
      class_count: { value: number; updatedAt: string };
      opening_prayer_linked_assignment: {
        value: AssignmentFieldType | '';
        updatedAt: string;
      };
      closing_prayer_linked_assignment: {
        value: AssignmentFieldType | '';
        updatedAt: string;
      };

      aux_class_counselor_default: {
        enabled: { value: boolean; updatedAt: string };
        person: { value: string; updatedAt: string };
      };
    }[];
    weekend_meeting: {
      type: string;
      _deleted: { value: boolean; updatedAt: string };
      weekday: { value: number; updatedAt: string };
      time: { value: string; updatedAt: string };
      opening_prayer_auto_assigned: { value: boolean; updatedAt: string };
      substitute_speaker_enabled: { value: boolean; updatedAt: string };
      w_study_conductor_default: { value: string; updatedAt: string };
      substitute_w_study_conductor_displayed: {
        value: boolean;
        updatedAt: string;
      };
      consecutive_monthly_parts_notice_shown: {
        value: boolean;
        updatedAt: string;
      };
      outgoing_talks_schedule_public: {
        value: boolean;
        updatedAt: string;
      };
    }[];
    circuit_overseer: {
      firstname: { value: string; updatedAt: string };
      lastname: { value: string; updatedAt: string };
      display_name: { value: string; updatedAt: string };
      visits: CircuitOverseerVisitType[];
    };
    language_groups: { enabled: { value: boolean; updatedAt: string } };
    format_24h_enabled: {
      type: string;
      value: boolean;
      updatedAt: string;
      _deleted: boolean;
    }[];
    week_start_sunday: {
      type: string;
      value: boolean;
      updatedAt: string;
      _deleted: boolean;
    }[];
    attendance_online_record: {
      type: string;
      value: boolean;
      updatedAt: string;
      _deleted: boolean;
    }[];
    data_sync: { value: boolean; updatedAt: string };
    responsabilities: {
      coordinator: string;
      secretary: string;
      service: string;
      updatedAt: string;
    };
    group_publishers_sort: {
      updatedAt: string;
      value: PublishersSortOption;
    };
    aux_class_fsg: { value: boolean; updatedAt: string };
    first_day_week: {
      type: string;
      _deleted: boolean;
      updatedAt: string;
      value: FirstDayWeekOption;
    }[];
    schedule_songs_weekend: {
      type: string;
      _deleted: boolean;
      updatedAt: string;
      value: boolean;
    }[];
    meeting_duties: {
      type: string;
      _deleted: { value: boolean; updatedAt: string };
      conflict_prevent: { value: boolean; updatedAt: string };
      mic_sections: { value: boolean; updatedAt: string };
      av_amount: { value: number; updatedAt: string };
      mic_amount: { value: number; updatedAt: string };
      stage_amount: { value: number; updatedAt: string };
      entrance_attendant_amount: { value: number; updatedAt: string };
      hospitality_amount: { value: number; updatedAt: string };
      custom: {
        _deleted: boolean;
        id: string;
        name: string;
        updatedAt: string;
        amount: number;
      }[];
    }[];
  };
  user_settings: {
    id?: string;
    cong_role: AppRoleType[];
    account_type: '' | AccountTypeState;
    user_avatar: ArrayBuffer;
    user_local_uid: string;
    user_members_delegate: string[];
    firstname: { value: string; updatedAt: string };
    lastname: { value: string; updatedAt: string };
    backup_automatic: {
      enabled: { value: boolean; updatedAt: string };
      interval: { value: number; updatedAt: string };
    };
    theme_follow_os_enabled: { value: boolean; updatedAt: string };
    hour_credits_enabled: { value: boolean; updatedAt: string };
    data_view: { value: string; updatedAt: string };
  };
};

export type BackupDataType = {
  dbPersons: [];
  dbDeleted: [];
  dbSourceMaterial: [];
  dbSchedule: object[];
  dbPublicTalks: [];
  dbVisitingSpeakers: [];
  dbBranchReportsTbl: [];
  dbFieldServiceGroupTbl: [];
  dbFieldServiceReportsTbl: [];
  dbLateReportsTbl: [];
  dbMeetingAttendanceTbl: [];
  dbMinutesReportsTbl: [];
  dbServiceYearTbl: [];
  dbUserBibleStudiesTbl: [];
  dbUserFieldServiceReportsTbl: [];
  dbUpcomingEventsTbl: [];
  dbSettings: object[];
};
