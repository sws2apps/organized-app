import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAtom, useAtomValue } from 'jotai';
import { personCurrentDetailsState, personsState } from '@states/persons';
import { personSchema } from '@services/dexie/schema';
import { congAccountConnectedState } from '@states/app';

const usePersonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isNewPerson = id === undefined;

  const [person, setPerson] = useAtom(personCurrentDetailsState);

  const persons = useAtomValue(personsState);
  const isConnected = useAtomValue(congAccountConnectedState);

  const isBaptized = useMemo(() => {
    return person.person_data.publisher_baptized.active.value;
  }, [person]);

  const male = useMemo(() => {
    return person.person_data.male.value;
  }, [person]);

  useEffect(() => {
    if (isNewPerson) {
      const newSchema = structuredClone(personSchema);
      newSchema.person_uid = crypto.randomUUID();

      setPerson(newSchema);
    }

    if (!isNewPerson) {
      const foundPerson = persons.find((record) => record.person_uid === id);

      if (foundPerson) {
        setPerson(foundPerson);
      }

      if (!foundPerson) {
        navigate('/persons');
      }
    }
  }, [id, persons, navigate, isNewPerson, setPerson]);

  return { isNewPerson, isBaptized, male, isConnected };
};

export default usePersonDetails;
