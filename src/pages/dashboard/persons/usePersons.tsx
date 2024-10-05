import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import {
  applicationsCountState,
  personCurrentDetailsState,
} from '@states/persons';
import { setPersonCurrentDetails } from '@services/recoil/persons';
import { settingsState } from '@states/settings';
import { congAccountConnectedState } from '@states/app';

const usePersons = () => {
  const navigate = useNavigate();

  const person = useRecoilValue(personCurrentDetailsState);
  const settings = useRecoilValue(settingsState);
  const connected = useRecoilValue(congAccountConnectedState);
  const AP_count = useRecoilValue(applicationsCountState);

  const show_AP = useMemo(() => {
    return connected && settings.cong_settings.data_sync.value;
  }, [settings, connected]);

  const handleAddNewPerson = async () => {
    const newPerson = structuredClone(person);
    newPerson.person_uid = crypto.randomUUID();

    await setPersonCurrentDetails(newPerson);

    navigate('/persons/new');
  };

  return { handleAddNewPerson, show_AP, AP_count };
};

export default usePersons;
