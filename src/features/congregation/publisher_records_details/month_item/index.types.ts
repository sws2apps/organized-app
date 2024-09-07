import { PersonType } from '@definition/person';

export type MonthItemProps = {
  month: string;
  person: PersonType;
};

export type MonthStatusType = 'shared' | 'not_shared';
