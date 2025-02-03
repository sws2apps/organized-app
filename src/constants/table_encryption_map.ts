export const TABLE_ENCRYPTION_MAP = {
  persons: {
    _deleted: 'shared',
    person_uid: 'public',
    person_firstname: 'shared',
    person_lastname: 'shared',
    person_display_name: 'shared',
    male: 'shared',
    female: 'shared',
    birth_date: 'private',
    assignments: 'shared',
    timeAway: 'shared',
    archived: 'shared',
    disqualified: 'private',
    email: 'shared',
    address: 'shared',
    phone: 'shared',
    publisher_baptized: 'shared',
    publisher_unbaptized: 'shared',
    midweek_meeting_student: 'shared',
    privileges: 'shared',
    enrollments: 'shared',
    emergency_contacts: 'shared',
    first_report: 'shared',
  },
  app_settings: {
    country_code: 'public',
    cong_number: 'public',
    cong_name: 'public',
    cong_master_key: 'private',
    cong_access_code: 'shared',
    cong_location: 'public',
    cong_new: 'public',
    cong_circuit: 'public',
    cong_discoverable: 'public',
    fullname_option: 'shared',
    short_date_format: 'shared',
    display_name_enabled: 'shared',
    schedule_exact_date_enabled: 'shared',
    time_away_public: 'public',
    source_material: 'shared',
    source_material_auto_import: 'shared',
    special_months: 'shared',
    type: 'public',
    weekday: 'public',
    time: 'public',
    class_count: 'shared',
    opening_prayer_auto_assigned: 'shared',
    closing_prayer_auto_assigned: 'shared',
    aux_class_counselor_default: 'shared',
    substitute_speaker_enabled: 'shared',
    w_study_conductor_default: 'shared',
    substitute_w_study_conductor_displayed: 'shared',
    consecutive_monthly_parts_notice_shown: 'shared',
    outgoing_talks_schedule_public: 'shared',
    circuit_overseer: 'shared',
    language_groups: 'shared',
    format_24h_enabled: 'shared',
    week_start_sunday: 'shared',
    attendance_online_record: 'shared',
    data_sync: 'public',
    responsabilities: 'shared',
    cong_role: 'public',
    account_type: 'public',
    user_local_uid: 'public',
    user_members_delegate: 'public',
    firstname: 'public',
    lastname: 'public',
    backup_automatic: 'shared',
    theme_follow_os_enabled: 'shared',
    hour_credits_enabled: 'shared',
    group_publishers_sort: 'shared',
    data_view: 'shared',
  },
  speakers_congregations: {
    _deleted: 'private',
    id: 'private',
    cong_data: 'private',
  },
  visiting_speakers: {
    person_uid: 'private',
    _deleted: 'private',
    speaker_data: 'private',
  },
  applications: {
    continuous: 'shared',
    months: 'shared',
    submitted: 'shared',
    status: 'shared',
    coordinator: 'shared',
    secretary: 'shared',
    service: 'shared',
    notified: 'shared',
  },
  user_bible_studies: {
    person_uid: 'shared',
    _deleted: 'shared',
    updatedAt: 'shared',
    person_name: 'shared',
  },
  user_field_service_reports: {
    report_date: 'shared',
    _deleted: 'shared',
    updatedAt: 'shared',
    hours: 'shared',
    timer: 'shared',
    bible_studies: 'shared',
    comments: 'shared',
    record_type: 'shared',
    shared_ministry: 'shared',
    status: 'shared',
  },
  incoming_reports: {
    bible_studies: 'shared',
    comments: 'shared',
    hours: 'shared',
    hours_credits: 'shared',
    shared_ministry: 'shared',
    updatedAt: 'shared',
    _deleted: 'shared',
  },
  field_service_groups: {
    group_id: 'shared',
    _deleted: 'shared',
    updatedAt: 'shared',
    name: 'shared',
    sort_index: 'shared',
    members: 'shared',
  },
  cong_field_service_reports: {
    report_date: 'shared',
    _deleted: 'shared',
    updatedAt: 'shared',
    hours: 'shared',
    bible_studies: 'shared',
    comments: 'shared',
    late: 'shared',
    shared_ministry: 'shared',
    status: 'shared',
  },
  branch_field_service_reports: {
    report_date: 'shared',
    _deleted: 'shared',
    updatedAt: 'shared',
    publishers_active: 'shared',
    weekend_meeting_average: 'shared',
    publishers: 'shared',
    APs: 'shared',
    FRs: 'shared',
    submitted: 'shared',
  },
  branch_cong_analysis: {
    report_date: 'shared',
    _deleted: 'shared',
    updatedAt: 'shared',
    meeting_average: 'shared',
    publishers: 'shared',
    territories: 'shared',
    submitted: 'shared',
  },
  sched: {
    chairman: 'shared',
    opening_prayer: 'shared',
    tgw_talk: 'shared',
    tgw_gems: 'shared',
    tgw_bible_reading: 'shared',
    ayf_part1: 'shared',
    ayf_part2: 'shared',
    ayf_part3: 'shared',
    ayf_part4: 'shared',
    lc_part1: 'shared',
    lc_part2: 'shared',
    lc_part3: 'shared',
    lc_cbs: 'shared',
    closing_prayer: 'shared',
    circuit_overseer: 'shared',
    week_type: 'shared',
    public_talk_type: 'shared',
    speaker: 'shared',
    wt_study: 'shared',
    outgoing_talks: 'shared',
  },
  sources: {
    event_name: 'shared',
    week_date_locale: 'shared',
    weekly_bible_reading: 'shared',
    song_first: 'shared',
    tgw_talk: 'shared',
    tgw_gems: 'shared',
    tgw_bible_reading: 'shared',
    ayf_count: 'shared',
    ayf_part1: 'shared',
    ayf_part2: 'shared',
    ayf_part3: 'shared',
    ayf_part4: 'shared',
    song_middle: 'shared',
    lc_count: 'shared',
    lc_part1: 'shared',
    lc_part2: 'shared',
    lc_part3: 'shared',
    lc_cbs: 'shared',
    co_talk_title: 'shared',
    song_conclude: 'shared',
    public_talk: 'shared',
    w_study: 'shared',
  },
  meeting_attendance: {
    week_1: 'shared',
    week_2: 'shared',
    week_3: 'shared',
    week_4: 'shared',
    week_5: 'shared',
  },
  delegated_field_service_reports: {
    report_date: 'shared',
    _deleted: 'shared',
    updatedAt: 'shared',
    hours: 'shared',
    bible_studies: 'shared',
    comments: 'shared',
    shared_ministry: 'shared',
    status: 'shared',
  },
};
