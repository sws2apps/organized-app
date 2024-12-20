import {
  FieldServiceGroupMemberType,
  FieldServiceGroupType,
} from '@definition/field_service_groups';
import { PersonType } from '@definition/person';
import { FullnameOption } from '@definition/settings';

export type FieldServiceGroupsDocType = {
  fieldServiceGroups: FieldServiceGroupType[];
  persons: PersonType[];
  fullnameOption: FullnameOption;
  congregationName: string;
};

export type FSGTitleType = {
  congregationName: string;
};

export type FSGGroupType = {
  data: FieldServiceGroupType;
  groupNumber: number;
  persons: PersonType[];
  fullnameOption: FullnameOption;
};

export type FSGGroupMemberType = {
  data: FieldServiceGroupMemberType;
  persons: PersonType[];
  fullnameOption: FullnameOption;
};
