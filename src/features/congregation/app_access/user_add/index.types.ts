export type UserAddType = {
  open: boolean;
  onClose: VoidFunction;
};

export type CurrentStepType = 'select' | 'share';

export type UserType = {
  name: string;
  code: string;
};
