import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { personSchema } from '@services/dexie/schema';
import { generateDisplayName } from '@utils/common';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { settingsState } from '@states/settings';
import { dbPersonsSave } from '@services/dexie/persons';

const usePersonRecord = () => {
  const settings = useRecoilValue(settingsState);

  const [firstname, setFirstname] = useState(
    settings.user_settings.firstname.value
  );
  const [lastname, setLastname] = useState(
    settings.user_settings.lastname.value
  );

  const handleFirstnameChange = (value: string) => setFirstname(value);

  const handleLastnameChange = (value: string) => setLastname(value);

  const handleSavePerson = async () => {
    if (firstname.length === 0 && lastname.length === 0) return;

    const dispname = generateDisplayName(lastname, firstname);

    const person = structuredClone(personSchema);

    person.person_uid = crypto.randomUUID();

    person.person_data.person_firstname = {
      value: firstname,
      updatedAt: new Date().toISOString(),
    };

    person.person_data.person_lastname = {
      value: lastname,
      updatedAt: new Date().toISOString(),
    };

    person.person_data.person_display_name = {
      value: dispname,
      updatedAt: new Date().toISOString(),
    };

    await dbPersonsSave(person, true);

    await dbAppSettingsUpdate({
      'cong_settings.cong_new': false,
      'user_settings.user_local_uid': person.person_uid,
    });
  };

  return {
    handleSavePerson,
    firstname,
    lastname,
    handleFirstnameChange,
    handleLastnameChange,
  };
};

export default usePersonRecord;
