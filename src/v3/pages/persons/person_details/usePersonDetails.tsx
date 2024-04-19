import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { personCurrentDetailsState, personsActiveState } from '@states/persons';
import { personsStateFind, setPersonCurrentDetails } from '@services/recoil/persons';
import { personSchema } from '@services/dexie/schema';

const usePersonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isNewPerson = id === undefined;

  const person = useRecoilValue(personCurrentDetailsState);
  const persons = useRecoilValue(personsActiveState);

  const isBaptized = person.baptizedPublisher.active.value;
  const isMale = person.isMale.value;

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
      await setPersonCurrentDetails(personSchema);
    };

    handleLoad();
  }, []);

  return { isNewPerson, isBaptized, isMale };
};

export default usePersonDetails;
