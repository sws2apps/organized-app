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
    baptized: person.person_data.publisher_baptized.active.value,
    unbaptized: person.person_data.publisher_unbaptized.active.value,
    midweek: person.person_data.midweek_meeting_student.active.value,
  });

  const handleToggleArchive = async () => {
    const newPerson: PersonType = structuredClone(person);

    const archived = newPerson.person_data.archived.value;

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

  const handleToggleExpand = (
    status: 'baptized' | 'unbaptized' | 'midweek'
  ) => {
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
    if (person.person_data.publisher_baptized.active.value) {
      await displaySnackNotification({
        header: t('error_app_persons_spiritual-status-change'),
        message: t('error_app_persons_spiritual-status-baptized-midweek'),
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
      return;
    }

    // check if unbaptized publisher and abort
    if (person.person_data.publisher_unbaptized.active.value) {
      await displaySnackNotification({
        header: t('error_app_persons_spiritual-status-change'),
        message: t('error_app_persons_spiritual-status-unbaptized-midweek'),
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
      return;
    }

    const newPerson: PersonType = structuredClone(person);

    newPerson.person_data.midweek_meeting_student.active.value = checked;
    newPerson.person_data.midweek_meeting_student.active.updatedAt =
      new Date().toISOString();

    if (checked) {
      const current =
        newPerson.person_data.midweek_meeting_student.history.find(
          (record) => record.end_date === null
        );

      if (!current) {
        newPerson.person_data.midweek_meeting_student.history.push({
          id: crypto.randomUUID(),
          _deleted: false,
          updatedAt: new Date().toISOString(),
          start_date: new Date().toISOString(),
          end_date: null,
        });
      }
    }

    if (!checked) {
      const current =
        newPerson.person_data.midweek_meeting_student.history.find(
          (record) => record.end_date === null
        );

      if (current && isAddPerson) {
        newPerson.person_data.midweek_meeting_student.history =
          newPerson.person_data.midweek_meeting_student.history.filter(
            (record) => record.id !== current.id
          );
      }

      if (current && !isAddPerson) {
        current.end_date = new Date().toISOString();
        current.updatedAt = new Date().toISOString();
      }
    }

    await setPersonCurrentDetails(newPerson);
  };

  const handleToggleUnbaptizedPublisher = async (checked: boolean) => {
    // check if baptized publisher and abort
    if (person.person_data.publisher_baptized.active.value) {
      await displaySnackNotification({
        header: t('error_app_persons_spiritual-status-change'),
        message: t('error_app_persons_spiritual-status-baptized-unbaptized'),
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
      return;
    }

    const newPerson: PersonType = structuredClone(person);

    // update meeting student status if checked is true
    if (checked) {
      const currentMidweek =
        newPerson.person_data.midweek_meeting_student.history.find(
          (record) => record.end_date === null
        );

      if (currentMidweek) {
        const start_date = formatDate(
          new Date(currentMidweek.start_date),
          'yyyy/MM/dd'
        );
        const nowDate = formatDate(dateFirstDayMonth(), 'yyyy/MM/dd');

        if (start_date === nowDate) {
          if (isAddPerson) {
            newPerson.person_data.midweek_meeting_student.history =
              newPerson.person_data.midweek_meeting_student.history.filter(
                (record) => record.id !== currentMidweek.id
              );
          }

          if (!isAddPerson) {
            currentMidweek._deleted = true;
            currentMidweek.updatedAt = new Date().toISOString();
          }
        }

        if (start_date !== nowDate) {
          currentMidweek.end_date = new Date().toISOString();
          currentMidweek.updatedAt = new Date().toISOString();
        }
      }

      newPerson.person_data.midweek_meeting_student.active.value = false;
      newPerson.person_data.midweek_meeting_student.active.updatedAt =
        new Date().toISOString();
    }

    newPerson.person_data.publisher_unbaptized.active.value = checked;
    newPerson.person_data.publisher_unbaptized.active.updatedAt =
      new Date().toISOString();

    if (!checked) {
      const current = newPerson.person_data.publisher_unbaptized.history.find(
        (record) => record.end_date === null
      );

      if (current && isAddPerson) {
        newPerson.person_data.publisher_unbaptized.history =
          newPerson.person_data.publisher_unbaptized.history.filter(
            (record) => record.id !== current.id
          );
      }

      if (current && !isAddPerson) {
        current.end_date = new Date().toISOString();
        current.updatedAt = new Date().toISOString();
      }
    }

    await setPersonCurrentDetails(newPerson);
  };

  const handleToggleBaptizedPublisher = async (checked: boolean) => {
    const newPerson: PersonType = structuredClone(person);

    // update previous status if checked is true
    if (checked) {
      const currentUnbaptized =
        newPerson.person_data.publisher_unbaptized.history.find(
          (record) => record.end_date === null
        );

      if (currentUnbaptized) {
        const start_date = formatDate(
          new Date(currentUnbaptized.start_date),
          'yyyy/MM/dd'
        );
        const nowDate = formatDate(dateFirstDayMonth(), 'yyyy/MM/dd');

        if (start_date === nowDate) {
          if (isAddPerson) {
            newPerson.person_data.publisher_unbaptized.history =
              newPerson.person_data.publisher_unbaptized.history.filter(
                (record) => record.id !== currentUnbaptized.id
              );
          }

          if (!isAddPerson) {
            currentUnbaptized._deleted = true;
            currentUnbaptized.updatedAt = new Date().toISOString();
          }
        }

        if (start_date !== nowDate) {
          currentUnbaptized.end_date = new Date().toISOString();
          currentUnbaptized.updatedAt = new Date().toISOString();
        }
      }

      if (newPerson.person_data.publisher_unbaptized.active.value) {
        newPerson.person_data.publisher_unbaptized.active.value = false;
        newPerson.person_data.publisher_unbaptized.active.updatedAt =
          new Date().toISOString();
      }

      const currentMidweek =
        newPerson.person_data.midweek_meeting_student.history.find(
          (record) => record.end_date === null
        );

      if (currentMidweek) {
        const start_date = formatDate(
          new Date(currentMidweek.start_date),
          'yyyy/MM/dd'
        );
        const nowDate = formatDate(dateFirstDayMonth(), 'yyyy/MM/dd');

        if (start_date === nowDate) {
          if (isAddPerson) {
            newPerson.person_data.midweek_meeting_student.history =
              newPerson.person_data.midweek_meeting_student.history.filter(
                (record) => record.id !== currentMidweek.id
              );
          }

          if (!isAddPerson) {
            currentMidweek._deleted = true;
            currentMidweek.updatedAt = new Date().toISOString();
          }
        }

        if (start_date !== nowDate) {
          currentMidweek.end_date = new Date().toISOString();
          currentMidweek.updatedAt = new Date().toISOString();
        }
      }

      if (newPerson.person_data.midweek_meeting_student.active.value) {
        newPerson.person_data.midweek_meeting_student.active.value = false;
        newPerson.person_data.midweek_meeting_student.active.updatedAt =
          new Date().toISOString();
      }
    }

    newPerson.person_data.publisher_baptized.active.value = checked;
    newPerson.person_data.publisher_baptized.active.updatedAt =
      new Date().toISOString();

    if (!checked) {
      const current = newPerson.person_data.publisher_baptized.history.find(
        (record) => record.end_date === null
      );

      if (current && isAddPerson) {
        newPerson.person_data.publisher_baptized.history =
          newPerson.person_data.publisher_baptized.history.filter(
            (record) => record.id !== current.id
          );
      }

      if (current && !isAddPerson) {
        current.end_date = new Date().toISOString();
        current.updatedAt = new Date().toISOString();
      }
    }

    await setPersonCurrentDetails(newPerson);
  };

  useEffect(() => {
    setExpandedStatus({
      baptized: person.person_data.publisher_baptized.active.value,
      unbaptized: person.person_data.publisher_unbaptized.active.value,
      midweek: person.person_data.midweek_meeting_student.active.value,
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
