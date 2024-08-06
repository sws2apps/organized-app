export type CongFieldServiceReportType = {
  id?: string;
  _deleted: { value: boolean; updatedAt: string };
  person_uid: string;
  shared_ministry: { value: boolean; updatedAt: string };
  month_date: { value: string; updatedAt: string };
  hours?: { value: number; updatedAt: string };
  hours_credits?: { value: number; updatedAt: string };
  bible_studies: { value: number; updatedAt: string };
  comments: { value: string; updatedAt: string };
  posted_date: { value: string; updatedAt: string };
};
