import { Table } from 'dexie';
import { SourceWeekType } from '@definition/sources';

export type SourcesTable = {
  sources: Table<SourceWeekType>;
};

export const sourcesSchema = {
  sources:
    '&weekOf, mwb_week_date_locale, mwb_weekly_bible_reading, mwb_song_first, mwb_tgw_talk, mwb_tgw_bread, mwb_ayf_count, mwb_ayf_part1, mwb_ayf_part1_time, mwb_ayf_part1_type, mwb_ayf_part2, mwb_ayf_part2_time, mwb_ayf_part2_type, mwb_ayf_part3, mwb_ayf_part3_time, mwb_ayf_part3_type, mwb_ayf_part4, mwb_ayf_part4_time, mwb_ayf_part4_type, mwb_song_middle, mwb_lc_count, mwb_lc_count_override, mwb_lc_part1, mwb_lc_part1_override, mwb_lc_part1_time, mwb_lc_part1_time_override, mwb_lc_part1_content, mwb_lc_part1_content_override, mwb_lc_part2, mwb_lc_part2_override, mwb_lc_part2_time, mwb_lc_part2_time_override, mwb_lc_part2_content, mwb_lc_part2_content_override, mwb_lc_cbs, mwb_lc_cbs_time_override, mwb_song_conclude, mwb_song_conclude_override, mwb_co_talk_title, w_study_date_locale, w_study_title, w_study_opening_song, w_study_concluding_song, w_co_talk_title, keepOverride',
};
