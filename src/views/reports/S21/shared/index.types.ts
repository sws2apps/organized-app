import { S21CardData, S21CardMonthData } from '@definition/report';

export type S21Type = {
  data: S21CardData;
};

export type S21MonthType = {
  data: S21CardMonthData;
  isLast: boolean;
};
