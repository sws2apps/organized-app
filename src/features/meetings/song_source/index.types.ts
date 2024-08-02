export type SongSourceType = {
  week: string;
  meeting: 'midweek' | 'weekend';
  type: 'opening' | 'middle' | 'concluding';
  isEdit?: boolean;
  label?: string;
};
