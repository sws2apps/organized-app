import { EnrollmentType, PersonType } from '@definition/person';
import { formatDate } from '@services/dateformat';
import { dateFirstDayMonth, dateLastDatePreviousMonth } from '@utils/date';

const personUnarchiveMidweekMeeting = (person: PersonType) => {
  if (person.person_data.midweek_meeting_student.active.value) {
    const current = person.person_data.midweek_meeting_student.history.find(
      (record) => record._deleted === false && record.end_date === null
    );

    if (!current) {
      person.person_data.midweek_meeting_student.history.push({
        id: crypto.randomUUID(),
        _deleted: false,
        updatedAt: new Date().toISOString(),
        start_date: new Date().toISOString(),
        end_date: null,
      });
    }
  }
};

const personUnarchiveUnbaptizedPublisher = (person: PersonType) => {
  if (person.person_data.publisher_unbaptized.active.value) {
    const current = person.person_data.publisher_unbaptized.history.find(
      (record) => record._deleted === false && record.end_date === null
    );

    if (!current) {
      person.person_data.publisher_unbaptized.history.push({
        id: crypto.randomUUID(),
        _deleted: false,
        updatedAt: new Date().toISOString(),
        start_date: dateFirstDayMonth().toISOString(),
        end_date: null,
      });
    }
  }
};

const personUnarchiveBaptizedPublisher = (person: PersonType) => {
  if (person.person_data.publisher_baptized.active.value) {
    const current = person.person_data.publisher_baptized.history.find(
      (record) => record._deleted === false && record.end_date === null
    );

    if (!current) {
      person.person_data.publisher_baptized.history.push({
        id: crypto.randomUUID(),
        _deleted: false,
        updatedAt: new Date().toISOString(),
        start_date: dateFirstDayMonth().toISOString(),
        end_date: null,
      });
    }
  }
};

const personArchiveMidweekMeeting = (
  person: PersonType,
  isAddPerson: boolean
) => {
  if (person.person_data.midweek_meeting_student.active.value) {
    const current = person.person_data.midweek_meeting_student.history.find(
      (record) => record._deleted === false && record.end_date === null
    );

    if (!current) return;

    const start_date = formatDate(new Date(current.start_date), 'yyyy/MM/dd');

    const nowDate = formatDate(new Date(), 'yyyy/MM/dd');

    if (start_date === nowDate) {
      if (isAddPerson) {
        person.person_data.midweek_meeting_student.history =
          person.person_data.midweek_meeting_student.history.filter(
            (record) => record.id !== current.id
          );
      }

      if (!isAddPerson) {
        current._deleted = true;
        current.updatedAt = new Date().toISOString();
      }
    }

    if (start_date !== nowDate) {
      current.end_date = new Date().toISOString();
      current.updatedAt = new Date().toISOString();
    }
  }
};

const personArchiveUnbaptizedPublisher = (
  person: PersonType,
  isAddPerson: boolean
) => {
  if (person.person_data.publisher_unbaptized.active.value) {
    const current = person.person_data.publisher_unbaptized.history.find(
      (record) => record._deleted === false && record.end_date === null
    );

    if (!current) return;

    const start_date = formatDate(new Date(current.start_date), 'yyyy/MM/dd');
    const nowDate = formatDate(new Date(), 'yyyy/MM/dd');

    if (start_date === nowDate) {
      if (isAddPerson) {
        person.person_data.publisher_unbaptized.history =
          person.person_data.publisher_unbaptized.history.filter(
            (record) => record.id !== current.id
          );
      }

      if (!isAddPerson) {
        current._deleted = true;
        current.updatedAt = new Date().toISOString();
      }
    }

    if (start_date !== nowDate) {
      current.end_date = dateLastDatePreviousMonth().toISOString();
      current.updatedAt = new Date().toISOString();
    }
  }
};

const personArchiveBaptizedPublisher = (
  person: PersonType,
  isAddPerson: boolean
) => {
  if (person.person_data.publisher_baptized.active.value) {
    const current = person.person_data.publisher_baptized.history.find(
      (record) => record._deleted === false && record.end_date === null
    );

    if (!current) return;

    const start_date = formatDate(new Date(current.start_date), 'yyyy/MM/dd');
    const nowDate = formatDate(new Date(), 'yyyy/MM/dd');

    if (start_date === nowDate) {
      if (isAddPerson) {
        person.person_data.publisher_baptized.history =
          person.person_data.publisher_baptized.history.filter(
            (record) => record.id !== current.id
          );
      }

      if (!isAddPerson) {
        current._deleted = true;
        current.updatedAt = new Date().toISOString();
      }
    }

    if (start_date !== nowDate) {
      current.end_date = dateLastDatePreviousMonth().toISOString();
      current.updatedAt = new Date().toISOString();
    }
  }
};

const personEndActiveEnrollments = (person: PersonType) => {
  const activeEnrollments = person.person_data.enrollments.filter(
    (record) => record._deleted === false && record.end_date === null
  );

  for (const enrollment of activeEnrollments) {
    enrollment.end_date = dateLastDatePreviousMonth().toISOString();
    enrollment.updatedAt = new Date().toISOString();
  }
};

const personEndActivePrivileges = (person: PersonType) => {
  const activePrivileges = person.person_data.privileges.filter(
    (record) => record._deleted === false && record.end_date === null
  );

  for (const privilege of activePrivileges) {
    privilege.end_date = dateLastDatePreviousMonth().toISOString();
    privilege.updatedAt = new Date().toISOString();
  }
};

export const personAssignmentsRemove = (person: PersonType) => {
  for (const assignment of person.person_data.assignments) {
    if (assignment._deleted === false) {
      assignment._deleted = true;
      assignment.updatedAt = new Date().toISOString();
    }
  }
};

export const personUnarchive = (person: PersonType) => {
  personUnarchiveMidweekMeeting(person);
  personUnarchiveUnbaptizedPublisher(person);
  personUnarchiveBaptizedPublisher(person);

  person.person_data.archived = {
    value: false,
    updatedAt: new Date().toISOString(),
  };
};

export const personArchive = (person: PersonType, isAddPerson: boolean) => {
  personArchiveMidweekMeeting(person, isAddPerson);
  personArchiveUnbaptizedPublisher(person, isAddPerson);
  personArchiveBaptizedPublisher(person, isAddPerson);

  personEndActiveEnrollments(person);
  personEndActivePrivileges(person);

  personAssignmentsRemove(person);

  person.person_data.archived = {
    value: true,
    updatedAt: new Date().toISOString(),
  };
};

export const personIsInactive = (person: PersonType) => {
  let isInactive = false;

  const isBaptized = person.person_data.publisher_baptized.active.value;
  const isUnbaptized = person.person_data.publisher_unbaptized.active.value;

  if (isBaptized) {
    isInactive =
      person.person_data.publisher_baptized.history.filter(
        (record) => record._deleted === false && record.end_date === null
      ).length === 0;
  }

  if (isUnbaptized) {
    isInactive =
      person.person_data.publisher_unbaptized.history.filter(
        (record) => record._deleted === false && record.end_date === null
      ).length === 0;
  }

  return isInactive;
};

export const personIsElder = (person: PersonType) => {
  const hasActive = person.person_data.privileges.find(
    (record) =>
      record.privilege === 'elder' &&
      record.end_date === null &&
      record._deleted === false
  );

  return hasActive ? true : false;
};

export const personIsMS = (person: PersonType) => {
  const hasActive = person.person_data.privileges.find(
    (record) =>
      record.privilege === 'ms' &&
      record.end_date === null &&
      record._deleted === false
  );

  return hasActive ? true : false;
};

export const personIsEnrollmentActive = (
  person: PersonType,
  enrollment: EnrollmentType,
  month?: string
) => {
  if (!month) {
    const isActive = person.person_data.enrollments.some(
      (record) =>
        record.enrollment === enrollment &&
        record.end_date === null &&
        record._deleted === false
    );

    return isActive;
  }

  const history = person.person_data.enrollments.filter(
    (record) =>
      record._deleted === false &&
      record.enrollment === enrollment &&
      record.start_date?.length > 0
  );

  const isActive = history.some((record) => {
    const startDate = new Date(record.start_date);
    const endDate = record.end_date
      ? new Date(record.end_date)
      : new Date(`${month}/01`);

    const startMonth = formatDate(startDate, 'yyyy/MM');
    const endMonth = formatDate(endDate, 'yyyy/MM');

    return month >= startMonth && month <= endMonth;
  });

  return isActive;
};

export const personIsAP = (person: PersonType) => {
  const hasActive = person.person_data.enrollments.find(
    (record) =>
      record.enrollment === 'AP' &&
      record.end_date === null &&
      record._deleted === false
  );

  return hasActive ? true : false;
};

export const personIsFMF = (person: PersonType) => {
  const hasActive = person.person_data.enrollments.find(
    (record) =>
      record.enrollment === 'FMF' &&
      record.end_date === null &&
      record._deleted === false
  );

  return hasActive ? true : false;
};

export const personIsFR = (person: PersonType) => {
  const hasActive = person.person_data.enrollments.find(
    (record) =>
      record.enrollment === 'FR' &&
      record.end_date === null &&
      record._deleted === false
  );

  return hasActive ? true : false;
};

export const personIsFS = (person: PersonType) => {
  const hasActive = person.person_data.enrollments.find(
    (record) =>
      record.enrollment === 'FS' &&
      record.end_date === null &&
      record._deleted === false
  );

  return hasActive ? true : false;
};

export const personHasNoAssignment = (person: PersonType) => {
  const hasNoAssignment =
    person.person_data.assignments.filter((record) => record._deleted === false)
      .length === 0;
  return hasNoAssignment;
};

export const applyNameFilters = ({
  persons,
  searchKey,
  archived,
  allPersons,
}: {
  persons: PersonType[];
  searchKey: string;
  archived?: boolean;
  allPersons?: PersonType[];
}) => {
  const dataPersons: PersonType[] = [];

  if (archived) {
    const archivedPersons = allPersons.filter(
      (record) => record.person_data.archived.value
    );
    dataPersons.push(...archivedPersons);
  } else {
    dataPersons.push(...persons);
  }

  const filteredByName: PersonType[] = [];

  for (const person of dataPersons) {
    const foundFirstName = person.person_data.person_firstname.value
      .toLowerCase()
      .includes(searchKey.toLowerCase());
    const foundLastName = person.person_data.person_lastname.value
      .toLowerCase()
      .includes(searchKey.toLowerCase());
    const foundDisplayName = person.person_data.person_display_name.value
      .toLowerCase()
      .includes(searchKey.toLowerCase());

    if (foundFirstName || foundLastName || foundDisplayName) {
      filteredByName.push(person);
    }
  }

  return filteredByName;
};

export const applyAssignmentFilters = (
  persons: PersonType[],
  filtersKey: number[]
) => {
  const assignments = filtersKey.filter((item) => typeof item === 'number');
  const filteredByAssignments: PersonType[] = [];

  if (assignments.length === 0) {
    filteredByAssignments.push(...persons);
  }

  if (assignments.length > 0) {
    for (const person of persons) {
      let isPassed = false;

      const activeAssignments = person.person_data.assignments.filter(
        (record) => record._deleted === false
      );
      isPassed = activeAssignments.some((record) =>
        assignments.includes(record.code)
      );

      if (isPassed) {
        filteredByAssignments.push(person);
      }
    }
  }

  return filteredByAssignments;
};

export const applyGroupFilters = (
  persons: PersonType[],
  filtersKey: string[]
) => {
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
      const isAppointedBrotherAllFilter = groups.includes(
        'appointedBrotherAll'
      );
      const isElderFilter = groups.includes('elder');
      const isMSFilter = groups.includes('ministerialServant');
      const isMidweekStudentFilter = groups.includes('midweekStudent');
      const isNoAssignmentFilter = groups.includes('noAssignment');

      const male = person.person_data.male.value;
      const female = person.person_data.female.value;
      const anointed = person.person_data.publisher_baptized.anointed.value;
      const isBaptized = person.person_data.publisher_baptized.active.value;
      const isUnbaptized = person.person_data.publisher_unbaptized.active.value;
      const isInactive = personIsInactive(person);
      const isAP = personIsAP(person);
      const isFR = personIsFR(person);
      const isFS = personIsFS(person);
      const isFMF = personIsFMF(person);
      const isElder = personIsElder(person);
      const isMS = personIsMS(person);
      const isMidweekStudent =
        person.person_data.midweek_meeting_student.active.value;
      const hasNoAssignment = personHasNoAssignment(person);

      // male and female not selected
      if (!isMaleFilter && !isFemaleFilter) isPassed = true;

      // male selected
      if (isMaleFilter && !isFemaleFilter) isPassed = male;

      // female selected
      if (!isMaleFilter && isFemaleFilter) isPassed = female;

      // anointed selected
      if (isAnointedFilter) isPassed = anointed;

      // baptized selected
      if (isPassed && isBaptizedFilter) isPassed = isBaptized;

      // unbaptized selected
      if (isPassed && isUnbaptizedFilter) isPassed = isUnbaptized;

      // active selected
      if (isPassed && isActiveFilter) isPassed = !isInactive;

      // inactive selected
      if (isPassed && isInactiveFilter)
        isPassed = (isBaptized || isUnbaptized) && isInactive;

      // all pioneers selected
      if (isPassed && isPioneerAllFilter)
        isPassed = isAP || isFR || isFS || isFMF;

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

export const updateRecentPersons = (
  person_uid: string,
  action: 'add' | 'remove'
) => {
  let recentPersons: string[] = JSON.parse(
    localStorage.getItem('personsRecent') || '[]'
  );

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

export const personIsBaptizedPublisher = (
  person: PersonType,
  month?: string
) => {
  // default month to current month if undefined
  if (!month) {
    month = formatDate(new Date(), 'yyyy/MM');
  }

  const isValid = person.person_data.publisher_baptized.history.some(
    (record) => {
      if (record._deleted) return false;
      if (!record.start_date) return false;

      const startDate = new Date(record.start_date);
      const endDate = record.end_date
        ? new Date(record.end_date)
        : new Date(`${month}/01`);

      const startMonth = formatDate(startDate, 'yyyy/MM');
      const endMonth = formatDate(endDate, 'yyyy/MM');

      return month >= startMonth && month <= endMonth;
    }
  );

  return isValid;
};

export const personIsUnbaptizedPublisher = (
  person: PersonType,
  month?: string
) => {
  // default month to current month if undefined
  if (!month) {
    month = formatDate(new Date(), 'yyyy/MM');
  }

  const isValid = person.person_data.publisher_unbaptized.history.some(
    (record) => {
      if (record._deleted) return false;
      if (!record.start_date) return false;

      const startDate = new Date(record.start_date);
      const endDate = record.end_date
        ? new Date(record.end_date)
        : new Date(`${month}/01`);

      const startMonth = formatDate(startDate, 'yyyy/MM');
      const endMonth = formatDate(endDate, 'yyyy/MM');

      return month >= startMonth && month <= endMonth;
    }
  );

  return isValid;
};

export const personIsPublisher = (person: PersonType, month?: string) => {
  // default month to current month if undefined
  if (!month) {
    month = formatDate(new Date(), 'yyyy/MM');
  }

  const isBaptized = personIsBaptizedPublisher(person, month);
  const isUnbaptized = personIsUnbaptizedPublisher(person, month);

  return isBaptized || isUnbaptized;
};

export const personIsMidweekStudent = (person: PersonType) => {
  return person.person_data.midweek_meeting_student.active.value;
};
