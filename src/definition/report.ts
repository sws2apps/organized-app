export type ReportMonthType = {
  value: string;
  label: string;
};

export type ServiceYearType = {
  year: string;
  months: ReportMonthType[];
};

export type S21CardMonthData = {
  month_name: string;
  shared: boolean;
  bible_studies: string;
  AP: boolean;
  hours: string;
  remarks: string;
};

export type S21CardData = {
  year: string;
  name: string;
  birth_date: string;
  baptism_date: string;
  gender: { male: boolean; female: boolean };
  hope: { other_sheep: boolean; anointed: boolean };
  privileges: { elder: boolean; ms: boolean };
  enrollments: { FR: boolean; FS: boolean; FMF: boolean };
  months: S21CardMonthData[];
  hours_total: string;
  lang: string;
};
