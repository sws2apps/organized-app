import { useMemo } from 'react';
import { dbPersonsSave } from '@services/dexie/persons';
import { formatDate } from '@services/dateformat';
import useCurrentUser from '@hooks/useCurrentUser';
import {
  parse,
  addDays,
  isAfter,
  isEqual,
  isBefore,
  startOfDay,
} from 'date-fns';
import { displaySnackNotification } from '@services/states/app';
import { useAppTranslation } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';

const useUserTimeAway = () => {
  const { person } = useCurrentUser();
  const { t } = useAppTranslation();

  const allRecords = useMemo(() => {
    const all = person.person_data.timeAway;
    const today = new Date();
    const cutoffDays = 3;
    return all.filter((record) => {
      if (record._deleted === true) return false;
      if (!record.end_date) return true;
      // Parse the end_date string (format: 'yyyy/MM/dd')
      const endDate = parse(record.end_date, 'yyyy/MM/dd', new Date());
      const endDatePlusCutoff = addDays(endDate, cutoffDays);
      // Show if today is before or equal to endDatePlusCutoff
      return (
        isAfter(endDatePlusCutoff, today) || isEqual(endDatePlusCutoff, today)
      );
    });
  }, [person]);

  const handleAdd = async () => {
    const today = startOfDay(new Date());
    const newPerson = structuredClone(person);

    newPerson.person_data.timeAway.push({
      id: crypto.randomUUID(),
      _deleted: false,
      updatedAt: new Date().toISOString(),
      start_date: formatDate(today, 'yyyy/MM/dd'),
      end_date: null,
      comments: '',
    });

    await dbPersonsSave(newPerson);
  };

  const handleStartDateChange = async (id: string, value: Date) => {
    value = value || new Date();
    const today = startOfDay(new Date());
    const selectedDate = startOfDay(value);

    if (isBefore(selectedDate, today)) {
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: t('tr_timeAwayPastDateError'),
        severity: 'error',
      });
      return;
    }

    const newPerson = structuredClone(person);

    const item = newPerson.person_data.timeAway.find(
      (record) => record.id === id
    );
    item.updatedAt = new Date().toISOString();
    item.start_date = formatDate(value, 'yyyy/MM/dd');

    await dbPersonsSave(newPerson);
  };

  const handleEndDateChange = async (id: string, value: Date) => {
    if (value === null) {
      const newPerson = structuredClone(person);
      const item = newPerson.person_data.timeAway.find(
        (record) => record.id === id
      );
      item.updatedAt = new Date().toISOString();
      item.end_date = null;
      await dbPersonsSave(newPerson);
      return;
    }

    const today = startOfDay(new Date());
    const selectedDate = startOfDay(value);

    if (isBefore(selectedDate, today)) {
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: t('tr_timeAwayPastEndDateError'),
        severity: 'error',
      });
      return;
    }

    const newPerson = structuredClone(person);
    const item = newPerson.person_data.timeAway.find(
      (record) => record.id === id
    );

    // Validate that end date is not before start date
    const startDate = parse(item.start_date, 'yyyy/MM/dd', new Date());
    if (isBefore(selectedDate, startDate)) {
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: t('tr_timeAwayEndBeforeStartError'),
        severity: 'error',
      });
      return;
    }

    item.updatedAt = new Date().toISOString();
    item.end_date = formatDate(value, 'yyyy/MM/dd');

    await dbPersonsSave(newPerson);
  };

  const handleCommentsChange = async (id: string, value: string) => {
    const newPerson = structuredClone(person);

    const item = newPerson.person_data.timeAway.find(
      (record) => record.id === id
    );
    item.updatedAt = new Date().toISOString();
    item.comments = value;

    await dbPersonsSave(newPerson);
  };

  const handleDelete = async (id: string) => {
    const newPerson = structuredClone(person);

    const item = newPerson.person_data.timeAway.find(
      (record) => record.id === id
    );

    item.updatedAt = new Date().toISOString();
    item._deleted = true;

    await dbPersonsSave(newPerson);
  };

  return {
    allRecords,
    handleAdd,
    handleStartDateChange,
    handleEndDateChange,
    handleCommentsChange,
    handleDelete,
  };
};

export default useUserTimeAway;
