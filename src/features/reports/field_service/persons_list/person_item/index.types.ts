import { PersonType } from '@definition/person';

export type PersonItemProps = {
  person: PersonType;
};

export type ReportStatus = 'not_received' | 'confirmed' | 'received';
