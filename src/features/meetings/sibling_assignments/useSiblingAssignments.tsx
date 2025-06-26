import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { schedulesGetData } from '@services/app/schedules';
import { schedulesState } from '@states/schedules';
import { ASSIGNMENT_PATH } from '@constants/index';
import { personsAllState } from '@states/persons';
import { personGetScheduleName } from '@services/app/persons';
import { languageGroupsState } from '@states/field_service_groups';
import { userDataViewState } from '@states/settings';
import { Assignments, SiblingAssignmentsProps } from './index.types';

const useSiblingAssignments = ({
  week,
  assignment,
}: SiblingAssignmentsProps) => {
  const { t } = useAppTranslation();

  const schedules = useAtomValue(schedulesState);
  const persons = useAtomValue(personsAllState);
  const languageGroups = useAtomValue(languageGroupsState);
  const dataView = useAtomValue(userDataViewState);

  const schedule = useMemo(() => {
    return schedules.find((schedule) => schedule.weekOf === week);
  }, [schedules, week]);

  const assignments = useMemo(() => {
    if (!schedule) return [];

    const path = ASSIGNMENT_PATH[assignment];

    if (!path) return [];

    const result: Assignments[] = [];

    const dataSchedule = schedulesGetData(schedule, path);

    let foundAssignments = Array.isArray(dataSchedule)
      ? [...dataSchedule]
      : [dataSchedule];

    foundAssignments = foundAssignments.filter(
      (record) => record.type !== dataView
    );

    for (const assignment of foundAssignments) {
      const assigned = assignment?.value;

      if (!assigned) continue;

      const person = persons.find(
        (record) => record.person_uid === assignment.value
      );

      if (person) {
        const personName = personGetScheduleName(person);

        const type =
          assignment.type === 'main'
            ? t('tr_hostCongregationShort')
            : (languageGroups.find(
                (group) => group.group_id === assignment.type
              )?.group_data.name ?? '');

        const value = `${personName}${type ? ` (${type})` : ''}`;

        result.push({
          type: assignment.type,
          value,
        });
      }
    }

    return result;
  }, [schedule, assignment, persons, t, languageGroups, dataView]);

  return { assignments };
};

export default useSiblingAssignments;
