export type SongSourceType = {
  week: string;
  meeting: 'midweek' | 'weekend';
  type: 'opening' | 'middle' | 'concluding' | 'outgoing';
  isEdit?: boolean;
  label?: string;
  schedule_id?: string;
  dataView?: string;
};
