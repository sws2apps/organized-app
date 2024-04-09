import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { personCurrentDetailsState } from '@states/persons';
import { PersontType } from '@definition/person';
import { setPersonCurrentDetails } from '@services/recoil/persons';
import { displaySnackNotification } from '@services/recoil/app';
import { IconError } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { formatDate } from '@services/dateformat';

const useSpiritualStatus = () => {
  const { t } = useAppTranslation();

  const { id } = useParams();
  const isNewPerson = id === undefined;

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

    // update previous status if checked is true
    if (checked) {
      const currentMidweek = newPerson.midweekMeetingStudent.history.find((record) => record.endDate.value === null);

      if (currentMidweek) {
        const startDate = formatDate(new Date(currentMidweek.startDate.value), 'mm/dd/yyyy');
        const nowDate = formatDate(new Date(), 'mm/dd/yyyy');

        if (startDate === nowDate) {
          if (isNewPerson) {
            newPerson.midweekMeetingStudent.history = newPerson.midweekMeetingStudent.history.filter(
              (record) => record.id !== currentMidweek.id
            );
          }

          if (!newPerson) {
            currentMidweek._deleted = new Date().toISOString();
          }
        }

        if (startDate !== nowDate) {
          currentMidweek.endDate.value = new Date().toISOString();
          currentMidweek.endDate.updatedAt = new Date().toISOString();
        }
      }

      newPerson.midweekMeetingStudent.active.value = false;
      newPerson.midweekMeetingStudent.active.updatedAt = new Date().toISOString();
    }

    newPerson.unbaptizedPublisher.active.value = checked;
    newPerson.unbaptizedPublisher.active.updatedAt = new Date().toISOString();

    if (checked) {
      const current = newPerson.unbaptizedPublisher.history.find((record) => record.endDate.value === null);

      if (!current) {
        newPerson.unbaptizedPublisher.history.push({
          id: crypto.randomUUID(),
          startDate: { value: new Date().toISOString(), updatedAt: new Date().toISOString() },
          endDate: { value: null, updatedAt: new Date().toISOString() },
          _deleted: null,
        });
      }
    }

    await setPersonCurrentDetails(newPerson);

    setExpandedStatus({ baptized: false, midweek: false, unbaptized: true });
  };

  const handleToggleBaptizedPublisher = async (checked: boolean) => {
    const newPerson: PersontType = structuredClone(person);

    // update previous status if checked is true
    if (checked) {
      const currentUnbaptized = newPerson.unbaptizedPublisher.history.find((record) => record.endDate.value === null);

      if (currentUnbaptized) {
        const startDate = formatDate(new Date(currentUnbaptized.startDate.value), 'mm/dd/yyyy');
        const nowDate = formatDate(new Date(), 'mm/dd/yyyy');

        if (startDate === nowDate) {
          if (isNewPerson) {
            newPerson.unbaptizedPublisher.history = newPerson.unbaptizedPublisher.history.filter(
              (record) => record.id !== currentUnbaptized.id
            );
          }

          if (!newPerson) {
            currentUnbaptized._deleted = new Date().toISOString();
          }
        }

        if (startDate !== nowDate) {
          currentUnbaptized.endDate.value = new Date().toISOString();
          currentUnbaptized.endDate.updatedAt = new Date().toISOString();
        }
      }

      if (newPerson.unbaptizedPublisher.active.value) {
        newPerson.unbaptizedPublisher.active.value = false;
        newPerson.unbaptizedPublisher.active.updatedAt = new Date().toISOString();
      }

      const currentMidweek = newPerson.midweekMeetingStudent.history.find((record) => record.endDate.value === null);

      if (currentMidweek) {
        const startDate = formatDate(new Date(currentMidweek.startDate.value), 'mm/dd/yyyy');
        const nowDate = formatDate(new Date(), 'mm/dd/yyyy');

        if (startDate === nowDate) {
          if (isNewPerson) {
            newPerson.midweekMeetingStudent.history = newPerson.midweekMeetingStudent.history.filter(
              (record) => record.id !== currentMidweek.id
            );
          }

          if (!newPerson) {
            currentMidweek._deleted = new Date().toISOString();
          }
        }

        if (startDate !== nowDate) {
          currentMidweek.endDate.value = new Date().toISOString();
          currentMidweek.endDate.updatedAt = new Date().toISOString();
        }
      }

      if (newPerson.midweekMeetingStudent.active.value) {
        newPerson.midweekMeetingStudent.active.value = false;
        newPerson.midweekMeetingStudent.active.updatedAt = new Date().toISOString();
      }
    }

    newPerson.baptizedPublisher.active.value = checked;
    newPerson.baptizedPublisher.active.updatedAt = new Date().toISOString();

    if (checked) {
      const current = newPerson.baptizedPublisher.history.find((record) => record.endDate.value === null);

      if (!current) {
        newPerson.baptizedPublisher.history.push({
          id: crypto.randomUUID(),
          startDate: { value: new Date().toISOString(), updatedAt: new Date().toISOString() },
          endDate: { value: null, updatedAt: new Date().toISOString() },
          _deleted: null,
        });
      }
    }

    await setPersonCurrentDetails(newPerson);

    setExpandedStatus({ midweek: false, unbaptized: false, baptized: true });
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
