type BibleStudyType = {
  _deleted: null | string;
  person_uid: string;
  updatedAt: string;
};

export type UserFieldServiceReportType = {
  id?: string;
  _deleted: null | string;
  month_date: { value: string; updatedAt: string };
  shared_ministry: { value: boolean; updatedAt: string };
  hours?: { value: number; updatedAt: string };

  /**
   * Date in ISO format to keep track when the timer was started
   */
  duration_start?: string;

  hours_credits?: { value: number; updatedAt: string };
  bible_studies: { value: number; updatedAt: string };
  bible_studies_record: BibleStudyType[];
  comments: { value: string; updatedAt: string };
  isSubmitted: { value: boolean; updatedAt: string };
  record_type: { value: 'daily' | 'S4' | 'S21'; updatedAt: string };
};
