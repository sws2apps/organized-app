import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useNavigate } from 'react-router';
import {
  applicationsCountState,
  personCurrentDetailsState,
} from '@states/persons';
import { setPersonCurrentDetails } from '@services/states/persons';
import { settingsState } from '@states/settings';
import { congAccountConnectedState } from '@states/app';

const usePersons = () => {
  const navigate = useNavigate();

  const person = useAtomValue(personCurrentDetailsState);
  const settings = useAtomValue(settingsState);
  const connected = useAtomValue(congAccountConnectedState);
  const AP_count = useAtomValue(applicationsCountState);

  const show_AP = useMemo(() => {
    return connected && settings.cong_settings.data_sync.value;
  }, [settings, connected]);

  const handleAddNewPerson = async () => {
    const newPerson = structuredClone(person);
    newPerson.person_uid = crypto.randomUUID();

    setPersonCurrentDetails(newPerson);

    navigate('/persons/new');
  };

  return { handleAddNewPerson, show_AP, AP_count };
};

export default usePersons;
