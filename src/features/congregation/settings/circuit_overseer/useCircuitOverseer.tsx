import { useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  displayNameMeetingsEnableState,
  fullnameOptionState,
  settingsState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { generateDisplayName } from '@utils/common';

const useCircuitOverseer = () => {
  type FieldKey = 'firstname' | 'lastname' | 'displayname';

  const saveTimers = useRef<Partial<Record<FieldKey, ReturnType<typeof setTimeout>>>>({});

  const settings = useAtomValue(settingsState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const displayNameEnabled = useAtomValue(displayNameMeetingsEnableState);

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [displayname, setDisplayname] = useState('');
  const [editing, setEditing] = useState<Record<FieldKey, boolean>>({
    firstname: false,
    lastname: false,
    displayname: false,
  });

  const clearTimer = (key: FieldKey) => {
    const timer = saveTimers.current[key];
    if (timer) {
      clearTimeout(timer);
      saveTimers.current[key] = undefined;
    }
  };

  const scheduleSave = (key: FieldKey, fn: () => Promise<void>, markCompleteKeys: FieldKey[]) => {
    clearTimer(key);

    saveTimers.current[key] = setTimeout(async () => {
      saveTimers.current[key] = undefined;
      await fn();
      setEditing((prev) => {
        const next = { ...prev };
        for (const field of markCompleteKeys) {
          next[field] = false;
        }
        return next;
      });
    }, 1000);
  };

  const markEditing = (keys: FieldKey[]) => {
    setEditing((prev) => {
      const next = { ...prev };
      for (const field of keys) {
        next[field] = true;
      }
      return next;
    });
  };

  const handleFirstnameChange = (value: string) => {
    markEditing(['firstname', 'displayname']);
    setFirstname(value);

    const dispName = generateDisplayName(lastname, value);
    setDisplayname(dispName);
  };

  const handleLastnameChange = (value: string) => {
    markEditing(['lastname', 'displayname']);
    setLastname(value);

    const dispName = generateDisplayName(value, firstname);
    setDisplayname(dispName);
  };

  const handleDisplaynameChange = (value: string) => {
    markEditing(['displayname']);
    setDisplayname(value);
  };

  const handleFirstnameSave = () => {
    scheduleSave('firstname', handleFirstnameSaveDb, ['firstname', 'displayname']);
  };

  const handleLastnameSave = () => {
    scheduleSave('lastname', handleLastnameSaveDb, ['lastname', 'displayname']);
  };

  const handleDisplaynameSave = () => {
    scheduleSave('displayname', handleDisplaynameSaveDb, ['displayname']);
  };

  const handleFirstnameSaveDb = async () => {
    const firstnameField = structuredClone(
      settings.cong_settings.circuit_overseer.firstname
    );
    const displayNameField = structuredClone(
      settings.cong_settings.circuit_overseer.display_name
    );

    firstnameField.value = firstname;
    firstnameField.updatedAt = new Date().toISOString();

    displayNameField.value = displayname;
    displayNameField.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.circuit_overseer.firstname': firstnameField,
      'cong_settings.circuit_overseer.display_name': displayNameField,
    });
  };

  const handleLastnameSaveDb = async () => {
    const lastnameField = structuredClone(
      settings.cong_settings.circuit_overseer.lastname
    );
    const displayNameField = structuredClone(
      settings.cong_settings.circuit_overseer.display_name
    );

    lastnameField.value = lastname;
    lastnameField.updatedAt = new Date().toISOString();

    displayNameField.value = displayname;
    displayNameField.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.circuit_overseer.lastname': lastnameField,
      'cong_settings.circuit_overseer.display_name': displayNameField,
    });
  };

  const handleDisplaynameSaveDb = async () => {
    const coName = structuredClone(
      settings.cong_settings.circuit_overseer.display_name
    );

    coName.value = displayname;
    coName.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.circuit_overseer.display_name': coName,
    });
  };

  useEffect(() => {
    const co = settings.cong_settings.circuit_overseer;

    setFirstname((prev) => (editing.firstname ? prev : co.firstname.value));
    setLastname((prev) => (editing.lastname ? prev : co.lastname.value));
    setDisplayname((prev) => (editing.displayname ? prev : co.display_name.value));
  }, [settings, editing]);

  useEffect(() => {
    const timersOnUnmount = saveTimers.current;

    return () => {
      (Object.keys(timersOnUnmount) as FieldKey[]).forEach((key) => {
        const timer = timersOnUnmount[key];
        if (timer) {
          clearTimeout(timer);
        }
      });
    };
  }, []);

  return {
    fullnameOption,
    displayNameEnabled,
    firstname,
    handleFirstnameChange,
    handleFirstnameSave,
    lastname,
    handleLastnameChange,
    handleLastnameSave,
    displayname,
    handleDisplaynameChange,
    handleDisplaynameSave,
  };
};

export default useCircuitOverseer;
