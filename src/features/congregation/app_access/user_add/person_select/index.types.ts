export type PersonSelectType = {
  onClose: VoidFunction;
  onSetUser: (name: string, code: string) => void;
  onSetStep: VoidFunction;
};

export type UserType = 'baptized' | 'publisher';

export type UsersOption = {
  person_uid: string;
  person_name: string;
};
