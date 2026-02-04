import { PersonType } from '@definition/person';
import { AssignmentCode } from '@definition/assignment';
import { useAtomValue } from 'jotai';
import { userDataViewState } from '@states/settings';
import { languageGroupsState } from '@states/field_service_groups';
import { toggleAssignment } from '@utils/assignments';
import useConvertValue from './useConvertValue';

const useAssignmentHandler = () => {
  const dataView = useAtomValue(userDataViewState);
  const languageGroups = useAtomValue(languageGroupsState);
  const { convertValue } = useConvertValue();

  const makeAssignmentHandler =
    (assignmentCode: AssignmentCode) =>
    (csvperson: PersonType, assignmentValue: string) => {
      const languageGroupsIds = languageGroups.map((group) => group.group_id);

      if (assignmentCode && convertValue(assignmentValue, 'boolean')) {
        toggleAssignment(
          csvperson,
          true,
          assignmentCode,
          dataView,
          languageGroupsIds
        );
      }
    };
  return { makeAssignmentHandler };
};

export default useAssignmentHandler;
