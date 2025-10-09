import { PersonType } from '@definition/person';
import { formatDate } from './date';
import { dateFirstDayMonth } from '@utils/date';

export const toggleMidweekMeetingStudent = (
  newPerson: PersonType,
  checked: boolean,
  isAddPerson: boolean
) => {
  if (newPerson.person_data.publisher_baptized.active.value) {
    return;
  }

  if (newPerson.person_data.publisher_unbaptized.active.value) {
    return;
  }

  newPerson.person_data.midweek_meeting_student.active.value = checked;
  newPerson.person_data.midweek_meeting_student.active.updatedAt =
    new Date().toISOString();

  if (checked) {
    const current = newPerson.person_data.midweek_meeting_student.history.find(
      (record) => record.end_date === null
    );

    if (!current) {
      newPerson.person_data.midweek_meeting_student.history.push({
        id: crypto.randomUUID(),
        _deleted: false,
        updatedAt: new Date().toISOString(),
        start_date: dateFirstDayMonth().toISOString(),
        end_date: null,
      });
    }
  }

  if (!checked) {
    const current = newPerson.person_data.midweek_meeting_student.history.find(
      (record) => record.end_date === null
    );

    if (current && isAddPerson) {
      newPerson.person_data.midweek_meeting_student.history =
        newPerson.person_data.midweek_meeting_student.history.filter(
          (record) => record.id !== current.id
        );
    }

    if (current && !isAddPerson) {
      current.end_date = new Date().toISOString();
      current.updatedAt = new Date().toISOString();
    }
  }
};

export const midweekMeetingStudentStartDateChange = (
  newPerson: PersonType,
  id: string,
  value: Date
) => {
  const current = newPerson.person_data.midweek_meeting_student.history.find(
    (history) => history.id === id
  );

  if (!current) {
    console.error(`Midweek meeting student history with id ${id} not found`);
    return;
  }

  current.start_date = value.toISOString();
  current.updatedAt = new Date().toISOString();
};

export const updateFirstReport = (newPerson: PersonType) => {
  const baptizedHistory =
    newPerson.person_data.publisher_baptized.history.filter(
      (record) => !record._deleted && record.start_date !== null
    );

  const unbaptizedHistory =
    newPerson.person_data.publisher_unbaptized.history.filter(
      (record) => !record._deleted && record.start_date !== null
    );

  const history = baptizedHistory.concat(unbaptizedHistory);

  if (history.length === 0) return;

  const minDateMs = Math.min(
    ...history.map((r) => new Date(r.start_date).getTime())
  );
  const minDate = formatDate(new Date(minDateMs), 'yyyy/MM/dd');

  const firstReport = newPerson.person_data.first_report?.value;

  const currentFirstReport = firstReport
    ? formatDate(new Date(firstReport), 'yyyy/MM/dd')
    : null;

  if (minDate !== currentFirstReport) {
    newPerson.person_data.first_report = {
      value: minDate,
      updatedAt: new Date().toISOString(),
    };
  }
};

export const toggleUnbaptizedPublisher = (
  newPerson: PersonType,
  checked: boolean,
  isAddPerson: boolean
) => {
  if (newPerson.person_data.publisher_baptized.active.value) {
    return;
  }

  if (checked) {
    toggleMidweekMeetingStudent(newPerson, false, isAddPerson);
  }

  newPerson.person_data.publisher_unbaptized.active.value = checked;
  newPerson.person_data.publisher_unbaptized.active.updatedAt =
    new Date().toISOString();

  if (!checked) {
    const current = newPerson.person_data.publisher_unbaptized.history.find(
      (record) => record.end_date === null
    );

    if (current && isAddPerson) {
      newPerson.person_data.publisher_unbaptized.history =
        newPerson.person_data.publisher_unbaptized.history.filter(
          (record) => record.id !== current.id
        );
    }

    if (current && !isAddPerson) {
      current.end_date = new Date().toISOString();
      current.updatedAt = new Date().toISOString();
    }
  }
};
export const toggleBaptizedPublisher = (
  newPerson: PersonType,
  checked: boolean,
  isAddPerson: boolean
) => {
  if (checked) {
    toggleMidweekMeetingStudent(newPerson, false, isAddPerson);
    toggleUnbaptizedPublisher(newPerson, false, isAddPerson);
  }

  newPerson.person_data.publisher_baptized.active.value = checked;
  newPerson.person_data.publisher_baptized.active.updatedAt =
    new Date().toISOString();

  if (!checked) {
    const current = newPerson.person_data.publisher_baptized.history.find(
      (record) => record.end_date === null
    );

    if (current && isAddPerson) {
      newPerson.person_data.publisher_baptized.history =
        newPerson.person_data.publisher_baptized.history.filter(
          (record) => record.id !== current.id
        );
    }

    if (current && !isAddPerson) {
      current.end_date = new Date().toISOString();
      current.updatedAt = new Date().toISOString();
    }
  }
};

export const changeBaptismDate = (newPerson: PersonType, value: Date) => {
  newPerson.person_data.publisher_baptized.baptism_date.value =
    value === null ? null : new Date(value).toISOString();

  newPerson.person_data.publisher_baptized.baptism_date.updatedAt =
    new Date().toISOString();

  const histories = newPerson.person_data.publisher_baptized.history.filter(
    (record) => !record._deleted && record.start_date !== null
  );

  const firstReport = newPerson.person_data.first_report?.value || '';

  if (histories.length === 0 && value && firstReport.length === 0) {
    const startMonth = dateFirstDayMonth(value).toISOString();

    newPerson.person_data.publisher_baptized.history.push({
      _deleted: false,
      end_date: null,
      id: crypto.randomUUID(),
      start_date: startMonth,
      updatedAt: new Date().toISOString(),
    });

    updateFirstReport(newPerson);
  }
};

export const toggleActive = (
  newPerson: PersonType,
  isActive: boolean,
  isAddPerson: boolean
) => {
  const relevantStatus = newPerson.person_data.publisher_baptized.active.value
    ? newPerson.person_data.publisher_baptized
    : newPerson.person_data.publisher_unbaptized;
  const activeHistoryExists = relevantStatus.history.some(
    (record) => record.end_date === null
  );

  if (
    isActive === relevantStatus.active.value &&
    activeHistoryExists === isActive
  ) {
    return;
  }

  if (!isActive) {
    const activeRecord = relevantStatus.history.find(
      (record) => record.end_date === null
    );

    const start_date = formatDate(
      new Date(activeRecord.start_date),
      'yyyy/MM/dd'
    );

    const nowDate = formatDate(new Date(), 'yyyy/MM/dd');

    if (start_date === nowDate) {
      if (isAddPerson) {
        relevantStatus.history = relevantStatus.history.filter(
          (record) => record.id !== activeRecord.id
        );
      }

      if (!isAddPerson) {
        activeRecord._deleted = true;
        activeRecord.updatedAt = new Date().toISOString();
      }
    }

    if (start_date !== nowDate) {
      activeRecord.end_date = new Date().toISOString();
      activeRecord.updatedAt = new Date().toISOString();
    }

    updateFirstReport(newPerson);
  }

  if (isActive) {
    relevantStatus.active.value = isActive;
    addHistory(newPerson);
  }
};

const addHistory = (newPerson: PersonType) => {
  const relevantStatus = newPerson.person_data.publisher_baptized.active.value
    ? newPerson.person_data.publisher_baptized
    : newPerson.person_data.publisher_unbaptized;

  relevantStatus.history.push({
    id: crypto.randomUUID(),
    _deleted: false,
    updatedAt: new Date().toISOString(),
    start_date: dateFirstDayMonth().toISOString(),
    end_date: null,
  });

  updateFirstReport(newPerson);
};
