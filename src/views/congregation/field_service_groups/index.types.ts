import { FieldServiceGroupExportType } from '@definition/field_service_groups';

export type TemplateFieldServiceGroupsProps = {
  groups: FieldServiceGroupExportType[];
  congregation: string;
  lang: string;
};

export type FSGGroupProps = {
  group: FieldServiceGroupExportType;
};

export type FSGGroupMemberProps = {
  member: string;
};
