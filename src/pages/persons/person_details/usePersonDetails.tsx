import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { personCurrentDetailsState, personsActiveState } from '@states/persons';
import {
  personsStateFind,
  setPersonCurrentDetails,
} from '@services/recoil/persons';
import { personSchema } from '@services/dexie/schema';

const usePersonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isNewPerson = id === undefined;

  const person = useRecoilValue(personCurrentDetailsState);
  const persons = useRecoilValue(personsActiveState);

  const isBaptized = useMemo(() => {
    return person.person_data.publisher_baptized.active.value;
  }, [person]);

  const male = useMemo(() => {
    return person.person_data.male.value;
  }, [person]);

  useEffect(() => {
    const handleCheckPerson = async () => {
      if (!isNewPerson) {
        const foundPerson = await personsStateFind(id);

        if (foundPerson) {
          await setPersonCurrentDetails(foundPerson);
        }

        if (!foundPerson) {
          navigate('/persons');
        }
      }
    };

    handleCheckPerson();
  }, [id, persons, navigate, isNewPerson]);

  useEffect(() => {
    const handleLoad = async () => {
      const newSchema = structuredClone(personSchema);
      newSchema.person_uid = crypto.randomUUID();

      await setPersonCurrentDetails(newSchema);
    };

    handleLoad();
  }, []);

  return { isNewPerson, isBaptized, male };
};

export default usePersonDetails;
