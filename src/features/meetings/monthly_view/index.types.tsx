import { SelectChangeEvent } from '@mui/material';

export type MonthlyViewHeaderType = {
  selectedMonth: number;
  handleSelectedMonthChange: (e: SelectChangeEvent<string>) => void;
};

export type MonthlyViewChairmanType = {
  currentYear: string;
  selectedMonth: number;
};
