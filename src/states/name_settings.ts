import { atom } from 'jotai';
import {
  CONameField,
  NameFormatChange,
  saveCOName,
  saveNameFormat,
} from '@services/app/name_settings';
export const nameFormatChangeState = atom(
  null,
  async (_get, _set, change: NameFormatChange) => saveNameFormat(change)
);
export const coNameChangeState = atom(
  null,
  async (_get, _set, change: { field: CONameField; value: string }) =>
    saveCOName(change.field, change.value)
);
