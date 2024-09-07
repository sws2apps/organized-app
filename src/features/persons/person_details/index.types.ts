import { CustomClassName } from '@definition/app';
import { PersonType } from '@definition/person';

export type PersonDetailsProps = {
  person: PersonType;
  month: string;
  className?: CustomClassName;
};
