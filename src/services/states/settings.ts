// ** FOR SETTING STATE OUTSIDE REACT COMPONENTS OR TO AVOID USE OF USECALLBACK ** //

import { store } from '@states/index';
import { isDeleteDbOpenState } from '@states/app';
import { settingSchema } from '@services/dexie/schema';

export const setIsDeleteDbOpen = (value: boolean) => {
  store.set(isDeleteDbOpenState, value);
};

type CongSettings = (typeof settingSchema)['cong_settings'];

/**
 * Reliably checks if a value is a plain object ({...}).
 * Object.prototype.toString is more robust than a typeof check because
 * it correctly distinguishes arrays, null, dates, and class instances from plain objects.
 */
const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  Object.prototype.toString.call(v) === '[object Object]';

/**
 * Recursively merges a local value with schema defaults.
 * - null/undefined (e.g., from corrupted backups) → Schema default
 * - Arrays → Each local record is individually normalized against the schema
 *   template; content and order are preserved, NO index-based merge is applied
 * - Objects → Recursively processed per schema key; local extra fields are
 *   intentionally dropped (keeps the dataset schema-compliant)
 * - Primitives → Retained only if the type matches exactly
 */
const withSchemaDefaults = <T>(schema: T, local: unknown): T => {
  if (local === null || local === undefined) {
    return structuredClone(schema);
  }

  if (Array.isArray(schema)) {
    if (!Array.isArray(local) || local.length === 0) {
      return structuredClone(schema);
    }

    const template = schema.at(0);

    // No template defined in schema (should not happen):
    // Pass local records through untouched instead of guessing.
    if (template === undefined) {
      return local as T;
    }

    return local.map((record) => withSchemaDefaults(template, record)) as T;
  }

  if (isPlainObject(schema)) {
    if (!isPlainObject(local)) {
      return structuredClone(schema);
    }

    const result: Record<string, unknown> = {};

    for (const key of Object.keys(schema)) {
      result[key] = withSchemaDefaults(
        (schema as Record<string, unknown>)[key],
        local[key]
      );
    }

    return result as T;
  }

  return typeof local === typeof schema
    ? (local as T)
    : structuredClone(schema);
};

/**
 * Normalizes local cong_settings (from IndexedDB/backup) against the
 * full settingSchema before being read in pocketStartup/useSignup.
 * This prevents incomplete or corrupted local data from triggering crashes.
 */
export const withCongSettingsDefaults = (
  local?: Partial<CongSettings> | null
): CongSettings =>
  withSchemaDefaults(structuredClone(settingSchema.cong_settings), local);
