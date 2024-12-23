import { useMemo } from 'react';
import { useAppTranslation } from '@hooks/index';
import { AssignmentHistoryType } from '@definition/schedules';
import { formatDate } from '@services/dateformat';
import { useRecoilValue } from 'recoil';
import { personsState } from '@states/persons';
import { buildPersonFullname } from '@utils/common';
import { fullnameOptionState, userLocalUIDState } from '@states/settings';

const ADD_CALENDAR_SHOW = false;

const useAssignmentItem = (assignment: AssignmentHistoryType) => {
  const { t } = useAppTranslation();

  const persons = useRecoilValue(personsState);
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const userUID = useRecoilValue(userLocalUIDState);

  const class_name = useMemo(() => {
    if (!assignment) return '';

    const key = assignment.assignment.key;

    if (key.endsWith('_A')) {
      return t('tr_hallA');
    }

    if (key.endsWith('_B')) {
      return t('tr_hallB');
    }
  }, [assignment, t]);

  const isMidweek = useMemo(() => {
    return assignment.assignment.key.startsWith('MM_');
  }, [assignment]);

  const assignmentDate = useMemo(() => {
    return formatDate(new Date(assignment.weekOf), 'd');
  }, [assignment]);

  const personGetName = (value: string) => {
    const person = persons.find((record) => record.person_uid === value);
    if (!person) return '';

    const name = buildPersonFullname(
      person.person_data.person_lastname.value,
      person.person_data.person_firstname.value,
      fullnameOption
    );

    return name;
  };

  return {
    assignmentDate,
    isMidweek,
    personGetName,
    userUID,
    class_name,
    ADD_CALENDAR_SHOW,
  };
};

export default useAssignmentItem;
