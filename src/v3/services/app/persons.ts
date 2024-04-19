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
    (record) => record.privilege.value === 'elder' && record.endDate.value === null
  );

  return hasActive ? true : false;
};

export const personIsMS = (person: PersonType) => {
  const hasActive = person.privileges.find(
    (record) => record.privilege.value === 'ms' && record.endDate.value === null
  );

  return hasActive ? true : false;
};

export const personIsAP = (person: PersonType) => {
  const hasActive = person.enrollments.find(
    (record) => record.enrollment.value === 'AP' && record.endDate.value === null
  );

  return hasActive ? true : false;
};

export const personIsFMF = (person: PersonType) => {
  const hasActive = person.enrollments.find(
    (record) => record.enrollment.value === 'FMF' && record.endDate.value === null
  );

  return hasActive ? true : false;
};

export const personIsFR = (person: PersonType) => {
  const hasActive = person.enrollments.find(
    (record) => record.enrollment.value === 'FR' && record.endDate.value === null
  );

  return hasActive ? true : false;
};

export const personIsFS = (person: PersonType) => {
  const hasActive = person.enrollments.find(
    (record) => record.enrollment.value === 'FS' && record.endDate.value === null
  );

  return hasActive ? true : false;
};
