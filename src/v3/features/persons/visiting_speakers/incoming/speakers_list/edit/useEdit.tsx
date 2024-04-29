import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { displayNameEnableState, fullnameOptionState } from '@states/settings';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { dbVistingSpeakersUpdate } from '@services/dexie/visiting_speakers';

const useEdit = (speaker: VisitingSpeakerType) => {
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const displayNameEnabled = useRecoilValue(displayNameEnableState);

  const [firstname, setFirstname] = useState(speaker.person_firstname.value);
  const [lastname, setLastname] = useState(speaker.person_lastname.value);
  const [email, setEmail] = useState(speaker.person_email.value);
  const [phone, setPhone] = useState(speaker.person_lastname.value);
  const [note, setNote] = useState(speaker.person_lastname.value);

  const speakerGender = speaker.elder.value ? 'elder' : speaker.ministerial_servant.value ? 'ms' : '';

  const handleFirstnameChange = async (value: string) => {
    setFirstname(value);

    await dbVistingSpeakersUpdate(
      { person_firstname: { value: value, updatedAt: new Date().toISOString() } },
      speaker.person_uid
    );
  };

  const handleLastnameChange = async (value: string) => {
    setLastname(value);

    await dbVistingSpeakersUpdate(
      { person_lastname: { value: value, updatedAt: new Date().toISOString() } },
      speaker.person_uid
    );
  };

  const handleToggleGender = async (value: string) => {
    if (value === 'elder') {
      await dbVistingSpeakersUpdate(
        {
          elder: { value: true, updatedAt: new Date().toISOString() },
          ministerial_servant: { value: false, updatedAt: new Date().toISOString() },
        },
        speaker.person_uid
      );
    }

    if (value === 'ms') {
      await dbVistingSpeakersUpdate(
        {
          elder: { value: false, updatedAt: new Date().toISOString() },
          ministerial_servant: { value: true, updatedAt: new Date().toISOString() },
        },
        speaker.person_uid
      );
    }
  };

  return {
    fullnameOption,
    displayNameEnabled,
    handleFirstnameChange,
    firstname,
    handleLastnameChange,
    lastname,
    handleToggleGender,
    speakerGender,
  };
};

export default useEdit;
