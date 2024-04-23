import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { IconCheckCircle, IconError } from '@components/icons';
import { personCurrentDetailsState } from '@states/persons';
import { useAppTranslation } from '@hooks/index';
import { displaySnackNotification } from '@services/recoil/app';
import { dbPersonsSave } from '@services/dexie/persons';
import { personAssignmentsRemove } from '@services/app/persons';

const useButtonActions = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { t } = useAppTranslation();

  const isNewPerson = id === undefined;

  const resetPersonNew = useResetRecoilState(personCurrentDetailsState);
  const person = useRecoilValue(personCurrentDetailsState);

  const isPersonDisqualified = person.isDisqualified.value;
  const isPersonArchived = person.isArchived.value;

  const [isDisqualify, setIsDisqualify] = useState(false);
  const [isQualify, setIsQualify] = useState(false);

  const handleDisqualify = () => setIsDisqualify(true);

  const handleDisqualifyCancel = () => setIsDisqualify(false);

  const handleQualify = () => setIsQualify(true);

  const handleQualifyCancel = () => setIsQualify(false);

  const handleSavePerson = async () => {
    try {
      await dbPersonsSave(person, isNewPerson);
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

  const handleDisqualifyConfirm = async () => {
    try {
      const newPerson = structuredClone(person);
      newPerson.isDisqualified = { value: true, updatedAt: new Date().toISOString() };
      personAssignmentsRemove(newPerson);

      await dbPersonsSave(newPerson);
      resetPersonNew();

      navigate('/persons');
    } catch (error) {
      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: error.message,
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
    }
  };

  const handleQualifyConfirm = async () => {
    try {
      const newPerson = structuredClone(person);
      newPerson.isDisqualified = { value: false, updatedAt: new Date().toISOString() };
      await dbPersonsSave(newPerson);
      setIsQualify(false);
    } catch (error) {
      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: error.message,
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
    }
  };

  return {
    handleSavePerson,
    handleDisqualifyConfirm,
    isNewPerson,
    isDisqualify,
    handleDisqualify,
    handleDisqualifyCancel,
    isPersonDisqualified,
    handleQualifyConfirm,
    handleQualify,
    handleQualifyCancel,
    isQualify,
    isPersonArchived,
  };
};

export default useButtonActions;
