import { useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { fullnameOptionState, settingsState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

type FieldKey = 'wife_firstname' | 'wife_lastname';

const useCOWife = () => {
  const settings = useAtomValue(settingsState);
  const fullnameOption = useAtomValue(fullnameOptionState);

  const timers = useRef<Partial<Record<FieldKey, NodeJS.Timeout>>>({});

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

  const co = settings.cong_settings.circuit_overseer;

  const scheduleSave = (key: FieldKey, value: string) => {
    clearTimeout(timers.current[key]);

    timers.current[key] = setTimeout(async () => {
      timers.current[key] = undefined;

      const field = { value, updatedAt: new Date().toISOString() };

      await dbAppSettingsUpdate(
        key === 'wife_firstname'
          ? { 'cong_settings.circuit_overseer.wife_firstname': field }
          : { 'cong_settings.circuit_overseer.wife_lastname': field }
      );
    }, 1000);
  };

  const handleFirstnameChange = (value: string) => {
    setFirstname(value);
    scheduleSave('wife_firstname', value);
  };

  const handleLastnameChange = (value: string) => {
    setLastname(value);
    scheduleSave('wife_lastname', value);
  };

  useEffect(() => {
    if (!timers.current.wife_firstname) {
      setFirstname(co.wife_firstname?.value ?? '');
    }

    if (!timers.current.wife_lastname) {
      setLastname(co.wife_lastname?.value ?? '');
    }
  }, [co.wife_firstname, co.wife_lastname]);

  return {
    fullnameOption,
    firstname,
    lastname,
    handleFirstnameChange,
    handleLastnameChange,
  };
};

export default useCOWife;
