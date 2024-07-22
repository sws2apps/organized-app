import { ViewProps } from '@react-pdf/renderer';

export type S89ClassType = {
  name: string;
  checked?: boolean;
};

export type S89DetailsRowType = {
  field: string;
  value: string;
  align?: 'left' | 'center' | 'right' | 'justify';
};

export type S89ToBeGivenType = {
  main_hall: boolean;
  aux_class_1: boolean;
  aux_class_2?: boolean;
};

export type S89DataType = {
  id: string;
  student_name: string;
  assistant_name: string;
  assignment_date: string;
  part_number: string;
  main_hall: boolean;
  aux_class_1: boolean;
  aux_class_2?: boolean;
};

export type S89Type = {
  s89Data: S89DataType[];
};
