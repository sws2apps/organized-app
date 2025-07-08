import { AssignmentCode } from '@definition/assignment';
import { PersonType } from '@definition/person';

const duplicateAssignmentsCode = [AssignmentCode.MINISTRY_HOURS_CREDIT];

export const toggleAssignment = (
  person: PersonType,
  checked: boolean,
  code: AssignmentCode,
  dataView: string,
  languageGroups: Array<string>
): PersonType => {
  const newPerson = person;

  const views = duplicateAssignmentsCode.includes(code)
    ? ['main', ...languageGroups]
    : [dataView];

  for (const view of views) {
    if (checked) {
      // Checking whether the view already exists
      const viewExists = newPerson.person_data.assignments.some(
        (a) => a.type === view
      );
      // If there is no such view, a new one is created with the appropriate code
      if (!viewExists) {
        newPerson.person_data.assignments.push({
          type: view,
          values: [code],
          updatedAt: new Date().toISOString(),
        });
        // Further checks are not necessary, as the code has just been added
        continue;
      }

      // Here the appropriate view is searched in case it already existed
      const personAssignments = newPerson.person_data.assignments.find(
        (a) => a.type === view
      );

      // If there was already a list, it is checked whether the code was already included
      // either they were already included or were just added
      const currentItems = personAssignments.values;
      const hasCurrent = currentItems.includes(code);

      // Only if the task is not already in the list, it will be added
      if (!hasCurrent) {
        // If the code was not alreadythere, it is now added
        currentItems.push(code);
        personAssignments.updatedAt = new Date().toISOString();
      }

      const exclusiveAssignments = [
        AssignmentCode.WM_Speaker,
        AssignmentCode.WM_SpeakerSymposium,
      ];
      const isExclusive = exclusiveAssignments.includes(code);
      // in case it is an exclusive task, it is checked whether the other is already included
      if (isExclusive) {
        const other =
          code === AssignmentCode.WM_Speaker
            ? AssignmentCode.WM_SpeakerSymposium
            : AssignmentCode.WM_Speaker;

        if (currentItems.includes(other)) {
          personAssignments.updatedAt = new Date().toISOString();
          personAssignments.values = personAssignments.values.filter(
            (c) => c !== other
          );
        }
      }
    }

    if (!checked) {
      const personAssignments = newPerson.person_data.assignments.find(
        (a) => a.type === view
      );

      personAssignments.updatedAt = new Date().toISOString();
      personAssignments.values = personAssignments.values.filter(
        (c) => c !== code
      );
    }
  }

  return newPerson;
};
