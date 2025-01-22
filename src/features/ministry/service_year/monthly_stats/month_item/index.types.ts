import { PersonType } from '@definition/person';

export type MonthItemProps = {
  month: string;
  person: PersonType;
};

export type MonthStatusType =
  | 'pending'
  | 'submitted'
  | 'confirmed'
  | 'late'
  | 'received';
