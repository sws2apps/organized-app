import { APFormType } from '@definition/ministry';

export type CommitteeMemberProps = {
  type: 'coordinator' | 'service' | 'secretary';
  name: string;
  onApproved?: VoidFunction;
  onRejected?: VoidFunction;
  application?: APFormType;
};
