import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { displaySnackNotification } from '@services/states/app';
import { fullnameOptionState } from '@states/settings';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { buildPersonFullname } from '@utils/common';
import { dbVisitingSpeakersDelete } from '@services/dexie/visiting_speakers';

const useSpeakerRowEdit = (speaker: VisitingSpeakerType) => {
  const { t } = useAppTranslation();

  const fullnameOption = useAtomValue(fullnameOptionState);

  const name = buildPersonFullname(
    speaker.speaker_data.person_lastname.value,
    speaker.speaker_data.person_firstname.value,
    fullnameOption
  );

  const note = speaker.speaker_data.person_notes.value;

  const talks = speaker.speaker_data.talks
    .filter((record) => record._deleted === false)
    .map((record) => record.talk_number)
    .join(', ');

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const handleOpenConfirmDelete = () => setConfirmDeleteOpen(true);

  const handleCloseConfirmDelete = () => setConfirmDeleteOpen(false);

  const handleDeleteSpeaker = async () => {
    try {
      await dbVisitingSpeakersDelete(speaker.person_uid);

      setConfirmDeleteOpen(false);
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        severity: 'error',
        header: t('error_app_generic-title'),
        message: (error as Error).message,
      });
    }
  };

  return {
    name,
    note,
    talks,
    confirmDeleteOpen,
    handleOpenConfirmDelete,
    handleCloseConfirmDelete,
    handleDeleteSpeaker,
  };
};

export default useSpeakerRowEdit;
