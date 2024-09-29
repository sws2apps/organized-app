import { APFormType } from '@definition/ministry';

export type ApplicationFormProps = {
  application: APFormType;
  onChange: (value: APFormType) => void;
};
