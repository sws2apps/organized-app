import { FieldServiceGroupExportType } from '@definition/field_service_groups';

export type TemplateFieldServiceGroupsType = {
  groups: FieldServiceGroupExportType[];
  congregation: string;
};

export type PageHeaderType = {
  congregation: string;
};

export type FSGGroupType = {
  group: FieldServiceGroupExportType;
};

export type FSGGroupMemberType = {
  member: string;
};
