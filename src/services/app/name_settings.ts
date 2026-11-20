import {
  dbAppSettingsGet,
  dbAppSettingsUpdate,
} from '@services/dexie/settings';
import { createNameSettingsWriter } from '@services/app/name_settings_writer';
export type {
  CONameField,
  NameFormatChange,
} from '@services/app/name_settings_writer';
export const { saveNameFormat, saveCOName } = createNameSettingsWriter(
  dbAppSettingsGet,
  dbAppSettingsUpdate
);
