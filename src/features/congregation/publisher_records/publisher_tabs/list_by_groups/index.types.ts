import { PersonType } from '@definition/person';

export type ListByGroupsProps = {
  type: 'active' | 'inactive';
};

export type GroupOption = {
  group_id: string;
  group_name: string;
  group_members: PersonType[];
};
