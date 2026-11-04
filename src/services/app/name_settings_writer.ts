import { UpdateSpec } from 'dexie';
import {
  FullnameOption,
  NameFormatSelection,
  PrintNameContext,
  SettingsType,
} from '@definition/settings';
import { updatePrintNameRecords } from '@utils/name_format';
import { generateDisplayName } from '@utils/common';

export type NameFormatChange = {
  field: 'fullname_option' | 'print_fullname_option';
  view: string;
  context?: PrintNameContext;
  selection: NameFormatSelection;
};

export type CONameField =
  | 'firstname'
  | 'middlename'
  | 'lastname'
  | 'display_name';
export const createNameSettingsWriter = (
  dbAppSettingsGet: () => Promise<SettingsType | undefined>,
  dbAppSettingsUpdate: (changes: UpdateSpec<SettingsType>) => Promise<void>
) => {
  // Read after the preceding write so rapid edits cannot replace another context.
  let pending = Promise.resolve();
  const enqueue = (save: () => Promise<void>) => {
    const result = pending.then(save);
    pending = result.catch(() => undefined);
    return result;
  };

  const saveNameFormat = ({
    field,
    view,
    context,
    selection,
  }: NameFormatChange) =>
    enqueue(async () => {
      const settings = await dbAppSettingsGet();
      if (!settings) throw new Error('Settings not found');
      const updatedAt = new Date().toISOString();
      if (field === 'print_fullname_option' && context) {
        await dbAppSettingsUpdate({
          'cong_settings.print_fullname_option': updatePrintNameRecords(
            settings.cong_settings.print_fullname_option,
            view,
            context,
            selection,
            updatedAt
          ),
        });
        return;
      }
      if (
        field !== 'fullname_option' ||
        typeof selection !== 'number' ||
        !Object.values(FullnameOption).includes(selection)
      )
        return;
      const records = structuredClone(settings.cong_settings.fullname_option);
      const current = records.find((record) => record.type === view);
      if (current)
        Object.assign(current, {
          value: selection,
          updatedAt,
          _deleted: false,
        });
      else
        records.push({
          type: view,
          value: selection,
          updatedAt,
          _deleted: false,
        });
      await dbAppSettingsUpdate({ 'cong_settings.fullname_option': records });
    });

  const saveCOName = (field: CONameField, value: string) =>
    enqueue(async () => {
      const settings = await dbAppSettingsGet();
      if (!settings) throw new Error('Settings not found');
      const co = settings.cong_settings.circuit_overseer;
      const updatedAt = new Date().toISOString();
      const changes: UpdateSpec<SettingsType> = {};
      const path = `cong_settings.circuit_overseer.${field}` as const;
      changes[path] = { value, updatedAt };
      if (field === 'firstname' || field === 'lastname') {
        changes['cong_settings.circuit_overseer.display_name'] = {
          value: generateDisplayName(
            field === 'lastname' ? value : co.lastname.value,
            field === 'firstname' ? value : co.firstname.value
          ),
          updatedAt,
        };
      }
      await dbAppSettingsUpdate(changes);
    });

  return { saveNameFormat, saveCOName };
};
