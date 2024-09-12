import { PersonType } from '@definition/person';

export type ActivePublishersProps = {
  onClose: VoidFunction;
};

export type GroupOption = {
  group_id: string;
  group_name: string;
  group_members: PersonType[];
};

export type GroupSelectedValue = {
  all: boolean;
  persons: string[];
};

export type SelectedOption = {
  FTS: GroupSelectedValue;
  AP: GroupSelectedValue;
  other_publishers: GroupSelectedValue;
};
