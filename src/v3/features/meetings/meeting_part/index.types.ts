export type MeetingPartType = {
  week: string;
  type:
    | 'tgw_talk'
    | 'tgw_gems'
    | 'tgw_bible_reading'
    | 'ayf_part1'
    | 'ayf_part2'
    | 'ayf_part3'
    | 'ayf_part4'
    | 'lc_part1'
    | 'lc_part2'
    | 'lc_part3'
    | 'lc_cbs';
  color: string;
  isOverwrite?: boolean;
  isEdit?: boolean;
};
