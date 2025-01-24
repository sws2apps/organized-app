import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { userFieldServiceMonthlyReportsState } from '@states/user_field_service_reports';
import { monthNamesState } from '@states/app';
import { congFieldServiceReportsState } from '@states/field_service_reports';
import { hoursCreditsEnabledState, userLocalUIDState } from '@states/settings';
import { MinistryMonthlyRecord } from './index.types';
import { delegatedFieldServiceReportsState } from '@states/delegated_field_service_reports';
import { userBibleStudiesState } from '@states/user_bible_studies';
import { personsActiveState } from '@states/persons';
import { AssignmentCode } from '@definition/assignment';
import { branchFieldReportsState } from '@states/branch_field_service_reports';
import usePerson from '@features/persons/hooks/usePerson';

const useMinistryMonthlyRecord = ({
  month,
  person_uid,
  publisher,
}: MinistryMonthlyRecord) => {
  const { personIsPublisher } = usePerson();

  const userReports = useRecoilValue(userFieldServiceMonthlyReportsState);
  const delegatedReports = useRecoilValue(delegatedFieldServiceReportsState);
  const congReports = useRecoilValue(congFieldServiceReportsState);
  const userUID = useRecoilValue(userLocalUIDState);
  const monthNames = useRecoilValue(monthNamesState);
  const bibleStudiesRecords = useRecoilValue(userBibleStudiesState);
  const persons = useRecoilValue(personsActiveState);
  const hoursCreditEnabled = useRecoilValue(hoursCreditsEnabledState);
  const branchReports = useRecoilValue(branchFieldReportsState);

  const isSelf = useMemo(() => userUID === person_uid, [userUID, person_uid]);

  const month_name = useMemo(() => {
    if (!month) return '';

    const monthIndex = +month.split('/')[1] - 1;
    return monthNames[monthIndex];
  }, [monthNames, month]);

  const person = useMemo(() => {
    return persons.find((record) => record.person_uid === person_uid);
  }, [persons, person_uid]);

  const isInactive = useMemo(() => {
    if (!person) return true;

    const active = personIsPublisher(person, month);

    return !active;
  }, [person, month, personIsPublisher]);

  const branchReport = useMemo(() => {
    return branchReports.find((record) => record.report_date === month);
  }, [branchReports, month]);

  const congReport = useMemo(() => {
    return congReports.find(
      (record) =>
        record.report_data.report_date === month &&
        record.report_data.person_uid === person_uid
    );
  }, [congReports, month, person_uid]);

  const userReport = useMemo(() => {
    return userReports.find((record) => record.report_date === month);
  }, [userReports, month]);

  const delegatedReport = useMemo(() => {
    return delegatedReports.find(
      (record) =>
        record.report_data.report_date === month &&
        record.report_data.person_uid === person_uid
    );
  }, [delegatedReports, month, person_uid]);

  const status = useMemo(() => {
    if (congReport) {
      return congReport.report_data.status;
    }

    if (isSelf) {
      if (!userReport) return 'pending';

      return userReport.report_data.status;
    }

    if (!delegatedReport) return 'pending';

    return delegatedReport.report_data.status;
  }, [congReport, userReport, isSelf, delegatedReport]);

  const shared_ministry = useMemo(() => {
    if (congReport) {
      return congReport.report_data.shared_ministry;
    }

    if (isSelf) {
      if (!userReport) return false;

      return userReport.report_data.shared_ministry;
    }

    if (!delegatedReport) return false;

    return delegatedReport.report_data.shared_ministry;
  }, [congReport, userReport, isSelf, delegatedReport]);

  const comments = useMemo(() => {
    if (congReport) {
      return congReport.report_data.comments;
    }

    if (isSelf) {
      if (!userReport) return '';

      return userReport.report_data.comments;
    }

    if (!delegatedReport) return '';

    return delegatedReport.report_data.comments;
  }, [congReport, userReport, isSelf, delegatedReport]);

  const bible_studies = useMemo(() => {
    if (congReport) {
      return congReport.report_data.bible_studies;
    }

    if (isSelf) {
      if (!userReport) return 0;

      if (typeof userReport.report_data.bible_studies === 'number') {
        return userReport.report_data.bible_studies as number;
      }

      const recordsCount = userReport.report_data.bible_studies.records.length;
      let totalCount =
        userReport.report_data.bible_studies.daily +
        userReport.report_data.bible_studies.monthly;

      if (totalCount < 0) totalCount = 0;

      return totalCount < recordsCount ? recordsCount : totalCount;
    }

    if (!delegatedReport) return 0;

    const recordsCount =
      delegatedReport.report_data.bible_studies.records.length;
    const totalCount = delegatedReport.report_data.bible_studies.monthly;

    return totalCount < recordsCount ? recordsCount : totalCount;
  }, [congReport, userReport, isSelf, delegatedReport]);

  const bible_studies_records = useMemo(() => {
    if (!isSelf) return;

    if (!userReport) return [];

    if (typeof userReport.report_data.bible_studies === 'number') return [];

    const records = userReport.report_data.bible_studies?.records || [];

    const result = records.map((record) => {
      const found = bibleStudiesRecords.find((b) => b.person_uid === record);

      return (
        found || {
          person_uid: record,
          person_data: { person_name: '   ', _deleted: false, updatedAt: '' },
        }
      );
    });

    return result;
  }, [userReport, isSelf, bibleStudiesRecords]);

  const read_only = useMemo(() => {
    if (isInactive) return true;

    if (publisher) {
      return congReports.some(
        (record) =>
          record.report_data.report_date === month &&
          record.report_data.person_uid === person_uid
      );
    }

    if (!branchReport) return false;

    const isLate =
      congReport?.report_data.late.value &&
      congReport?.report_data.late.submitted.length === 0;

    if (isLate) return false;

    return branchReport.report_data.submitted;
  }, [
    publisher,
    branchReport,
    isInactive,
    congReports,
    month,
    person_uid,
    congReport,
  ]);

  const hours_fields = useMemo(() => {
    if (congReport) {
      return `${congReport.report_data.hours.field_service}:00`;
    }

    if (isSelf) {
      if (!userReport) return '0:00';

      if (typeof userReport.report_data.hours.field_service === 'number') {
        return `${userReport.report_data.hours.field_service}:00`;
      }

      const [hoursDaily, minutesDaily] =
        userReport.report_data.hours.field_service.daily.split(':').map(Number);

      const [hoursMonthly, minutesMonthly] =
        userReport.report_data.hours.field_service.monthly
          .split(':')
          .map(Number);

      let totalHours = hoursDaily + hoursMonthly;
      const totalMinutes = (minutesDaily || 0) + (minutesMonthly || 0);

      const minutesRemain = totalMinutes % 60;
      totalHours += (totalMinutes - minutesRemain) / 60;

      return `${totalHours}:${String(minutesRemain).padStart(2, '0')}`;
    }

    if (!delegatedReport) return '0:00';

    return delegatedReport.report_data.hours.field_service.monthly;
  }, [congReport, userReport, isSelf, delegatedReport]);

  const hours_credits = useMemo(() => {
    if (congReport) {
      return `${congReport.report_data.hours.credit.approved}`;
    }

    if (isSelf) {
      if (!userReport) return '0:00';

      if (
        userReport.report_data.hours.credit['value'] &&
        typeof userReport.report_data.hours.credit['value'] === 'number'
      ) {
        return `${userReport.report_data.hours.credit['value']}:00`;
      }

      const [hoursDaily, minutesDaily] =
        userReport.report_data.hours.credit.daily.split(':').map(Number);

      const [hoursMonthly, minutesMonthly] =
        userReport.report_data.hours.credit.monthly.split(':').map(Number);

      let totalHours = hoursDaily + hoursMonthly;
      const totalMinutes = (minutesDaily || 0) + (minutesMonthly || 0);

      const minutesRemain = totalMinutes % 60;
      totalHours += (totalMinutes - minutesRemain) / 60;

      return `${totalHours}:${String(minutesRemain).padStart(2, '0')}`;
    }

    if (!delegatedReport) return '0:00';

    return delegatedReport.report_data.hours.credit.monthly;
  }, [congReport, userReport, isSelf, delegatedReport]);

  const hours_total = useMemo(() => {
    if (congReport) {
      return String(
        +hours_fields.split(':').at(0) + +hours_credits.split(':').at(0)
      );
    }

    const [hoursDaily, minutesDaily] = hours_fields.split(':').map(Number);

    const [hoursMonthly, minutesMonthly] = hours_credits.split(':').map(Number);

    let totalHours = hoursDaily + hoursMonthly;
    const totalMinutes = (minutesDaily || 0) + (minutesMonthly || 0);

    const minutesRemain = totalMinutes % 60;
    totalHours += (totalMinutes - minutesRemain) / 60;

    return `${totalHours}:${String(minutesRemain).padStart(2, '0')}`;
  }, [congReport, hours_fields, hours_credits]);

  const minutes_remains = useMemo(() => {
    const minutes = hours_total.split(':').at(1);

    return minutes ? +minutes : 0;
  }, [hours_total]);

  const hours_credit_enabled = useMemo(() => {
    if (!person) return false;

    const assignments = person.person_data.assignments.filter(
      (record) => record._deleted === false
    );

    const hasAssignment = assignments.find(
      (record) => record.code === AssignmentCode.MINISTRY_HOURS_CREDIT
    );

    if (!isSelf) {
      return hasAssignment;
    }

    return hoursCreditEnabled ? hasAssignment : false;
  }, [person, isSelf, hoursCreditEnabled]);

  return {
    month_name,
    person,
    status,
    shared_ministry,
    comments,
    read_only,
    userReport,
    delegatedReport,
    bible_studies,
    bible_studies_records,
    isSelf,
    hours_fields,
    hours_credits,
    hours_total,
    minutes_remains,
    hours_credit_enabled,
    congReport,
  };
};

export default useMinistryMonthlyRecord;
