import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { personCurrentDetailsState, personsActiveState } from '@states/persons';
import { setPersonCurrentDetails } from '@services/states/persons';
import { buildPersonFullname } from '@utils/common';
import { fullnameOptionState, userDataViewState } from '@states/settings';
import { languageGroupsState } from '@states/field_service_groups';

const useMidweekMeetingStudent = () => {
  const { id } = useParams();

  const { t } = useAppTranslation();

  const isAddPerson = id === undefined;

  const person = useAtomValue(personCurrentDetailsState);
  const groups = useAtomValue(languageGroupsState);
  const persons = useAtomValue(personsActiveState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const dataView = useAtomValue(userDataViewState);

  const current_group = useMemo(() => {
    const group = groups.find((record) => {
      return record.group_data.members.some(
        (member) => member.person_uid === person.person_uid
      );
    });

    let value = group?.group_id ?? '';

    if (value === '' && isAddPerson && dataView !== 'main') {
      value = dataView;
    }

    return value;
  }, [groups, person, dataView, isAddPerson]);

  const [group, setGroup] = useState(current_group);

  const showLanguageGroupSelector = useMemo(() => {
    return groups.length > 0;
  }, [groups]);

  const group_overseer = useMemo(() => {
    const findGroup = groups.find((record) => record.group_id === group);

    if (!findGroup) return;

    const findOverseer = findGroup.group_data.members.find(
      (member) => member.isOverseer
    );

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

  const activeHistory = useMemo(() => {
    return person.person_data.midweek_meeting_student.history.filter(
      (record) => record._deleted === false
    );
  }, [person]);

  const handleGroupChange = (group: string) => setGroup(group);

  const handleAddHistory = async () => {
    const newPerson = structuredClone(person);

    newPerson.person_data.midweek_meeting_student.history.push({
      id: crypto.randomUUID(),
      _deleted: false,
      updatedAt: new Date().toISOString(),
      start_date: new Date().toISOString(),
      end_date: null,
    });

    setPersonCurrentDetails(newPerson);
  };

  const handleDeleteHistory = async (id: string) => {
    const newPerson = structuredClone(person);

    if (!isAddPerson) {
      const current =
        newPerson.person_data.midweek_meeting_student.history.find(
          (history) => history.id === id
        );

      current._deleted = true;
      current.updatedAt = new Date().toISOString();
    }

    if (isAddPerson) {
      newPerson.person_data.midweek_meeting_student.history =
        newPerson.person_data.midweek_meeting_student.history.filter(
          (record) => record.id !== id
        );
    }

    setPersonCurrentDetails(newPerson);
  };

  const handleStartDateChange = async (id: string, value: Date) => {
    const newPerson = structuredClone(person);

    const current = newPerson.person_data.midweek_meeting_student.history.find(
      (history) => history.id === id
    );

    current.start_date = value.toISOString();
    current.updatedAt = new Date().toISOString();

    setPersonCurrentDetails(newPerson);
  };

  const handleEndDateChange = async (id: string, value: Date | null) => {
    const newPerson = structuredClone(person);

    const current = newPerson.person_data.midweek_meeting_student.history.find(
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
    group_overseer,
    handleGroupChange,
    group,
    showLanguageGroupSelector,
  };
};

export default useMidweekMeetingStudent;
