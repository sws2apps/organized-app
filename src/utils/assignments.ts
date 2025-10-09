import { AssignmentCode } from '@definition/assignment';
import { PersonType, AssignmentType } from '@definition/person';

const duplicateAssignmentsCode = new Set([
  AssignmentCode.MINISTRY_HOURS_CREDIT,
]);

const addAssignmentToDataView = (
  assignmentsView: AssignmentType,
  code: AssignmentCode
) => {
  if (assignmentsView.values.includes(code)) {
    return;
  }
  assignmentsView.values.push(code);
  assignmentsView.updatedAt = new Date().toISOString();

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

    if (assignmentsView.values.includes(other)) {
      assignmentsView.values = assignmentsView.values.filter(
        (c) => c !== other
      );
      assignmentsView.updatedAt = new Date().toISOString();
    }
  }
};

export const toggleAssignment = (
  newPerson: PersonType,
  checked: boolean,
  code: AssignmentCode,
  dataView: string,
  languageGroups: Array<string>
): PersonType => {
  const views = duplicateAssignmentsCode.has(code)
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
          values: [],
          updatedAt: new Date().toISOString(),
        });
        // Further checks are not necessary, as the code has just been added
      }

      // Here the appropriate view is searched in case it already existed
      const personAssignments = newPerson.person_data.assignments.find(
        (a) => a.type === view
      );

      addAssignmentToDataView(personAssignments, code);
    }

    if (!checked) {
      const personAssignments = newPerson.person_data.assignments.find(
        (a) => a.type === view
      );

      if (personAssignments) {
        personAssignments.updatedAt = new Date().toISOString();
        personAssignments.values = personAssignments.values.filter(
          (c) => c !== code
        );
      }
    }
  }

  return newPerson;
};
