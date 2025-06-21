import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { PersonType } from '@definition/person';
import { setPersonCurrentDetails } from '@services/states/persons';
import { computeYearsDiff, dateFirstDayMonth, formatDate } from '@utils/date';
import { personCurrentDetailsState, personsActiveState } from '@states/persons';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import { fullnameOptionState, userDataViewState } from '@states/settings';
import { buildPersonFullname } from '@utils/common';
import useFirstReport from '../first_report/useFirstReport';

const useBaptizedPublisher = () => {
  const { id } = useParams();

  const { t } = useAppTranslation();

  const isAddPerson = id === undefined;

  const { updateFirstReport } = useFirstReport();

  const person = useAtomValue(personCurrentDetailsState);
  const groups = useAtomValue(fieldWithLanguageGroupsState);
  const persons = useAtomValue(personsActiveState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const dataView = useAtomValue(userDataViewState);

  const [age, setAge] = useState('0');
  const [isExpanded, setIsExpanded] = useState(false);
  const [group, setGroup] = useState('');

  const current_group = useMemo(() => {
    const found = groups.find((record) =>
      record.group_data.members.some((m) => m.person_uid === person?.person_uid)
    );

    let value = found?.group_id ?? '';

    if (value === '' && isAddPerson && dataView !== 'main') {
      value = dataView;
    }

    return value;
  }, [groups, person, dataView, isAddPerson]);

  const activeHistory = useMemo(() => {
    return person.person_data.publisher_baptized.history.filter(
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
        newPerson.person_data.publisher_baptized.history.find(
          (record) => record.end_date === null
        );

      const start_date = formatDate(
        new Date(activeRecord.start_date),
        'yyyy/MM/dd'
      );

      const nowDate = formatDate(new Date(), 'yyyy/MM/dd');

      if (start_date === nowDate) {
        if (isAddPerson) {
          newPerson.person_data.publisher_baptized.history =
            newPerson.person_data.publisher_baptized.history.filter(
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

    const startMonth = dateFirstDayMonth().toISOString();

    newPerson.person_data.publisher_baptized.history.push({
      id: crypto.randomUUID(),
      _deleted: false,
      updatedAt: new Date().toISOString(),
      start_date: startMonth,
      end_date: null,
    });

    updateFirstReport(newPerson);

    setPersonCurrentDetails(newPerson);
  };

  const handleDeleteHistory = async (id: string) => {
    const newPerson = structuredClone(person);

    if (!isAddPerson) {
      const current = newPerson.person_data.publisher_baptized.history.find(
        (history) => history.id === id
      );

      current._deleted = true;
      current.updatedAt = new Date().toISOString();
    }

    if (isAddPerson) {
      newPerson.person_data.publisher_baptized.history =
        newPerson.person_data.publisher_baptized.history.filter(
          (record) => record.id !== id
        );
    }

    updateFirstReport(newPerson);

    setPersonCurrentDetails(newPerson);
  };

  const handleStartDateChange = async (id: string, value: Date) => {
    const newPerson = structuredClone(person);

    const current = newPerson.person_data.publisher_baptized.history.find(
      (history) => history.id === id
    );

    if (value === null) {
      current.start_date = null;
    }

    if (value !== null) {
      const startMonth = dateFirstDayMonth(value).toISOString();
      current.start_date = startMonth;
    }

    current.updatedAt = new Date().toISOString();

    updateFirstReport(newPerson);

    setPersonCurrentDetails(newPerson);
  };

  const handleEndDateChange = async (id: string, value: Date | null) => {
    const newPerson = structuredClone(person);

    const current = newPerson.person_data.publisher_baptized.history.find(
      (history) => history.id === id
    );

    current.end_date = value === null ? null : value.toISOString();
    current.updatedAt = new Date().toISOString();

    setPersonCurrentDetails(newPerson);
  };

  const handleToggleHope = async (value) => {
    const newPerson = structuredClone(person);

    if (value === 'anointed') {
      newPerson.person_data.publisher_baptized.anointed.value = true;
      newPerson.person_data.publisher_baptized.anointed.updatedAt =
        new Date().toISOString();

      newPerson.person_data.publisher_baptized.other_sheep.value = false;
      newPerson.person_data.publisher_baptized.other_sheep.updatedAt =
        new Date().toISOString();
    }

    if (value === 'otherSheep') {
      newPerson.person_data.publisher_baptized.anointed.value = false;
      newPerson.person_data.publisher_baptized.anointed.updatedAt =
        new Date().toISOString();

      newPerson.person_data.publisher_baptized.other_sheep.value = true;
      newPerson.person_data.publisher_baptized.other_sheep.updatedAt =
        new Date().toISOString();
    }

    setPersonCurrentDetails(newPerson);
  };

  const handleChangeBaptismDate = async (value: Date) => {
    const newPerson = structuredClone(person);

    newPerson.person_data.publisher_baptized.baptism_date.value =
      value === null ? null : new Date(value).toISOString();

    newPerson.person_data.publisher_baptized.baptism_date.updatedAt =
      new Date().toISOString();

    const histories = newPerson.person_data.publisher_baptized.history.filter(
      (record) => !record._deleted && record.start_date !== null
    );

    const firstReport = person.person_data.first_report?.value || '';

    if (histories.length === 0 && value && firstReport.length === 0) {
      const startMonth = dateFirstDayMonth(value).toISOString();

      newPerson.person_data.publisher_baptized.history.push({
        _deleted: false,
        end_date: null,
        id: crypto.randomUUID(),
        start_date: startMonth,
        updatedAt: new Date().toISOString(),
      });

      updateFirstReport(newPerson);
    }

    setPersonCurrentDetails(newPerson);
  };

  useEffect(() => {
    if (person.person_data.publisher_baptized.baptism_date.value === null) {
      setAge('0');
    }

    if (person.person_data.publisher_baptized.baptism_date.value !== null) {
      const age = computeYearsDiff(
        person.person_data.publisher_baptized.baptism_date.value
      );
      setAge(age);
    }

    setGroup(current_group);
  }, [person.person_data.publisher_baptized.baptism_date.value, current_group]);

  return {
    age,
    person,
    handleAddHistory,
    handleDeleteHistory,
    handleStartDateChange,
    handleEndDateChange,
    handleToggleHope,
    handleChangeBaptismDate,
    activeHistory,
    handleToggleExpand,
    isExpanded,
    isActive,
    handleToggleActive,
    group,
    handleGroupChange,
    group_overseer,
  };
};

export default useBaptizedPublisher;
