import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { personCurrentDetailsState } from '@states/persons';
import { PersonType } from '@definition/person';
import { setPersonCurrentDetails } from '@services/recoil/persons';
import { displaySnackNotification } from '@services/recoil/app';
import { IconError } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { formatDate } from '@services/dateformat';
import { dateFirstDayMonth } from '@utils/date';
import { personArchive, personUnarchive } from '@services/app/persons';

const useSpiritualStatus = () => {
  const { t } = useAppTranslation();

  const { id } = useParams();
  const isAddPerson = id === undefined;

  const person = useRecoilValue(personCurrentDetailsState);

  const [expandedStatus, setExpandedStatus] = useState({
    baptized: person.baptizedPublisher.active.value,
    unbaptized: person.unbaptizedPublisher.active.value,
    midweek: person.midweekMeetingStudent.active.value,
  });

  const handleToggleArchive = async () => {
    const newPerson: PersonType = structuredClone(person);

    const isArchived = newPerson.isArchived.value;

    // UNARCHIVE PERSON
    if (isArchived) {
      personUnarchive(newPerson);
    }

    // ARCHIVE PERSON
    if (!isArchived) {
      personArchive(newPerson, isAddPerson);
    }

    await setPersonCurrentDetails(newPerson);
  };

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

    const newPerson: PersonType = structuredClone(person);

    newPerson.midweekMeetingStudent.active.value = checked;
    newPerson.midweekMeetingStudent.active.updatedAt = new Date().toISOString();

    if (checked) {
      const current = newPerson.midweekMeetingStudent.history.find((record) => record.endDate.value === null);

      if (!current) {
        newPerson.midweekMeetingStudent.history.push({
          id: crypto.randomUUID(),
          startDate: { value: new Date().toISOString(), updatedAt: new Date().toISOString() },
          endDate: { value: null, updatedAt: new Date().toISOString() },
          _deleted: null,
        });
      }
    }

    if (!checked) {
      const current = newPerson.midweekMeetingStudent.history.find((record) => record.endDate.value === null);

      if (current && isAddPerson) {
        newPerson.midweekMeetingStudent.history = newPerson.midweekMeetingStudent.history.filter(
          (record) => record.id !== current.id
        );
      }

      if (current && !isAddPerson) {
        current.endDate.value = new Date().toISOString();
        current.endDate.updatedAt = new Date().toISOString();
      }
    }

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

    const newPerson: PersonType = structuredClone(person);

    // update meeting student status if checked is true
    if (checked) {
      const currentMidweek = newPerson.midweekMeetingStudent.history.find((record) => record.endDate.value === null);

      if (currentMidweek) {
        const startDate = formatDate(new Date(currentMidweek.startDate.value), 'mm/dd/yyyy');
        const nowDate = formatDate(dateFirstDayMonth(), 'mm/dd/yyyy');

        if (startDate === nowDate) {
          if (isAddPerson) {
            newPerson.midweekMeetingStudent.history = newPerson.midweekMeetingStudent.history.filter(
              (record) => record.id !== currentMidweek.id
            );
          }

          if (!isAddPerson) {
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
          startDate: { value: dateFirstDayMonth().toISOString(), updatedAt: new Date().toISOString() },
          endDate: { value: null, updatedAt: new Date().toISOString() },
          _deleted: null,
        });
      }

      if (newPerson.firstMonthReport.value === null) {
        newPerson.firstMonthReport = { value: dateFirstDayMonth().toISOString(), updatedAt: new Date().toISOString() };
      }
    }

    if (!checked) {
      const current = newPerson.unbaptizedPublisher.history.find((record) => record.endDate.value === null);

      if (current && isAddPerson) {
        newPerson.firstMonthReport = { value: null, updatedAt: '' };
        newPerson.unbaptizedPublisher.history = newPerson.unbaptizedPublisher.history.filter(
          (record) => record.id !== current.id
        );
      }

      if (current && !isAddPerson) {
        current.endDate.value = new Date().toISOString();
        current.endDate.updatedAt = new Date().toISOString();
      }
    }

    await setPersonCurrentDetails(newPerson);
  };

  const handleToggleBaptizedPublisher = async (checked: boolean) => {
    const newPerson: PersonType = structuredClone(person);

    // update previous status if checked is true
    if (checked) {
      const currentUnbaptized = newPerson.unbaptizedPublisher.history.find((record) => record.endDate.value === null);

      if (currentUnbaptized) {
        const startDate = formatDate(new Date(currentUnbaptized.startDate.value), 'mm/dd/yyyy');
        const nowDate = formatDate(dateFirstDayMonth(), 'mm/dd/yyyy');

        if (startDate === nowDate) {
          if (isAddPerson) {
            newPerson.unbaptizedPublisher.history = newPerson.unbaptizedPublisher.history.filter(
              (record) => record.id !== currentUnbaptized.id
            );
          }

          if (!isAddPerson) {
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
        const nowDate = formatDate(dateFirstDayMonth(), 'mm/dd/yyyy');

        if (startDate === nowDate) {
          if (isAddPerson) {
            newPerson.midweekMeetingStudent.history = newPerson.midweekMeetingStudent.history.filter(
              (record) => record.id !== currentMidweek.id
            );
          }

          if (!isAddPerson) {
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
          startDate: { value: dateFirstDayMonth().toISOString(), updatedAt: new Date().toISOString() },
          endDate: { value: null, updatedAt: new Date().toISOString() },
          _deleted: null,
        });
      }

      if (newPerson.firstMonthReport.value === null) {
        newPerson.firstMonthReport = { value: dateFirstDayMonth().toISOString(), updatedAt: new Date().toISOString() };
      }
    }

    if (!checked) {
      const current = newPerson.baptizedPublisher.history.find((record) => record.endDate.value === null);

      if (current && isAddPerson) {
        newPerson.firstMonthReport = { value: null, updatedAt: '' };
        newPerson.baptizedPublisher.history = newPerson.baptizedPublisher.history.filter(
          (record) => record.id !== current.id
        );
      }

      if (current && !isAddPerson) {
        current.endDate.value = new Date().toISOString();
        current.endDate.updatedAt = new Date().toISOString();
      }
    }

    await setPersonCurrentDetails(newPerson);
  };

  useEffect(() => {
    setExpandedStatus({
      baptized: person.baptizedPublisher.active.value,
      unbaptized: person.unbaptizedPublisher.active.value,
      midweek: person.midweekMeetingStudent.active.value,
    });
  }, [person]);

  return {
    person,
    handleToggleMidweekMeetingStudent,
    handleToggleUnbaptizedPublisher,
    handleToggleBaptizedPublisher,
    expandedStatus,
    handleToggleExpand,
    handleToggleArchive,
  };
};

export default useSpiritualStatus;
