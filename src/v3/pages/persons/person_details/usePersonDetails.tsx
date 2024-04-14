import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { IconCheckCircle, IconError } from '@components/icons';
import { personCurrentDetailsState, personsActiveState } from '@states/persons';
import { useAppTranslation } from '@hooks/index';
import { displaySnackNotification } from '@services/recoil/app';
import { useEffect } from 'react';
import { dbPersonsSave } from '@services/dexie/persons';

const usePersonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { t } = useAppTranslation();

  const isNewPerson = id === undefined;

  const [person, setPerson] = useRecoilState(personCurrentDetailsState);
  const resetPersonNew = useResetRecoilState(personCurrentDetailsState);
  const persons = useRecoilValue(personsActiveState);

  const isBaptized = person.baptizedPublisher.active.value;
  const isMale = person.isMale.value;

  const handleSavePerson = async () => {
    try {
      await dbPersonsSave(person);
      resetPersonNew();

      navigate('/persons');

      if (isNewPerson) {
        await displaySnackNotification({
          header: t('tr_personAdded'),
          message: t('tr_personAddedDesc'),
          severity: 'success',
          icon: <IconCheckCircle color="var(--white)" />,
        });
      }

      if (!isNewPerson) {
        await displaySnackNotification({
          header: t('tr_personSaved'),
          message: t('tr_personSavedDesc'),
          severity: 'success',
          icon: <IconCheckCircle color="var(--white)" />,
        });
      }
    } catch (error) {
      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: error.message,
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
    }
  };

  useEffect(() => {
    const foundPerson = persons.find((record) => record.person_uid === id);

    if (foundPerson) {
      setPerson(foundPerson);
    }

    if (!foundPerson) {
      navigate('/persons');
    }
  }, [id, persons, navigate, setPerson]);

  return { isNewPerson, isBaptized, isMale, handleSavePerson };
};

export default usePersonDetails;
