import { AppRoleType } from './app';

export type AppLogModule =
  | 'settings'
  | 'persons'
  | 'schedules'
  | 'access'
  | 'reports'
  | 'groups'
  | 'sync';

export type AppLogAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'publish'
  | 'accepted'
  | 'sync';

export type AppLogEntryType = {
  id: string;
  updatedAt: string;
  actor_uid: string;
  actor_name: string;
  actor_roles: AppRoleType[];
  module: AppLogModule;
  action: AppLogAction;
  entity_type: string;
  entity_id?: string;
  description: string;
  // Optional diff fields — used to render "before → after" for update events
  field_label?: string;
  value_before?: string;
  value_after?: string;
};

export type AppLogFilterType = 'all' | 'mine' | 'admins' | 'others';
