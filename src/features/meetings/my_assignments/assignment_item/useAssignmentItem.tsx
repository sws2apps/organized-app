import { useMemo } from 'react';
import { AssignmentHistoryType } from '@definition/schedules';
import { formatDate } from '@services/dateformat';
import { useRecoilValue } from 'recoil';
import { personsState } from '@states/persons';
import { buildPersonFullname } from '@utils/common';
import { fullnameOptionState } from '@states/settings';

const useAssignmentItem = (assignment: AssignmentHistoryType) => {
  const persons = useRecoilValue(personsState);
  const fullnameOption = useRecoilValue(fullnameOptionState);

  const isMidweek = useMemo(() => {
    return assignment.assignment.key.startsWith('MM_');
  }, [assignment]);

  const assignmentDate = useMemo(() => {
    return formatDate(new Date(assignment.weekOf), 'd');
  }, [assignment]);

  const personGetName = (value: string) => {
    const person = persons.find((record) => record.person_uid === value);
    const name = buildPersonFullname(
      person.person_data.person_lastname.value,
      person.person_data.person_firstname.value,
      fullnameOption
    );

    return name;
  };

  return { assignmentDate, isMidweek, personGetName };
};

export default useAssignmentItem;
