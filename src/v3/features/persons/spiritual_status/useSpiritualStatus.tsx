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
    baptized: person.publisher_baptized.active.value,
    unbaptized: person.publisher_unbaptized.active.value,
    midweek: person.midweek_meeting_student.active.value,
  });

  const handleToggleArchive = async () => {
    const newPerson: PersonType = structuredClone(person);

    const archived = newPerson.archived.value;

    // UNARCHIVE PERSON
    if (archived) {
      personUnarchive(newPerson);
    }

    // ARCHIVE PERSON
    if (!archived) {
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
    if (person.publisher_baptized.active.value) {
      await displaySnackNotification({
        header: t('tr_spiritualStatusError'),
        message: t('tr_baptizedMidweekStudentError'),
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
      return;
    }

    // check if unbaptized publisher and abort
    if (person.publisher_unbaptized.active.value) {
      await displaySnackNotification({
        header: t('tr_spiritualStatusError'),
        message: t('tr_unBaptizedMidweekStudentError'),
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
      return;
    }

    const newPerson: PersonType = structuredClone(person);

    newPerson.midweek_meeting_student.active.value = checked;
    newPerson.midweek_meeting_student.active.updatedAt = new Date().toISOString();

    if (checked) {
      const current = newPerson.midweek_meeting_student.history.find((record) => record.end_date.value === null);

      if (!current) {
        newPerson.midweek_meeting_student.history.push({
          id: crypto.randomUUID(),
          start_date: { value: new Date().toISOString(), updatedAt: new Date().toISOString() },
          end_date: { value: null, updatedAt: new Date().toISOString() },
          _deleted: null,
        });
      }
    }

    if (!checked) {
      const current = newPerson.midweek_meeting_student.history.find((record) => record.end_date.value === null);

      if (current && isAddPerson) {
        newPerson.midweek_meeting_student.history = newPerson.midweek_meeting_student.history.filter(
          (record) => record.id !== current.id
        );
      }

      if (current && !isAddPerson) {
        current.end_date.value = new Date().toISOString();
        current.end_date.updatedAt = new Date().toISOString();
      }
    }

    await setPersonCurrentDetails(newPerson);
  };

  const handleToggleUnbaptizedPublisher = async (checked: boolean) => {
    // check if baptized publisher and abort
    if (person.publisher_baptized.active.value) {
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
      const currentMidweek = newPerson.midweek_meeting_student.history.find((record) => record.end_date.value === null);

      if (currentMidweek) {
        const start_date = formatDate(new Date(currentMidweek.start_date.value), 'mm/dd/yyyy');
        const nowDate = formatDate(dateFirstDayMonth(), 'mm/dd/yyyy');

        if (start_date === nowDate) {
          if (isAddPerson) {
            newPerson.midweek_meeting_student.history = newPerson.midweek_meeting_student.history.filter(
              (record) => record.id !== currentMidweek.id
            );
          }

          if (!isAddPerson) {
            currentMidweek._deleted = new Date().toISOString();
          }
        }

        if (start_date !== nowDate) {
          currentMidweek.end_date.value = new Date().toISOString();
          currentMidweek.end_date.updatedAt = new Date().toISOString();
        }
      }

      newPerson.midweek_meeting_student.active.value = false;
      newPerson.midweek_meeting_student.active.updatedAt = new Date().toISOString();
    }

    newPerson.publisher_unbaptized.active.value = checked;
    newPerson.publisher_unbaptized.active.updatedAt = new Date().toISOString();

    if (checked) {
      const current = newPerson.publisher_unbaptized.history.find((record) => record.end_date.value === null);

      if (!current) {
        newPerson.publisher_unbaptized.history.push({
          id: crypto.randomUUID(),
          start_date: { value: dateFirstDayMonth().toISOString(), updatedAt: new Date().toISOString() },
          end_date: { value: null, updatedAt: new Date().toISOString() },
          _deleted: null,
        });
      }

      if (newPerson.first_month_report.value === null) {
        newPerson.first_month_report = {
          value: dateFirstDayMonth().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
    }

    if (!checked) {
      const current = newPerson.publisher_unbaptized.history.find((record) => record.end_date.value === null);

      if (current && isAddPerson) {
        newPerson.first_month_report = { value: null, updatedAt: '' };
        newPerson.publisher_unbaptized.history = newPerson.publisher_unbaptized.history.filter(
          (record) => record.id !== current.id
        );
      }

      if (current && !isAddPerson) {
        current.end_date.value = new Date().toISOString();
        current.end_date.updatedAt = new Date().toISOString();
      }
    }

    await setPersonCurrentDetails(newPerson);
  };

  const handleToggleBaptizedPublisher = async (checked: boolean) => {
    const newPerson: PersonType = structuredClone(person);

    // update previous status if checked is true
    if (checked) {
      const currentUnbaptized = newPerson.publisher_unbaptized.history.find((record) => record.end_date.value === null);

      if (currentUnbaptized) {
        const start_date = formatDate(new Date(currentUnbaptized.start_date.value), 'mm/dd/yyyy');
        const nowDate = formatDate(dateFirstDayMonth(), 'mm/dd/yyyy');

        if (start_date === nowDate) {
          if (isAddPerson) {
            newPerson.publisher_unbaptized.history = newPerson.publisher_unbaptized.history.filter(
              (record) => record.id !== currentUnbaptized.id
            );
          }

          if (!isAddPerson) {
            currentUnbaptized._deleted = new Date().toISOString();
          }
        }

        if (start_date !== nowDate) {
          currentUnbaptized.end_date.value = new Date().toISOString();
          currentUnbaptized.end_date.updatedAt = new Date().toISOString();
        }
      }

      if (newPerson.publisher_unbaptized.active.value) {
        newPerson.publisher_unbaptized.active.value = false;
        newPerson.publisher_unbaptized.active.updatedAt = new Date().toISOString();
      }

      const currentMidweek = newPerson.midweek_meeting_student.history.find((record) => record.end_date.value === null);

      if (currentMidweek) {
        const start_date = formatDate(new Date(currentMidweek.start_date.value), 'mm/dd/yyyy');
        const nowDate = formatDate(dateFirstDayMonth(), 'mm/dd/yyyy');

        if (start_date === nowDate) {
          if (isAddPerson) {
            newPerson.midweek_meeting_student.history = newPerson.midweek_meeting_student.history.filter(
              (record) => record.id !== currentMidweek.id
            );
          }

          if (!isAddPerson) {
            currentMidweek._deleted = new Date().toISOString();
          }
        }

        if (start_date !== nowDate) {
          currentMidweek.end_date.value = new Date().toISOString();
          currentMidweek.end_date.updatedAt = new Date().toISOString();
        }
      }

      if (newPerson.midweek_meeting_student.active.value) {
        newPerson.midweek_meeting_student.active.value = false;
        newPerson.midweek_meeting_student.active.updatedAt = new Date().toISOString();
      }
    }

    newPerson.publisher_baptized.active.value = checked;
    newPerson.publisher_baptized.active.updatedAt = new Date().toISOString();

    if (checked) {
      const current = newPerson.publisher_baptized.history.find((record) => record.end_date.value === null);

      if (!current) {
        newPerson.publisher_baptized.history.push({
          id: crypto.randomUUID(),
          start_date: { value: dateFirstDayMonth().toISOString(), updatedAt: new Date().toISOString() },
          end_date: { value: null, updatedAt: new Date().toISOString() },
          _deleted: null,
        });
      }

      if (newPerson.first_month_report.value === null) {
        newPerson.first_month_report = {
          value: dateFirstDayMonth().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
    }

    if (!checked) {
      const current = newPerson.publisher_baptized.history.find((record) => record.end_date.value === null);

      if (current && isAddPerson) {
        newPerson.first_month_report = { value: null, updatedAt: '' };
        newPerson.publisher_baptized.history = newPerson.publisher_baptized.history.filter(
          (record) => record.id !== current.id
        );
      }

      if (current && !isAddPerson) {
        current.end_date.value = new Date().toISOString();
        current.end_date.updatedAt = new Date().toISOString();
      }
    }

    await setPersonCurrentDetails(newPerson);
  };

  useEffect(() => {
    setExpandedStatus({
      baptized: person.publisher_baptized.active.value,
      unbaptized: person.publisher_unbaptized.active.value,
      midweek: person.midweek_meeting_student.active.value,
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
