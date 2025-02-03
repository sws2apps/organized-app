import { AppRoleType } from '@definition/app';

export type AcceptRequestProps = {
  onConfirm: (person_uid: string, roles: AppRoleType[]) => void;
  isLoading: boolean;
  fullname: string;
  userId: string;
};

export type UsersOption = {
  person_uid: string;
  person_name: string;
};
