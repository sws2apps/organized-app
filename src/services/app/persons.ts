import { store } from '@states/index';
import {
  EnrollmentType,
  PersonType,
  PrivilegeType,
  TimeAwayType,
} from '@definition/person';
import {
  displayNameMeetingsEnableState,
  fullnameOptionState,
  userDataViewState,
} from '@states/settings';
import { buildPersonFullname } from '@utils/common';
import {
  addDays,
  dateFirstDayMonth,
  dateLastDatePreviousMonth,
  formatDate,
  formatDateShortMonth,
} from '@utils/date';
import { AppRoleType } from '@definition/app';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import { APP_READ_ONLY_ROLES } from '@constants/index';
import { getTranslation } from '@services/i18n/translation';

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
  const dataView = store.get(userDataViewState);

  const assignments = person.person_data.assignments.find(
    (a) => a.type === dataView
  );

  if (assignments) {
    assignments.values = [];
    assignments.updatedAt = new Date().toISOString();
  }

  if (!assignments) {
    person.person_data.assignments.push({
      type: dataView,
      updatedAt: new Date().toISOString(),
      values: [],
    });
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

export const personIsActive = (person: PersonType) => {
  let isActive = false;

  const isBaptized = person.person_data.publisher_baptized.active.value;
  const isUnbaptized = person.person_data.publisher_unbaptized.active.value;

  if (isBaptized) {
    isActive = person.person_data.publisher_baptized.history.some(
      (record) => record._deleted === false && record.end_date === null
    );
  }

  if (isUnbaptized) {
    isActive = person.person_data.publisher_unbaptized.history.some(
      (record) => record._deleted === false && record.end_date === null
    );
  }

  return isActive;
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
  const dataView = store.get(userDataViewState);

  const assignments =
    person.person_data.assignments.find((a) => a.type === dataView)?.values ??
    [];

  return assignments.length === 0;
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
  const dataView = store.get(userDataViewState);

  const assignments = filtersKey.filter((item) => typeof item === 'number');
  const filteredByAssignments: PersonType[] = [];

  if (assignments.length === 0) {
    filteredByAssignments.push(...persons);
  }

  if (assignments.length > 0) {
    for (const person of persons) {
      let isPassed = false;

      const activeAssignments =
        person.person_data.assignments.find((a) => a.type === dataView)
          ?.values ?? [];

      isPassed = activeAssignments.some((record) =>
        assignments.includes(record)
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

      const isFamilyHeadFilter = groups.includes('familyHead');
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
      const isActive = personIsActive(person);
      const isAP = personIsAP(person);
      const isFR = personIsFR(person);
      const isFS = personIsFS(person);
      const isFMF = personIsFMF(person);
      const isElder = personIsElder(person);
      const isMS = personIsMS(person);
      const isMidweekStudent =
        person.person_data.midweek_meeting_student.active.value;
      const hasNoAssignment = personHasNoAssignment(person);
      const isFamilyHead = person.person_data.family_members?.head;

      // if you want to add another condition here, add it after the male and
      // female check to avoid it to be overwritten

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
      if (isPassed && isActiveFilter) isPassed = isActive;

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

      // family head selected
      if (isPassed && isFamilyHeadFilter) isPassed = isFamilyHead;

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

  const isValid = person.person_data.publisher_baptized?.history.some(
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

  return isValid ?? false;
};

export const personIsUnbaptizedPublisher = (
  person: PersonType,
  month?: string
) => {
  // default month to current month if undefined
  if (!month) {
    month = formatDate(new Date(), 'yyyy/MM');
  }

  const isValid = person.person_data.publisher_unbaptized?.history.some(
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

  return isValid ?? false;
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

export const personsSortByName = (persons: PersonType[]) => {
  const fullnameOption = store.get(fullnameOptionState);

  return persons
    .filter((person) => person._deleted?.value === false)
    .sort((a, b) => {
      const fullnameA = buildPersonFullname(
        a.person_data.person_lastname.value,
        a.person_data.person_firstname.value,
        fullnameOption
      );
      const fullnameB = buildPersonFullname(
        b.person_data.person_lastname.value,
        b.person_data.person_firstname.value,
        fullnameOption
      );

      return fullnameA.localeCompare(fullnameB, undefined, {
        sensitivity: 'base',
      });
    });
};

export const personsUpdateAssignments = (persons: PersonType[]) => {
  persons.forEach((person) => {
    const assignments = person.person_data.assignments;

    if (assignments.length === 0) {
      assignments.push({
        type: 'main',
        updatedAt: '',
        values: [],
      });
    }

    if (assignments.length > 0 && 'code' in assignments.at(0)) {
      const codes: number[] = assignments
        .filter((a) => !a['_deleted'])
        .map((a) => a['code']);

      person.person_data.assignments.length = 0;
      person.person_data.assignments = [
        {
          type: 'main',
          updatedAt: new Date().toISOString(),
          values: codes.filter((code) => code !== undefined),
        },
      ];
    }

    person.person_data.assignments = person.person_data.assignments.filter(
      (record) => 'code' in record === false
    );
  });

  return persons;
};

const personIsPrivilegeActive = (
  person: PersonType,
  privilege: PrivilegeType,
  month?: string
) => {
  if (!month) {
    const isActive = person.person_data.privileges.some(
      (record) =>
        record.privilege === privilege &&
        record.end_date === null &&
        record._deleted === false
    );

    return isActive;
  }

  const history = person.person_data.privileges.filter(
    (record) =>
      record._deleted === false &&
      record.privilege === privilege &&
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

export const refreshReadOnlyRoles = (
  person: PersonType,
  initial: AppRoleType[] = []
) => {
  const userRole: AppRoleType[] = [];

  if (!person) return userRole;

  // cleanup
  initial = initial.filter((record) => !APP_READ_ONLY_ROLES.includes(record));

  const groups = store.get(fieldWithLanguageGroupsState);

  const isMidweekStudent = personIsMidweekStudent(person);

  const isPublisher =
    personIsBaptizedPublisher(person) || personIsUnbaptizedPublisher(person);

  const isElder = personIsPrivilegeActive(person, 'elder');
  const isMS = personIsPrivilegeActive(person, 'ms');

  if (isMidweekStudent || isPublisher) {
    userRole.push('view_schedules');
  }

  if (isPublisher) {
    userRole.push('publisher');
  }

  if (isElder) {
    userRole.push('elder');
  }

  if (isMS) {
    userRole.push('ms');
  }

  const group = groups.find((record) =>
    record.group_data.members.some(
      (member) => member.person_uid === person.person_uid
    )
  );

  const publisher = group?.group_data.members.find(
    (member) => member.person_uid === person.person_uid
  );

  if (publisher) {
    const isLanguageGroup = group.group_data.language_group;
    const isOverseer = publisher?.isOverseer || publisher?.isAssistant || false;

    if (isOverseer) {
      userRole.push(
        isLanguageGroup ? 'language_group_overseers' : 'group_overseers'
      );
    }
  }

  return Array.from(new Set([...initial, ...userRole]));
};

export const personsFilterActiveTimeAway = (records: TimeAwayType[]) => {
  const cutoffDays = 3;

  return records.filter((record) => {
    if (record._deleted === true) return false;
    if (!record.end_date) return true;

    const limitDate = formatDate(new Date(), 'yyyy/MM/dd');

    const endDatePlusCutoff = addDays(record.end_date, cutoffDays);
    const date = formatDate(endDatePlusCutoff, 'yyyy/MM/dd');

    // Show if today is before or equal to endDatePlusCutoff
    return date >= limitDate;
  });
};

export const personGetScheduleName = (person: PersonType) => {
  const useDisplayName = store.get(displayNameMeetingsEnableState);

  const fullnameOption = store.get(fullnameOptionState);
  const firstName = person.person_data.person_firstname.value;
  const lastName = person.person_data.person_lastname.value;

  let result = '';

  if (useDisplayName) {
    result = person.person_data.person_display_name.value;
  }

  if (!useDisplayName) {
    result = buildPersonFullname(lastName, firstName, fullnameOption);
  }

  return result;
};

export const isPersonBlockedOnDate = (
  person: PersonType,
  targetDate: string
): boolean => {
  const timeAways = person.person_data.timeAway;
  if (!timeAways || timeAways.length === 0) return false;

  return timeAways.some((record) => {
    if (record._deleted || !record.start_date) return false;

    const startDateStr = formatDate(new Date(record.start_date), 'yyyy/MM/dd');

    const endDateStr = record.end_date
      ? formatDate(new Date(record.end_date), 'yyyy/MM/dd')
      : startDateStr;

    return targetDate >= startDateStr && targetDate <= endDateStr;
  });
};

export const personIsAway = (person: PersonType, date: string) => {
  const timeAwaysActive =
    person.person_data.timeAway
      ?.filter((record) => {
        if (record._deleted) return false;
        if (!record.start_date) return false;

        return true;
      })
      .sort((a, b) => {
        return a.start_date.localeCompare(b.start_date);
      }) ?? [];

  const timeAway = timeAwaysActive.find((record) => {
    if (record._deleted) return false;
    if (!record.start_date) return false;

    const startDate = formatDate(new Date(record.start_date), 'yyyy/MM/dd');
    const endDate = record.end_date
      ? formatDate(new Date(record.end_date), 'yyyy/MM/dd')
      : date;

    return startDate <= date && endDate >= date;
  });

  if (!timeAway) return;

  const startDate = formatDateShortMonth(timeAway.start_date);

  let endDate = '';

  if (timeAway.end_date) {
    endDate = formatDateShortMonth(timeAway.end_date);
  }

  const rangeValue = endDate
    ? getTranslation({
        key: 'tr_dateRangeNoYear',
        params: { startDate, endDate },
      })
    : startDate;

  return getTranslation({
    key: 'tr_personAwayNotice',
    params: { date: rangeValue },
  });
};
