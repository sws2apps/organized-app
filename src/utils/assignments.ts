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

  if (checked) {
    const views: string[] = [];

    if (duplicateAssignmentsCode.includes(code)) {
      views.push('main', ...languageGroups);
    } else {
      views.push(dataView);
    }

    for (const view of views) {
      const personAssignments = newPerson.person_data.assignments.find(
        (a) => a.type === view
      );

      const currentItems = personAssignments?.values ?? [];
      const hasCurrent = currentItems.includes(code);

      if (!hasCurrent) {
        if (personAssignments) {
          personAssignments.values.push(code);
          personAssignments.updatedAt = new Date().toISOString();
        }

        if (!personAssignments) {
          newPerson.person_data.assignments.push({
            type: view,
            values: [code],
            updatedAt: new Date().toISOString(),
          });
        }
      }

      if (code === AssignmentCode.WM_Speaker) {
        const symposium = currentItems.includes(
          AssignmentCode.WM_SpeakerSymposium
        );

        if (symposium) {
          personAssignments.updatedAt = new Date().toISOString();
          personAssignments.values = personAssignments.values.filter(
            (c) => c !== AssignmentCode.WM_SpeakerSymposium
          );
        }
      }

      if (code === AssignmentCode.WM_SpeakerSymposium) {
        const speaker = currentItems.includes(AssignmentCode.WM_Speaker);

        if (speaker) {
          personAssignments.updatedAt = new Date().toISOString();
          personAssignments.values = personAssignments.values.filter(
            (c) => c !== AssignmentCode.WM_Speaker
          );
        }
      }
    }
  }

  if (!checked) {
    if (duplicateAssignmentsCode.includes(code)) {
      newPerson.person_data.assignments.forEach((assignments) => {
        assignments.updatedAt = new Date().toISOString();
        assignments.values = assignments.values.filter((c) => c !== code);
      });
    } else {
      const personAssignments = newPerson.person_data.assignments.find(
        (a) => a.type === dataView
      );

      personAssignments.updatedAt = new Date().toISOString();
      personAssignments.values = personAssignments.values.filter(
        (c) => c !== code
      );
    }
  }

  return newPerson;
};
