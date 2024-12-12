import { PersonType } from '@definition/person';

export type ReportDetailsProps = {
  open: boolean;
  onClose: VoidFunction;
  month: string;
  person: PersonType;
};
