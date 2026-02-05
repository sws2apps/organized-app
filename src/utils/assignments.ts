import { AssignmentCode } from '@definition/assignment';
import { PersonType, AssignmentType } from '@definition/person';
import { AssignmentHistoryType } from '@definition/schedules';
import { personIsFR, personIsFS } from '@services/app/persons';
import { formatDate, getWeekDate } from './date';
import { schedulesGetMeetingDate } from '@services/app/schedules';

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

const checkAssignmentUnappliable = (
  person: PersonType,
  dataView: string,
  code: AssignmentCode
) => {
  let isDisabled = true;

  const assignments =
    person.person_data.assignments.find((a) => a.type === dataView)?.values ??
    [];

  if (code === AssignmentCode.MINISTRY_HOURS_CREDIT) {
    const isFR = personIsFR(person);
    const isFS = personIsFS(person);

    const isPioneer = isFR || isFS;

    return !isPioneer;
  }

  if (code === AssignmentCode.MM_AssistantOnly) {
    if (
      assignments.some(
        (record) =>
          (record >= AssignmentCode.MM_StartingConversation &&
            record <= AssignmentCode.MM_Discussion) ||
          record === AssignmentCode.MM_Talk
      )
    ) {
      return true;
    }
  }

  if (
    (code >= AssignmentCode.MM_StartingConversation &&
      code <= AssignmentCode.MM_Discussion) ||
    code === AssignmentCode.MM_Talk
  ) {
    if (
      assignments.some((record) => record === AssignmentCode.MM_AssistantOnly)
    ) {
      return true;
    }
  }
  const male = person.person_data.male.value;
  if (male) isDisabled = false;

  if (!male) {
    if (code === AssignmentCode.MM_StartingConversation) isDisabled = false;
    if (code === AssignmentCode.MM_FollowingUp) isDisabled = false;
    if (code === AssignmentCode.MM_MakingDisciples) isDisabled = false;
    if (code === AssignmentCode.MM_ExplainingBeliefs) isDisabled = false;
    if (code === AssignmentCode.MM_AssistantOnly) isDisabled = false;
  }
  return isDisabled;
};

export const toggleAssignment = (
  newPerson: PersonType,
  checked: boolean,
  code: AssignmentCode,
  dataView: string,
  languageGroups: Array<string>
): PersonType => {
  if (
    checked &&
    !newPerson.person_data.publisher_baptized.active.value &&
    !newPerson.person_data.publisher_unbaptized.active.value &&
    !newPerson.person_data.midweek_meeting_student.active.value
  ) {
    return newPerson;
  }

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

      if (!checkAssignmentUnappliable(newPerson, dataView, code)) {
        addAssignmentToDataView(personAssignments, code);
      }
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

export const resolveAssignmentDate = (
  record: AssignmentHistoryType,
  shortDateFormat: string
) => {
  const obj = structuredClone(record);

  const isMidweek = obj.assignment.key.startsWith('MM_');

  const meetingDate = schedulesGetMeetingDate({
    week: obj.weekOf,
    meeting: isMidweek ? 'midweek' : 'weekend',
    dataView: obj.assignment.dataView,
  });

  if (meetingDate.date.length > 0) {
    obj.weekOf = meetingDate.date;
    obj.weekOfFormatted = formatDate(
      new Date(meetingDate.date),
      shortDateFormat
    );
  }

  if (obj.weekOf.length === 0) {
    obj.weekOf = formatDate(getWeekDate(), 'yyyy/MM/dd');
  }

  return obj;
};
