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
  // Content is stored as translation keys + raw data (never pre-built English),
  // so the table and PDF render in the user's language. See @services/app/app_logs.
  //
  // Field-level diff: a translation key for the field name + raw before/after values.
  field_key?: string;
  value_before?: string;
  value_after?: string;
  // Standalone detail — either raw data (e.g. a person's name, shown verbatim) ...
  detail?: string;
  // ... or a localized message template + its interpolation params.
  detail_key?: string;
  detail_params?: Record<string, string>;
};

export type AppLogFilterType = 'all' | 'mine' | 'admins' | 'others';
