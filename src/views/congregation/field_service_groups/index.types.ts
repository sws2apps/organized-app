import { FieldServiceGroupExportType } from '@definition/field_service_groups';

export type TemplateFieldServiceGroupsProps = {
  groups: FieldServiceGroupExportType[];
  congregation: string;
  lang: string;
  orientation?: 'portrait' | 'landscape';
  fontSize?: number;
};

export type FSGGroupProps = {
  group: FieldServiceGroupExportType;
  fontSize: number;
};

export type FSGGroupMemberProps = {
  member: string;
  fontSize: number;
};
