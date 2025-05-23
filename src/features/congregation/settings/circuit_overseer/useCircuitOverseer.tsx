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
  const timer = useRef<NodeJS.Timeout>();

  const settings = useAtomValue(settingsState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const displayNameEnabled = useAtomValue(displayNameMeetingsEnableState);

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [displayname, setDisplayname] = useState('');

  const handleFirstnameChange = (value: string) => {
    setFirstname(value);

    const dispName = generateDisplayName(lastname, value);
    setDisplayname(dispName);
  };

  const handleLastnameChange = (value: string) => {
    setLastname(value);

    const dispName = generateDisplayName(value, firstname);
    setDisplayname(dispName);
  };

  const handleDisplaynameChange = (value: string) => setDisplayname(value);

  const handleFirstnameSave = () => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(handleFirstnameSaveDb, 1000);
  };

  const handleLastnameSave = () => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(handleLastnameSaveDb, 1000);
  };

  const handleDisplaynameSave = () => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(handleDisplaynameSaveDb, 1000);
  };

  const handleFirstnameSaveDb = async () => {
    const circuitOverseer = structuredClone(
      settings.cong_settings.circuit_overseer
    );

    circuitOverseer.firstname.value = firstname;
    circuitOverseer.firstname.updatedAt = new Date().toISOString();

    circuitOverseer.display_name.value = displayname;
    circuitOverseer.display_name.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.circuit_overseer': circuitOverseer,
    });
  };

  const handleLastnameSaveDb = async () => {
    const circuitOverseer = structuredClone(
      settings.cong_settings.circuit_overseer
    );

    circuitOverseer.lastname.value = lastname;
    circuitOverseer.lastname.updatedAt = new Date().toISOString();

    circuitOverseer.display_name.value = displayname;
    circuitOverseer.display_name.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.circuit_overseer': circuitOverseer,
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

    setFirstname(co.firstname.value);
    setLastname(co.lastname.value);
    setDisplayname(co.display_name.value);
  }, [settings]);

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
