import { PersonType } from '@definition/person';
import { formatDate } from '@services/dateformat';
import { dateFirstDayMonth, dateLastDatePreviousMonth } from '@utils/date';

const personUnarchiveMidweekMeeting = (person: PersonType) => {
  if (person.midweekMeetingStudent.active.value) {
    const current = person.midweekMeetingStudent.history.find(
      (record) => record._deleted === null && record.endDate.value === null
    );

    if (!current) {
      person.midweekMeetingStudent.history.push({
        id: crypto.randomUUID(),
        startDate: { value: new Date().toISOString(), updatedAt: new Date().toISOString() },
        endDate: { value: null, updatedAt: new Date().toISOString() },
        _deleted: null,
      });
    }
  }
};

const personUnarchiveUnbaptizedPublisher = (person: PersonType) => {
  if (person.unbaptizedPublisher.active.value) {
    const current = person.unbaptizedPublisher.history.find(
      (record) => record._deleted === null && record.endDate.value === null
    );

    if (!current) {
      person.unbaptizedPublisher.history.push({
        id: crypto.randomUUID(),
        startDate: { value: dateFirstDayMonth().toISOString(), updatedAt: new Date().toISOString() },
        endDate: { value: null, updatedAt: new Date().toISOString() },
        _deleted: null,
      });
    }
  }
};

const personUnarchiveBaptizedPublisher = (person: PersonType) => {
  if (person.baptizedPublisher.active.value) {
    const current = person.baptizedPublisher.history.find(
      (record) => record._deleted === null && record.endDate.value === null
    );

    if (!current) {
      person.baptizedPublisher.history.push({
        id: crypto.randomUUID(),
        startDate: { value: dateFirstDayMonth().toISOString(), updatedAt: new Date().toISOString() },
        endDate: { value: null, updatedAt: new Date().toISOString() },
        _deleted: null,
      });
    }
  }
};

const personArchiveMidweekMeeting = (person: PersonType, isAddPerson: boolean) => {
  if (person.midweekMeetingStudent.active.value) {
    const current = person.midweekMeetingStudent.history.find(
      (record) => record._deleted === null && record.endDate.value === null
    );

    const startDate = formatDate(new Date(current.startDate.value), 'mm/dd/yyyy');
    const nowDate = formatDate(new Date(), 'mm/dd/yyyy');

    if (startDate === nowDate) {
      if (isAddPerson) {
        person.midweekMeetingStudent.history = person.midweekMeetingStudent.history.filter(
          (record) => record.id !== current.id
        );
      }

      if (!isAddPerson) {
        current._deleted = new Date().toISOString();
      }
    }

    if (startDate !== nowDate) {
      current.endDate.value = new Date().toISOString();
      current.endDate.updatedAt = new Date().toISOString();
    }
  }
};

const personArchiveUnbaptizedPublisher = (person: PersonType, isAddPerson: boolean) => {
  if (person.unbaptizedPublisher.active.value) {
    const current = person.unbaptizedPublisher.history.find(
      (record) => record._deleted === null && record.endDate.value === null
    );

    const startDate = formatDate(new Date(current.startDate.value), 'mm/dd/yyyy');
    const nowDate = formatDate(new Date(), 'mm/dd/yyyy');

    if (startDate === nowDate) {
      if (isAddPerson) {
        person.unbaptizedPublisher.history = person.unbaptizedPublisher.history.filter(
          (record) => record.id !== current.id
        );
      }

      if (!isAddPerson) {
        current._deleted = new Date().toISOString();
      }
    }

    if (startDate !== nowDate) {
      current.endDate.value = dateLastDatePreviousMonth().toISOString();
      current.endDate.updatedAt = new Date().toISOString();
    }
  }
};

const personArchiveBaptizedPublisher = (person: PersonType, isAddPerson: boolean) => {
  if (person.baptizedPublisher.active.value) {
    const current = person.baptizedPublisher.history.find(
      (record) => record._deleted === null && record.endDate.value === null
    );

    const startDate = formatDate(new Date(current.startDate.value), 'mm/dd/yyyy');
    const nowDate = formatDate(new Date(), 'mm/dd/yyyy');

    if (startDate === nowDate) {
      if (isAddPerson) {
        person.baptizedPublisher.history = person.baptizedPublisher.history.filter(
          (record) => record.id !== current.id
        );
      }

      if (!isAddPerson) {
        current._deleted = new Date().toISOString();
      }
    }

    if (startDate !== nowDate) {
      current.endDate.value = dateLastDatePreviousMonth().toISOString();
      current.endDate.updatedAt = new Date().toISOString();
    }
  }
};

const personEndActiveEnrollments = (person: PersonType) => {
  const activeEnrollments = person.enrollments.filter(
    (record) => record._deleted === null && record.endDate.value === null
  );

  for (const enrollment of activeEnrollments) {
    enrollment.endDate = { value: dateLastDatePreviousMonth().toISOString(), updatedAt: new Date().toISOString() };
  }
};

const personEndActivePrivileges = (person: PersonType) => {
  const activePrivileges = person.privileges.filter(
    (record) => record._deleted === null && record.endDate.value === null
  );

  for (const privilege of activePrivileges) {
    privilege.endDate = { value: dateLastDatePreviousMonth().toISOString(), updatedAt: new Date().toISOString() };
  }
};

export const personAssignmentsRemove = (person: PersonType) => {
  for (const assignment of person.assignments) {
    if (assignment._deleted === null) {
      assignment._deleted = new Date().toISOString();
    }
  }
};

export const personUnarchive = (person: PersonType) => {
  personUnarchiveMidweekMeeting(person);
  personUnarchiveUnbaptizedPublisher(person);
  personUnarchiveBaptizedPublisher(person);

  person.isArchived = { value: false, updatedAt: new Date().toISOString() };
};

export const personArchive = (person: PersonType, isAddPerson: boolean) => {
  personArchiveMidweekMeeting(person, isAddPerson);
  personArchiveUnbaptizedPublisher(person, isAddPerson);
  personArchiveBaptizedPublisher(person, isAddPerson);

  personEndActiveEnrollments(person);
  personEndActivePrivileges(person);

  personAssignmentsRemove(person);

  person.isArchived = { value: true, updatedAt: new Date().toISOString() };
};

export const personIsInactive = (person: PersonType) => {
  let isInactive = false;

  const isBaptized = person.baptizedPublisher.active.value;
  const isUnbaptized = person.unbaptizedPublisher.active.value;

  if (isBaptized) {
    isInactive =
      person.baptizedPublisher.history.filter((record) => record._deleted === null && record.endDate.value === null)
        .length === 0;
  }

  if (isUnbaptized) {
    isInactive =
      person.unbaptizedPublisher.history.filter((record) => record._deleted === null && record.endDate.value === null)
        .length === 0;
  }

  return isInactive;
};

export const personIsElder = (person: PersonType) => {
  const hasActive = person.privileges.find(
    (record) => record.privilege.value === 'elder' && record.endDate.value === null && record._deleted === null
  );

  return hasActive ? true : false;
};

export const personIsMS = (person: PersonType) => {
  const hasActive = person.privileges.find(
    (record) => record.privilege.value === 'ms' && record.endDate.value === null && record._deleted === null
  );

  return hasActive ? true : false;
};

export const personIsAP = (person: PersonType) => {
  const hasActive = person.enrollments.find(
    (record) => record.enrollment.value === 'AP' && record.endDate.value === null && record._deleted === null
  );

  return hasActive ? true : false;
};

export const personIsFMF = (person: PersonType) => {
  const hasActive = person.enrollments.find(
    (record) => record.enrollment.value === 'FMF' && record.endDate.value === null && record._deleted === null
  );

  return hasActive ? true : false;
};

export const personIsFR = (person: PersonType) => {
  const hasActive = person.enrollments.find(
    (record) => record.enrollment.value === 'FR' && record.endDate.value === null && record._deleted === null
  );

  return hasActive ? true : false;
};

export const personIsFS = (person: PersonType) => {
  const hasActive = person.enrollments.find(
    (record) => record.enrollment.value === 'FS' && record.endDate.value === null && record._deleted === null
  );

  return hasActive ? true : false;
};

export const personHasNoAssignment = (person: PersonType) => {
  const hasNoAssignment = person.assignments.filter((record) => record._deleted === null).length === 0;
  return hasNoAssignment;
};

export const applyNameFilters = ({
  persons,
  searchKey,
  isArchived,
  allPersons,
}: {
  persons: PersonType[];
  searchKey: string;
  isArchived?: boolean;
  allPersons?: PersonType[];
}) => {
  const dataPersons: PersonType[] = [];

  if (isArchived) {
    const archivedPersons = allPersons.filter((record) => record.isArchived.value);
    dataPersons.push(...archivedPersons);
  } else {
    dataPersons.push(...persons);
  }

  const filteredByName: PersonType[] = [];

  for (const person of dataPersons) {
    const foundFirstName = person.person_firstname.value.toLowerCase().includes(searchKey.toLowerCase());
    const foundLastName = person.person_lastname.value.toLowerCase().includes(searchKey.toLowerCase());
    const foundDisplayName = person.person_displayName.value.toLowerCase().includes(searchKey.toLowerCase());

    if (foundFirstName || foundLastName || foundDisplayName) {
      filteredByName.push(person);
    }
  }

  return filteredByName;
};

export const applyAssignmentFilters = (persons: PersonType[], filtersKey: number[]) => {
  const assignments = filtersKey.filter((item) => typeof item === 'number');
  const filteredByAssignments: PersonType[] = [];

  if (assignments.length === 0) {
    filteredByAssignments.push(...persons);
  }

  if (assignments.length > 0) {
    for (const person of persons) {
      let isPassed = false;

      const activeAssignments = person.assignments.filter((record) => record._deleted === null);
      isPassed = activeAssignments.some((record) => assignments.includes(record.code));

      if (isPassed) {
        filteredByAssignments.push(person);
      }
    }
  }

  return filteredByAssignments;
};

export const applyGroupFilters = (persons: PersonType[], filtersKey: string[]) => {
  const groups = filtersKey.filter((item) => typeof item === 'string');

  const finalResult: PersonType[] = [];

  if (groups.length === 0) {
    finalResult.push(...persons);
  }

  if (groups.length > 0) {
    for (const person of persons) {
      let isPassed = false;

      const isMaleFilter = groups.includes('male');
      const isFemaleFilter = groups.includes('female');
      const isAnointedFilter = groups.includes('anointed');
      const isBaptizedFilter = groups.includes('baptized');
      const isUnbaptizedFilter = groups.includes('unbaptized');
      const isActiveFilter = groups.includes('active');
      const isInactiveFilter = groups.includes('inactive');
      const isPioneerAllFilter = groups.includes('pioneerAll');
      const isAPFilter = groups.includes('AP');
      const isFRFilter = groups.includes('FR');
      const isFSFilter = groups.includes('FS');
      const isFMFFilter = groups.includes('FMF');
      const isAppointedBrotherAllFilter = groups.includes('appointedBrotherAll');
      const isElderFilter = groups.includes('elder');
      const isMSFilter = groups.includes('ministerialServant');
      const isMidweekStudentFilter = groups.includes('midweekStudent');
      const isNoAssignmentFilter = groups.includes('noAssignment');

      const isMale = person.isMale.value;
      const isFemale = person.isFemale.value;
      const isAnointed = person.baptizedPublisher.isAnointed.value;
      const isBaptized = person.baptizedPublisher.active.value;
      const isUnbaptized = person.unbaptizedPublisher.active.value;
      const isInactive = personIsInactive(person);
      const isAP = personIsAP(person);
      const isFR = personIsFR(person);
      const isFS = personIsFS(person);
      const isFMF = personIsFMF(person);
      const isElder = personIsElder(person);
      const isMS = personIsMS(person);
      const isMidweekStudent = person.midweekMeetingStudent.active.value;
      const hasNoAssignment = personHasNoAssignment(person);

      // male and female not selected
      if (!isMaleFilter && !isFemaleFilter) isPassed = true;

      // male selected
      if (isMaleFilter && !isFemaleFilter) isPassed = isMale;

      // female selected
      if (!isMaleFilter && isFemaleFilter) isPassed = isFemale;

      // anointed selected
      if (isAnointedFilter) isPassed = isAnointed;

      // baptized selected
      if (isPassed && isBaptizedFilter) isPassed = isBaptized;

      // unbaptized selected
      if (isPassed && isUnbaptizedFilter) isPassed = isUnbaptized;

      // active selected
      if (isPassed && isActiveFilter) isPassed = !isInactive;

      // inactive selected
      if (isPassed && isInactiveFilter) isPassed = (isBaptized || isUnbaptized) && isInactive;

      // all pioneers selected
      if (isPassed && isPioneerAllFilter) isPassed = isAP || isFR || isFS || isFMF;

      // AP selected
      if (isPassed && isAPFilter) isPassed = isAP;

      // FR selected
      if (isPassed && isFRFilter) isPassed = isFR;

      // FS selected
      if (isPassed && isFSFilter) isPassed = isFS;

      // FMF selected
      if (isPassed && isFMFFilter) isPassed = isFMF;

      // all appointed brothers selected
      if (isPassed && isAppointedBrotherAllFilter) isPassed = isElder || isMS;

      // elder selected
      if (isPassed && isElderFilter) isPassed = isElder;

      // ministerial servant selected
      if (isPassed && isMSFilter) isPassed = isMS;

      // midweek student selected
      if (isPassed && isMidweekStudentFilter) isPassed = isMidweekStudent;

      // no assignment selected
      if (isPassed && isNoAssignmentFilter) isPassed = hasNoAssignment;

      if (isPassed) {
        finalResult.push(person);
      }
    }
  }

  return finalResult;
};

export const updateRecentPersons = (person_uid: string, action: 'add' | 'remove') => {
  let recentPersons: string[] = JSON.parse(localStorage.getItem('personsRecent') || '[]');

  if (action === 'add') {
    const length = recentPersons.length;

    if (length === 12) {
      recentPersons.shift();
    }

    const isExist = recentPersons.find((record) => record === person_uid);
    if (!isExist) recentPersons.push(person_uid);
  }

  if (action === 'remove') {
    recentPersons = recentPersons.filter((record) => record !== person_uid);
  }

  localStorage.setItem('personsRecent', JSON.stringify(recentPersons));

  return recentPersons;
};
