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

type LanguageDataType = {
  [language: string]: string | number | undefined;
};

type CongregationSourceType = {
  type: string;
  value: string | number | undefined;
  updatedAt: string;
};

export type SourceWeekType = {
  weekOf: string;
  midweek_meeting: {
    week_date_locale: LanguageDataType;
    weekly_bible_reading: LanguageDataType;
    song_first: LanguageDataType;
    tgw_talk: LanguageDataType;
    tgw_gems: LanguageDataType;
    tgw_bible_reading: {
      src: LanguageDataType;
      title: LanguageDataType;
    };
    ayf_count: LanguageDataType;
    ayf_part1: {
      type: LanguageDataType;
      time: LanguageDataType;
      src: LanguageDataType;
      title: LanguageDataType;
    };
    ayf_part2: {
      type: LanguageDataType;
      time: LanguageDataType;
      src: LanguageDataType;
      title: LanguageDataType;
    };
    ayf_part3: {
      type: LanguageDataType;
      time: LanguageDataType;
      src: LanguageDataType;
      title: LanguageDataType;
    };
    ayf_part4: {
      type: LanguageDataType;
      time: LanguageDataType;
      src: LanguageDataType;
      title: LanguageDataType;
    };
    song_middle: LanguageDataType;
    lc_count: {
      default: LanguageDataType;
      override: CongregationSourceType[];
    };
    lc_part1: {
      time: {
        default: LanguageDataType;
        override: CongregationSourceType[];
      };
      title: {
        default: LanguageDataType;
        override: CongregationSourceType[];
      };
      desc: {
        default: LanguageDataType;
        override: CongregationSourceType[];
      };
    };
    lc_part2: {
      time: {
        default: LanguageDataType;
        override: CongregationSourceType[];
      };
      title: {
        default: LanguageDataType;
        override: CongregationSourceType[];
      };
      desc: {
        default: LanguageDataType;
        override: CongregationSourceType[];
      };
    };
    lc_part3: {
      time: {
        default: LanguageDataType;
        override: CongregationSourceType[];
      };
      title: {
        default: LanguageDataType;
        override: CongregationSourceType[];
      };
      desc: {
        default: LanguageDataType;
        override: CongregationSourceType[];
      };
    };
    lc_cbs: {
      title: LanguageDataType;
      time: {
        default: number;
        override: CongregationSourceType[];
      };
      src: LanguageDataType;
    };
    co_talk_title: { src: string; updatedAt: string };
    song_conclude: {
      default: LanguageDataType;
      override: CongregationSourceType[];
    };
  };
  weekend_meeting: {
    event_name: { value: string; updatedAt: string };
    song_first: CongregationSourceType[];
    public_talk: CongregationSourceType[];
    co_talk_title: {
      public: { src: string; updatedAt: string };
      service: { src: string; updatedAt: string };
    };
    w_study: {
      title: LanguageDataType;
      opening_song: LanguageDataType;
      concluding_song: LanguageDataType;
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
  mwb_lc_part2_time?: number | undefined;
  mwb_lc_part2_title?: string | undefined;
  mwb_lc_part2_content?: string | undefined;
  mwb_lc_cbs: string;
  mwb_lc_cbs_title: string;
  mwb_song_conclude: number | string;
  w_study_date: string;
  w_study_date_locale?: string;
  w_study_title?: string;
  w_study_opening_song?: number;
  w_study_concluding_song?: number;
};

export type SourceWeekLocaleType = {
  weekOf: string;
  midweek_meeting: {
    week_date_locale: string;
    weekly_bible_reading: string;
    song_first: string;
    tgw_talk: { src: string; title: string };
    tgw_gems: { title: string };
    tgw_bible_reading: { src: string; title: string };
    ayf_count: number;
    ayf_part1: {
      type: number;
      time: number;
      src: string;
      title: string;
    };
    ayf_part2: {
      type: number;
      time: number;
      src: string;
      title: string;
    };
    ayf_part3: {
      type: number;
      time: number;
      src: string;
      title: string;
    };
    ayf_part4: {
      type: number;
      time: number;
      src: string;
      title: string;
    };
    song_middle: string;
    lc_count: {
      default: number;
      override: CongregationSourceType[];
    };
    lc_part1: {
      time: {
        default: number;
        override: CongregationSourceType[];
      };
      title: {
        default: string;
        override: CongregationSourceType[];
      };
      desc: {
        default: string;
        override: CongregationSourceType[];
      };
    };
    lc_part2: {
      time: {
        default: number | undefined;
        override: CongregationSourceType[];
      };
      title: {
        default: string | undefined;
        override: CongregationSourceType[];
      };
      desc: {
        default: string | undefined;
        override: CongregationSourceType[];
      };
    };
    lc_part3: {
      time: {
        default: number | undefined;
        override: CongregationSourceType[];
      };
      title: {
        default: string | undefined;
        override: CongregationSourceType[];
      };
      desc: {
        default: string | undefined;
        override: CongregationSourceType[];
      };
    };
    lc_cbs: {
      title: string;
      time: {
        default: number;
        override: CongregationSourceType[];
      };
      src: string;
    };
    co_talk_title: { src: string; updatedAt: string };
    song_conclude: {
      default: string;
      override: CongregationSourceType[];
    };
  };
  weekend_meeting: {
    song_first: CongregationSourceType[];
    public_talk: CongregationSourceType[];
    co_talk_title: {
      public: { src: string; updatedAt: string };
      service: { src: string; updatedAt: string };
    };
    w_study: {
      title: string;
      opening_song: string;
      concluding_song: string;
    };
  };
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

export type SourcesFormattedType = {
  value: number;
  months: {
    value: number;
    weeks: string[];
  }[];
};
