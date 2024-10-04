import { APFormType } from '@definition/ministry';

export type ApplicationFormProps = {
  application: APFormType;
  onChange: (value: APFormType) => void;
  onCoordinatorApproved?: VoidFunction;
  onCoordinatorRejected?: VoidFunction;
  onSecretaryApproved?: VoidFunction;
  onSecretaryRejected?: VoidFunction;
  onServiceApproved?: VoidFunction;
  onServiceRejected?: VoidFunction;
};
