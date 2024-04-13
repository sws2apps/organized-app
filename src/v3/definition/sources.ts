export type AssignmentType = {
  value: number;
  label: string;
  assignable: boolean;
  maleOnly: boolean;
  type: string;
  linkTo: number;
};

export type TalkHistoryWeeklyType = {
  weekOf: string;
  weekOfFormatted: string;
  speaker1: string;
  speaker_1_dispName: string;
  speaker2: string;
  speaker_2_dispName: string;
};

export type TalkHistoryType = {
  talk_number: number;
  history: TalkHistoryWeeklyType[];
  last_delivered: string;
  last_delivered_formatted: string;
};

export type TalkType = {
  talk_number: number;
  talk_title: {
    [language: string]: {
      title: string;
      modified: string;
    };
  };
};

export type TalkLocaleType = {
  talk_number: number;
  talk_title: string;
  talk_modified: string;
};

type LanguageStringData = {
  [language: string]: string | undefined;
};

type LanguageNumberData = {
  [language: string]: number | string;
};

export type SourceWeekType = {
  weekOf: string;
  mwb_week_date_locale: LanguageStringData;
  mwb_weekly_bible_reading: LanguageStringData;
  mwb_song_first: number | string;
  mwb_tgw_talk: LanguageStringData;
  mwb_tgw_bread: LanguageStringData;
  mwb_ayf_count: number;
  mwb_ayf_part1_type: LanguageNumberData;
  mwb_ayf_part1_time: number | string;
  mwb_ayf_part1: LanguageStringData;
  mwb_ayf_part2_type: LanguageNumberData;
  mwb_ayf_part2_time: number | string;
  mwb_ayf_part2: LanguageStringData;
  mwb_ayf_part3_type: LanguageNumberData;
  mwb_ayf_part3_time: number | string;
  mwb_ayf_part3: LanguageStringData;
  mwb_ayf_part4_type: LanguageNumberData;
  mwb_ayf_part4_time: number | string;
  mwb_ayf_part4: LanguageStringData;
  mwb_song_middle: number | string;
  mwb_lc_count: number;
  mwb_lc_count_override: number;
  mwb_lc_part1_time: number | string;
  mwb_lc_part1: LanguageStringData;
  mwb_lc_part1_content: LanguageStringData;
  mwb_lc_part1_time_override: number | string;
  mwb_lc_part1_override: LanguageStringData;
  mwb_lc_part1_content_override: LanguageStringData;
  mwb_lc_part2_time: number | string;
  mwb_lc_part2: LanguageStringData;
  mwb_lc_part2_content: LanguageStringData;
  mwb_lc_part2_time_override: number | string;
  mwb_lc_part2_override: LanguageStringData;
  mwb_lc_part2_content_override: LanguageStringData;
  mwb_lc_cbs: LanguageStringData;
  mwb_lc_cbs_time_override: number | string;
  mwb_co_talk_title: string;
  mwb_song_conclude: number | string;
  mwb_song_conclude_override: number | string;
  w_study_date_locale: LanguageStringData;
  w_co_talk_title: string;
  w_study_title: LanguageStringData;
  w_study_opening_song: number | string;
  w_study_concluding_song: number | string;
  keepOverride: string | undefined;
};

export type SourceWeekIncomingType = {
  week_date: string;
  mwb_week_date: string;
  w_study_date: string;
  mwb_week_date_locale: string;
  mwb_weekly_bible_reading: string;
  mwb_song_first: number;
  mwb_tgw_talk: string;
  mwb_tgw_bread: string;
  mwb_ayf_count: number;
  mwb_ayf_part1_type: string;
  mwb_ayf_part1_time: number;
  mwb_ayf_part1: string;
  mwb_ayf_part2_type: string;
  mwb_ayf_part2_time: number;
  mwb_ayf_part2: string;
  mwb_ayf_part3_type?: string;
  mwb_ayf_part3_time?: number;
  mwb_ayf_part3?: string;
  mwb_ayf_part4_type?: string;
  mwb_ayf_part4_time?: number;
  mwb_ayf_part4?: string;
  mwb_song_middle: number | string;
  mwb_lc_count: number;
  mwb_lc_part1_time: number;
  mwb_lc_part1: string;
  mwb_lc_part1_content: string;
  mwb_lc_part2_time?: number | string;
  mwb_lc_part2?: string;
  mwb_lc_part2_content?: string;
  mwb_lc_cbs: string;
  mwb_song_conclude: number | string;
  w_study_date_locale?: string;
  w_study_title?: string;
  w_study_opening_song?: number;
  w_study_concluding_song?: number;
};

export type SourceWeekLocaleType = Overwrite<
  SourceWeekIncomingType,
  {
    weekOf: string;
    mwb_ayf_part1_type: number;
    mwb_ayf_part1_type_name?: string;
    mwb_ayf_part2_type?: number | string;
    mwb_ayf_part2_type_name?: string;
    mwb_ayf_part2_time?: number | string;
    mwb_ayf_part3_type?: number | string;
    mwb_ayf_part3_type_name?: string;
    mwb_ayf_part3_time?: number | string;
    mwb_ayf_part4_type?: number | string;
    mwb_ayf_part4_type_name?: string;
    mwb_ayf_part4_time?: number | string;
    mwb_lc_count_override: number;
    mwb_lc_part1_time_override?: number | string;
    mwb_lc_part1_override?: string;
    mwb_lc_part1_content_override?: string;
    mwb_lc_part2_time_override?: number | string;
    mwb_lc_part2_override?: string;
    mwb_lc_part2_content_override?: string;
    mwb_lc_cbs_time_override?: number | string;
    mwb_song_conclude_override?: number | string;
    mwb_co_talk_title?: string;
    w_co_talk_title?: string;
  }
>;

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

export type PublicTalksViewType = 'list' | 'table';

export enum Week {
  NORMAL = 1,
  CO_VISIT = 2,
  ASSEMBLY = 3,
  CONVENTION = 4,
}

export type WeekType = {
  id: Week;
  sort_index: number;
  week_type_name: {
    [language: string]: string;
  };
};
