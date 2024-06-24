export type TalkHistoryWeeklyType = {
  weekOf: string;
  weekOfFormatted: string;
  speaker1: string;
  speaker_1_display_name: string;
  speaker2: string;
  speaker_2_display_name: string;
};

export type TalkHistoryType = {
  talk_number: number;
  history: TalkHistoryWeeklyType[];
  last_delivered: string;
  last_delivered_formatted: string;
};

type LanguageStringType = {
  [language: string]: string;
};

type LanguageNumberType = {
  [language: string]: number;
};

type CongregationStringType = {
  type: string;
  value: string;
  updatedAt: string;
};

type CongregationNumberType = {
  type: string;
  value: number;
  updatedAt: string;
};

export type ApplyMinistryType = {
  type: LanguageNumberType;
  time: LanguageNumberType;
  src: LanguageStringType;
  title: LanguageStringType;
};

export type LivingAsChristiansType = {
  time: { default: LanguageNumberType; override: CongregationNumberType[] };
  title: { default: LanguageStringType; override: CongregationStringType[] };
  desc: { default: LanguageStringType; override: CongregationStringType[] };
};

export type SourceWeekType = {
  weekOf: string;
  midweek_meeting: {
    week_date_locale: LanguageStringType;
    weekly_bible_reading: LanguageStringType;
    song_first: LanguageStringType;
    tgw_talk: {
      src: LanguageStringType;
      time: { default: number; override: CongregationNumberType[] };
    };
    tgw_gems: {
      title: LanguageStringType;
      time: { default: number; override: CongregationNumberType[] };
    };
    tgw_bible_reading: { src: LanguageStringType; title: LanguageStringType };
    ayf_count: LanguageNumberType;
    ayf_part1: ApplyMinistryType;
    ayf_part2: ApplyMinistryType;
    ayf_part3: ApplyMinistryType;
    ayf_part4: ApplyMinistryType;
    song_middle: LanguageStringType;
    lc_count: { default: LanguageNumberType; override: CongregationNumberType[] };
    lc_part1: LivingAsChristiansType;
    lc_part2: LivingAsChristiansType;
    lc_part3: { time: CongregationNumberType[]; title: CongregationStringType[]; desc: CongregationStringType[] };
    lc_cbs: {
      title: { default: LanguageStringType; override: CongregationStringType[] };
      time: { default: number; override: CongregationNumberType[] };
      src: LanguageStringType;
    };
    co_talk_title: { src: string; updatedAt: string };
    song_conclude: { default: LanguageStringType; override: CongregationStringType[] };
  };
  weekend_meeting: {
    event_name: { value: string; updatedAt: string };
    song_first: CongregationStringType[];
    public_talk: CongregationNumberType[];
    co_talk_title: {
      public: { src: string; updatedAt: string };
      service: { src: string; updatedAt: string };
    };
    w_study: {
      title: LanguageStringType;
      opening_song: LanguageStringType;
      concluding_song: LanguageStringType;
    };
  };
};

export type SourceWeekIncomingType = {
  week_date: string;
  mwb_week_date: string;
  mwb_week_date_locale: string;
  mwb_weekly_bible_reading: string;
  mwb_song_first: number;
  mwb_tgw_talk: string;
  mwb_tgw_talk_title: string;
  mwb_tgw_gems_title: string;
  mwb_tgw_bread: string;
  mwb_tgw_bread_title: string;
  mwb_ayf_count: number;
  mwb_ayf_part1_type: string;
  mwb_ayf_part1_time: number;
  mwb_ayf_part1_title: string;
  mwb_ayf_part1: string;
  mwb_ayf_part2_type: string;
  mwb_ayf_part2_time: number;
  mwb_ayf_part2_title: string;
  mwb_ayf_part2: string;
  mwb_ayf_part3_type?: string;
  mwb_ayf_part3_time?: number;
  mwb_ayf_part3_title?: string;
  mwb_ayf_part3?: string;
  mwb_ayf_part4_type?: string;
  mwb_ayf_part4_time?: number;
  mwb_ayf_part4_title?: string;
  mwb_ayf_part4?: string;
  mwb_song_middle: number | string;
  mwb_lc_count: number;
  mwb_lc_part1_time: number;
  mwb_lc_part1_title: string;
  mwb_lc_part1_content: string;
  mwb_lc_part2_time?: number;
  mwb_lc_part2_title?: string;
  mwb_lc_part2_content?: string;
  mwb_lc_cbs: string;
  mwb_lc_cbs_title: string;
  mwb_song_conclude: number | string;
  w_study_date: string;
  w_study_date_locale?: string;
  w_study_title?: string;
  w_study_opening_song?: number;
  w_study_concluding_song?: number;
};

export type MidweekMeetingTimeType = {
  pgmStart: string;
  openingComments: string;
  tgwTalk: string;
  tgwGems: string;
  bibleReading: string;
  ayf1: string;
  ayf2?: string;
  ayf3?: string;
  ayf4?: string;
  middleSong: string;
  lc1: string;
  lc2?: string;
  cbs?: string;
  concludingComments: string;
  pgmEnd: string;
  coTalk?: string;
};

export type SourcesFormattedType = {
  value: number;
  months: {
    value: number;
    weeks: string[];
  }[];
};
