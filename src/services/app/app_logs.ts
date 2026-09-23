import { format } from 'date-fns';
import {
  AppLogAction,
  AppLogEntryType,
  AppLogModule,
} from '@definition/app_logs';
import { AppRoleType, BadgeColor } from '@definition/app';

/**
 * Single source of truth for activity-log presentation.
 *
 * These helpers are pure (no React, no DB) so the on-screen table and the PDF
 * export render identical labels, colors and "Change" text from one place.
 */

/** Roles treated as "admins" by the activity-log filters. */
export const LOG_ADMIN_ROLES: AppRoleType[] = [
  'admin',
  'coordinator',
  'secretary',
];

/** Translation keys for each module's badge label. */
export const LOG_MODULE_LABEL_KEY: Record<AppLogModule, string> = {
  settings: 'tr_logAreaSettings',
  persons: 'tr_logAreaPersons',
  schedules: 'tr_logAreaSchedules',
  access: 'tr_logAreaAccess',
  reports: 'tr_logAreaReports',
  groups: 'tr_logAreaGroups',
  sync: 'tr_logAreaSync',
};

/** Translation keys for each action label. */
export const LOG_ACTION_LABEL_KEY: Record<AppLogAction, string> = {
  create: 'tr_logActionCreate',
  update: 'tr_logActionUpdate',
  delete: 'tr_logActionDelete',
  publish: 'tr_logActionPublish',
  accepted: 'tr_logActionAccepted',
  sync: 'tr_logActionSync',
};

/** Badge colors for the on-screen table (design-system Badge palette). */
export const LOG_MODULE_BADGE_COLOR: Record<AppLogModule, BadgeColor> = {
  settings: 'accent',
  persons: 'green',
  schedules: 'orange',
  access: 'red',
  reports: 'grey',
  groups: 'grey',
  sync: 'accent',
};

/** Badge colors for the PDF export (react-pdf has no CSS variables). */
export const LOG_MODULE_PDF_COLOR: Record<
  AppLogModule,
  { bg: string; text: string }
> = {
  settings: { bg: '#D5DFFD', text: '#3B4CA3' },
  persons: { bg: '#D4EDDA', text: '#1B5E20' },
  schedules: { bg: '#FFF3CD', text: '#7B4F00' },
  access: { bg: '#FDDDE0', text: '#B71C1C' },
  reports: { bg: '#E8EAF6', text: '#283593' },
  groups: { bg: '#E8EAF6', text: '#283593' },
  sync: { bg: '#D5DFFD', text: '#3B4CA3' },
};

/** Maps a top-level `cong_settings` key to a (reused) translation key. */
export const LOG_SETTING_FIELD_KEY: Record<string, string> = {
  cong_name: 'tr_congregationName',
  cong_number: 'tr_logFieldCongNumber',
  midweek_meeting: 'tr_midweekMeeting',
  weekend_meeting: 'tr_weekendMeeting',
  source_material: 'tr_sourceMaterial',
  circuit_overseer: 'tr_circuitOverseer',
};

/** Generic field label used when a specific setting key isn't mapped above. */
export const LOG_SETTING_FALLBACK_KEY = 'tr_logFieldSettings';

// Minimal translate signature — i18next's TFunction is assignable to this.
type TranslateFn = (key: string, params?: Record<string, string>) => string;

/**
 * Builds the localized "Change" text shown in the table and the PDF from the
 * entry's translation keys + raw data values.
 */
export const buildLogChangeText = (
  entry: AppLogEntryType,
  t: TranslateFn
): string => {
  const { action, value_before, value_after } = entry;
  const field = entry.field_key ? t(entry.field_key) : undefined;
  const hasDiff =
    !!field && value_before !== undefined && value_after !== undefined;

  if (action === 'update' && hasDiff) {
    return `${field}: ${value_before} → ${value_after}`;
  }

  if (action === 'publish') {
    if (hasDiff) return `${field}: ${value_before} – ${value_after}`;
    if (value_after !== undefined) {
      return field ? `${field}: ${value_after}` : value_after;
    }
  }

  if (field && value_after !== undefined) return `${field}: ${value_after}`;
  if (entry.detail_key) return t(entry.detail_key, entry.detail_params);
  return entry.detail ?? field ?? '';
};

/** Formats a log timestamp's date part using the congregation's date format. */
export const formatLogDate = (iso: string, dateFormat: string): string => {
  try {
    return format(new Date(iso), dateFormat);
  } catch {
    return iso.slice(0, 10);
  }
};

/** Formats a log timestamp's time part, honoring the 24-hour preference. */
export const formatLogTime = (iso: string, is24h: boolean): string => {
  try {
    return format(new Date(iso), is24h ? 'HH:mm:ss' : 'hh:mm:ss a');
  } catch {
    return '';
  }
};
