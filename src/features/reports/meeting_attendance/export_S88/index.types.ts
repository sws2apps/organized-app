export type AttendanceExport = {
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
