import { useEffect, useRef } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { UserBibleStudyType } from '@definition/user_bible_studies';
import { userBibleStudySchema } from '@services/dexie/schema';
import { dbUserBibleStudySave } from '@services/dexie/user_bible_studies';
import {
  bibleStudyEditorOpenState,
  currentBibleStudyState,
} from '@states/user_bible_studies';

const useBibleStudy = () => {
  const nameRef = useRef<HTMLInputElement>(null);

  const setOpenEditor = useSetAtom(bibleStudyEditorOpenState);

  const bibleStudy = useAtomValue(currentBibleStudyState);

  const handleCloseEditor = () => setOpenEditor(false);

  const handleSave = async () => {
    const nameInput = nameRef.current;

    if (nameInput?.value.length === 0) return;

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
        person_name: nameInput.value,
        updatedAt: new Date().toISOString(),
      };

      await dbUserBibleStudySave(record);

      setOpenEditor(false);
    } catch (error) {
      console.error(error);

      setOpenEditor(false);

      displaySnackNotification({
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

      setOpenEditor(false);
    } catch (error) {
      console.error(error);

      setOpenEditor(false);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    if (bibleStudy && nameRef.current) {
      nameRef.current.value = bibleStudy.person_data.person_name;
    }
  }, [bibleStudy]);

  return { nameRef, handleSave, bibleStudy, handleCloseEditor, handleDelete };
};

export default useBibleStudy;
