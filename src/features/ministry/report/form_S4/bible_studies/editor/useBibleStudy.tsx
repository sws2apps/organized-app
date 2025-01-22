import { useEffect, useState } from 'react';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { UserBibleStudyType } from '@definition/user_bible_studies';
import { userBibleStudySchema } from '@services/dexie/schema';
import { dbUserBibleStudySave } from '@services/dexie/user_bible_studies';
import { BibleStudyEditorProps } from './index.types';

const useBibleStudy = ({ bibleStudy, onClose }: BibleStudyEditorProps) => {
  const [value, setValue] = useState('');

  const handleChange = (value: string) => setValue(value);

  const handleSave = async () => {
    if (value.length === 0) return;

    try {
      let record: UserBibleStudyType;

      if (bibleStudy) {
        record = structuredClone(bibleStudy);
      }

      if (!bibleStudy) {
        record = structuredClone(userBibleStudySchema);
        record.person_uid = crypto.randomUUID();
      }

      record.person_data = {
        _deleted: false,
        person_name: value,
        updatedAt: new Date().toISOString(),
      };

      await dbUserBibleStudySave(record);

      onClose();
    } catch (error) {
      console.error(error);

      onClose();

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleDelete = async () => {
    try {
      const record = structuredClone(bibleStudy);

      record.person_data._deleted = true;
      record.person_data.updatedAt = new Date().toISOString();

      await dbUserBibleStudySave(record);

      onClose();
    } catch (error) {
      console.error(error);

      onClose();

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    if (bibleStudy) {
      setValue(bibleStudy.person_data.person_name);
    }
  }, [bibleStudy]);

  return { value, handleSave, bibleStudy, handleDelete, handleChange };
};

export default useBibleStudy;
