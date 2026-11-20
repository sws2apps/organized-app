import { useEffect, useRef, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  displayNameMeetingsEnableState,
  settingsState,
} from '@states/settings';
import { coNameChangeState } from '@states/name_settings';
import { CONameField } from '@services/app/name_settings';
import { generateDisplayName } from '@utils/common';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';

const useCircuitOverseer = () => {
  const settings = useAtomValue(settingsState);
  const co = settings.cong_settings.circuit_overseer;
  const displayNameEnabled = useAtomValue(displayNameMeetingsEnableState);
  const save = useSetAtom(coNameChangeState);
  const [draft, setDraft] = useState({
    firstname: co.firstname.value,
    middlename: co.middlename?.value ?? '',
    lastname: co.lastname.value,
    display_name: co.display_name.value,
  });
  const latest = useRef(draft);
  const pending = useRef(new Map<CONameField, string>());

  useEffect(() => {
    setDraft((previous) => {
      const next = { ...previous };
      for (const field of [
        'firstname',
        'middlename',
        'lastname',
        'display_name',
      ] as const) {
        const value = co[field]?.value ?? '';
        if (pending.current.get(field) === value) pending.current.delete(field);
        if (!pending.current.has(field)) next[field] = value;
      }
      latest.current = next;
      return next;
    });
  }, [co]);

  const change = async (field: CONameField, value: string) => {
    const next = { ...latest.current, [field]: value };
    pending.current.set(field, value);
    if (field === 'firstname' || field === 'lastname') {
      next.display_name = generateDisplayName(next.lastname, next.firstname);
      pending.current.set('display_name', next.display_name);
    }
    latest.current = next;
    setDraft(next);
    try {
      await save({ field, value });
    } catch {
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode('error_app_name-save'),
        severity: 'error',
      });
    }
  };
  return {
    displayNameEnabled,
    firstname: draft.firstname,
    middlename: draft.middlename,
    lastname: draft.lastname,
    displayname: draft.display_name,
    handleFirstnameChange: (value: string) => change('firstname', value),
    handleMiddlenameChange: (value: string) => change('middlename', value),
    handleLastnameChange: (value: string) => change('lastname', value),
    handleDisplaynameChange: (value: string) => change('display_name', value),
  };
};
export default useCircuitOverseer;
