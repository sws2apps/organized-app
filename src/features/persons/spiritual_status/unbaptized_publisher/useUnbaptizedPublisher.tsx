import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { personCurrentDetailsState, personsActiveState } from '@states/persons';
import { setPersonCurrentDetails } from '@services/states/persons';
import { PersonType } from '@definition/person';
import { dateFirstDayMonth, formatDate } from '@utils/date';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import { fullnameOptionState, userDataViewState } from '@states/settings';
import { buildPersonFullname } from '@utils/common';
import useFirstReport from '../first_report/useFirstReport';

const useUnbaptizedPublisher = () => {
  const { id } = useParams();

  const { t } = useAppTranslation();

  const isAddPerson = id === undefined;

  const { updateFirstReport } = useFirstReport();

  const person = useAtomValue(personCurrentDetailsState);
  const groups = useAtomValue(fieldWithLanguageGroupsState);
  const persons = useAtomValue(personsActiveState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const dataView = useAtomValue(userDataViewState);

  const [isExpanded, setIsExpanded] = useState(false);
  const [group, setGroup] = useState('');

  const current_group = useMemo(() => {
    const group = groups.find((record) =>
      record.group_data.members.some((m) => m.person_uid === person?.person_uid)
    );

    let value = group?.group_id ?? '';

    if (value === '' && isAddPerson && dataView !== 'main') {
      value = dataView;
    }

    return value;
  }, [groups, person, dataView, isAddPerson]);

  const activeHistory = useMemo(() => {
    return person.person_data.publisher_unbaptized.history.filter(
      (record) => record._deleted === false
    );
  }, [person]);

  const isActive = useMemo(() => {
    return activeHistory.some((record) => record.end_date === null);
  }, [activeHistory]);

  const group_overseer = useMemo(() => {
    const findGroup = groups.find((record) => record.group_id === group);

    if (!findGroup) return;

    const findOverseer = findGroup.group_data.members.find((m) => m.isOverseer);

    if (!findOverseer) return;

    const findPerson = persons.find(
      (record) => record.person_uid === findOverseer.person_uid
    );

    if (!findPerson) return;

    const name = buildPersonFullname(
      findPerson.person_data.person_lastname.value,
      findPerson.person_data.person_firstname.value,
      fullnameOption
    );

    return t('tr_groupWithOverseerName', { name });
  }, [groups, group, persons, fullnameOption, t]);

  const handleToggleExpand = () => setIsExpanded((prev) => !prev);

  const handleGroupChange = (group: string) => setGroup(group);

  const handleToggleActive = async () => {
    const newPerson: PersonType = structuredClone(person);

    if (isActive) {
      const activeRecord =
        newPerson.person_data.publisher_unbaptized.history.find(
          (record) => record.end_date === null
        );

      const start_date = formatDate(
        new Date(activeRecord.start_date),
        'yyyy/MM/dd'
      );

      const nowDate = formatDate(new Date(), 'yyyy/MM/dd');

      if (start_date === nowDate) {
        if (isAddPerson) {
          newPerson.person_data.publisher_unbaptized.history =
            newPerson.person_data.publisher_unbaptized.history.filter(
              (record) => record.id !== activeRecord.id
            );
        }

        if (!isAddPerson) {
          activeRecord._deleted = true;
          activeRecord.updatedAt = new Date().toISOString();
        }
      }

      if (start_date !== nowDate) {
        activeRecord.end_date = new Date().toISOString();
        activeRecord.updatedAt = new Date().toISOString();
      }

      updateFirstReport(newPerson);

      setPersonCurrentDetails(newPerson);
    }

    if (!isActive) {
      await handleAddHistory();
    }
  };

  const handleAddHistory = async () => {
    const newPerson = structuredClone(person);

    newPerson.person_data.publisher_unbaptized.history.push({
      id: crypto.randomUUID(),
      _deleted: false,
      updatedAt: new Date().toISOString(),
      start_date: dateFirstDayMonth().toISOString(),
      end_date: null,
    });

    updateFirstReport(newPerson);

    setPersonCurrentDetails(newPerson);
  };

  const handleDeleteHistory = async (id: string) => {
    const newPerson = structuredClone(person);

    if (!isAddPerson) {
      const current = newPerson.person_data.publisher_unbaptized.history.find(
        (history) => history.id === id
      );

      current._deleted = true;
      current.updatedAt = new Date().toISOString();
    }

    if (isAddPerson) {
      newPerson.person_data.publisher_unbaptized.history =
        newPerson.person_data.publisher_unbaptized.history.filter(
          (record) => record.id !== id
        );
    }

    updateFirstReport(newPerson);

    setPersonCurrentDetails(newPerson);
  };

  const handleStartDateChange = async (id: string, value: Date) => {
    const newPerson = structuredClone(person);

    const current = newPerson.person_data.publisher_unbaptized.history.find(
      (history) => history.id === id
    );

    if (value === null) {
      current.start_date = null;
    }

    if (value !== null) {
      const startMonth = dateFirstDayMonth(value).toISOString();
      current.start_date = startMonth;
    }

    updateFirstReport(newPerson);

    setPersonCurrentDetails(newPerson);
  };

  const handleEndDateChange = async (id: string, value: Date | null) => {
    const newPerson = structuredClone(person);

    const current = newPerson.person_data.publisher_unbaptized.history.find(
      (history) => history.id === id
    );

    current.end_date = value === null ? null : value.toISOString();
    current.updatedAt = new Date().toISOString();

    setPersonCurrentDetails(newPerson);
  };

  useEffect(() => {
    setGroup(current_group);
  }, [current_group]);

  return {
    handleAddHistory,
    handleDeleteHistory,
    handleStartDateChange,
    handleEndDateChange,
    activeHistory,
    isExpanded,
    handleToggleExpand,
    handleToggleActive,
    isActive,
    group,
    handleGroupChange,
    group_overseer,
  };
};

export default useUnbaptizedPublisher;
