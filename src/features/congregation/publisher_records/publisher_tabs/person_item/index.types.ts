import { PersonType } from '@definition/person';

export type PersonItemProps = {
  person: PersonType;
  month: string;
  type: 'active' | 'inactive';
};
