export type YearlyData = {
  year: string;
  months: {
    month: string;
    midweek: {
      count: number;
      total: number;
      average: number;
    };
    weekend: {
      count: number;
      total: number;
      average: number;
    };
  }[];
};

export type AttendanceExport = {
  category: string;
  name: string;
  data: YearlyData[];
};
