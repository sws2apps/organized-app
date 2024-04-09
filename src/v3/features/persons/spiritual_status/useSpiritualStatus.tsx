import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { personCurrentDetailsState } from '@states/persons';
import { PersontType } from '@definition/person';
import { setPersonCurrentDetails } from '@services/recoil/persons';
import { displaySnackNotification } from '@services/recoil/app';
import { IconError } from '@components/icons';
import { useAppTranslation } from '@hooks/index';

const useSpiritualStatus = () => {
  const { t } = useAppTranslation();

  const person = useRecoilValue(personCurrentDetailsState);

  const [expandedStatus, setExpandedStatus] = useState({
    baptized: false,
    unbaptized: false,
    midweek: false,
  });

  const handleToggleExpand = (status: 'baptized' | 'unbaptized' | 'midweek') => {
    setExpandedStatus((prev) => {
      const newStatuses = structuredClone(prev);

      for (const key of Object.keys(newStatuses)) {
        if (key !== status) {
          newStatuses[key] = false;
        }
      }

      newStatuses[status] = !newStatuses[status];

      return newStatuses;
    });
  };

  const handleToggleMidweekMeetingStudent = async (checked: boolean) => {
    // check if baptized publisher and abort
    if (person.baptizedPublisher.active.value) {
      await displaySnackNotification({
        header: t('tr_spiritualStatusError'),
        message: t('tr_baptizedMidweekStudentError'),
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
      return;
    }

    // check if unbaptized publisher and abort
    if (person.unbaptizedPublisher.active.value) {
      await displaySnackNotification({
        header: t('tr_spiritualStatusError'),
        message: t('tr_unBaptizedMidweekStudentError'),
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
      return;
    }

    const newPerson: PersontType = structuredClone(person);

    newPerson.midweekMeetingStudent.active.value = checked;
    newPerson.midweekMeetingStudent.active.updatedAt = new Date().toISOString();

    await setPersonCurrentDetails(newPerson);
  };

  const handleToggleUnbaptizedPublisher = async (checked: boolean) => {
    // check if baptized publisher and abort
    if (person.baptizedPublisher.active.value) {
      await displaySnackNotification({
        header: t('tr_spiritualStatusError'),
        message: t('tr_baptizedUnbaptizedError'),
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
      return;
    }

    const newPerson: PersontType = structuredClone(person);

    newPerson.unbaptizedPublisher.active.value = checked;
    newPerson.unbaptizedPublisher.active.updatedAt = new Date().toISOString();

    await setPersonCurrentDetails(newPerson);
  };

  const handleToggleBaptizedPublisher = async (checked: boolean) => {
    const newPerson: PersontType = structuredClone(person);

    newPerson.baptizedPublisher.active.value = checked;
    newPerson.baptizedPublisher.active.updatedAt = new Date().toISOString();

    await setPersonCurrentDetails(newPerson);
  };

  return {
    person,
    handleToggleMidweekMeetingStudent,
    handleToggleUnbaptizedPublisher,
    handleToggleBaptizedPublisher,
    expandedStatus,
    handleToggleExpand,
  };
};

export default useSpiritualStatus;
