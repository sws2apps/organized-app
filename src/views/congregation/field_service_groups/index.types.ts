import { FieldServiceGroupExportType } from '@definition/field_service_groups';

export type FSGPageOrientation = 'portrait' | 'landscape';

export type FSGColumn = {
  id: string;
  publishers: string[];
};

export type FSGCard = {
  id: string;
  group: FieldServiceGroupExportType;
  span: number;
  columns: FSGColumn[];
  height: number;
  membersCount: number;
};

export type FSGPlacement = {
  card: FSGCard;
  left: number;
  top: number;
};

export type TemplateFieldServiceGroupsProps = {
  groups: FieldServiceGroupExportType[];
  congregation: string;
  lang: string;
  orientation?: FSGPageOrientation;
  fontSize?: number;
};

export type FSGGroupProps = {
  card: FSGCard;
  fontSize: number;
};

export type FSGGroupMemberProps = {
  member: string;
  fontSize: number;
};
