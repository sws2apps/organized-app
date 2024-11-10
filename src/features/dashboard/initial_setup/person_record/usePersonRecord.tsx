import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { personSchema } from '@services/dexie/schema';
import { generateDisplayName } from '@utils/common';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { settingsState } from '@states/settings';
import { dbPersonsSave } from '@services/dexie/persons';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { apiSetUserUid } from '@services/api/congregation';

const usePersonRecord = () => {
  const { t } = useAppTranslation();

  const settings = useRecoilValue(settingsState);

  const [isProcessing, setIsProcessing] = useState(false);

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

    if (isProcessing) return;

    try {
      setIsProcessing(true);

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

      await apiSetUserUid(person.person_uid);

      await dbPersonsSave(person, true);

      await dbAppSettingsUpdate({
        'cong_settings.cong_new': false,
        'user_settings.user_local_uid': person.person_uid,
      });

      setIsProcessing(false);
    } catch (err) {
      setIsProcessing(false);

      console.error(err);

      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(err.message),
        severity: 'error',
      });
    }
  };

  return {
    handleSavePerson,
    firstname,
    lastname,
    handleFirstnameChange,
    handleLastnameChange,
    isProcessing,
  };
};

export default usePersonRecord;
