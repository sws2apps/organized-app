import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { userFieldServiceMonthlyReportsState } from '@states/user_field_service_reports';
import { monthNamesState } from '@states/app';
import { congFieldServiceReportsState } from '@states/field_service_reports';
import {
  hoursCreditsEnabledState,
  userDataViewState,
  userLocalUIDState,
} from '@states/settings';
import { MinistryMonthlyRecord } from './index.types';
import { delegatedFieldServiceReportsState } from '@states/delegated_field_service_reports';
import { userBibleStudiesState } from '@states/user_bible_studies';
import { personsActiveState } from '@states/persons';
import { AssignmentCode } from '@definition/assignment';
import { branchFieldReportsState } from '@states/branch_field_service_reports';
import usePerson from '@features/persons/hooks/usePerson';
import { currentReportMonth } from '@utils/date';

const useMinistryMonthlyRecord = ({
  month,
  person_uid,
  publisher,
}: MinistryMonthlyRecord) => {
  const { personIsPublisher } = usePerson();

  const userReports = useAtomValue(userFieldServiceMonthlyReportsState);
  const delegatedReports = useAtomValue(delegatedFieldServiceReportsState);
  const congReports = useAtomValue(congFieldServiceReportsState);
  const userUID = useAtomValue(userLocalUIDState);
  const monthNames = useAtomValue(monthNamesState);
  const bibleStudiesRecords = useAtomValue(userBibleStudiesState);
  const persons = useAtomValue(personsActiveState);
  const hoursCreditEnabled = useAtomValue(hoursCreditsEnabledState);
  const branchReports = useAtomValue(branchFieldReportsState);
  const dataView = useAtomValue(userDataViewState);

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
    if (!publisher) {
      return congReport?.report_data.status || '';
    }

    if (congReport?.report_data.status === 'confirmed') {
      return 'confirmed';
    }

    if (isSelf) {
      if (!userReport) return 'pending';

      return userReport.report_data.status;
    }

    if (!delegatedReport) return 'pending';

    return delegatedReport.report_data.status;
  }, [publisher, congReport, userReport, isSelf, delegatedReport]);

  const shared_ministry = useMemo(() => {
    if (!publisher) {
      return congReport?.report_data.shared_ministry ?? false;
    }

    if (congReport?.report_data.status === 'confirmed') {
      return congReport.report_data.shared_ministry;
    }

    if (isSelf) {
      if (!userReport) return false;

      return userReport.report_data.shared_ministry;
    }

    if (!delegatedReport) return false;

    return delegatedReport.report_data.shared_ministry;
  }, [publisher, congReport, userReport, isSelf, delegatedReport]);

  const comments = useMemo(() => {
    if (!publisher) {
      return congReport?.report_data.comments || '';
    }

    if (congReport?.report_data.status === 'confirmed') {
      return congReport.report_data.comments;
    }

    if (isSelf) {
      if (!userReport) return '';

      return userReport.report_data.comments;
    }

    if (!delegatedReport) return '';

    return delegatedReport.report_data.comments;
  }, [publisher, congReport, userReport, isSelf, delegatedReport]);

  const bible_studies = useMemo(() => {
    if (!publisher) {
      return congReport?.report_data.bible_studies ?? 0;
    }

    if (congReport?.report_data.status === 'confirmed') {
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
  }, [publisher, congReport, userReport, isSelf, delegatedReport]);

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
      const congReport = congReports.find(
        (record) =>
          record.report_data.report_date === month &&
          record.report_data.person_uid === person_uid
      );

      if (!congReport) return false;

      return congReport.report_data.status === 'confirmed';
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
    if (!publisher) {
      if (congReport) {
        return `${congReport.report_data.hours.field_service}:00`;
      }

      return '0:00';
    }

    if (congReport?.report_data.status === 'confirmed') {
      return `${congReport.report_data.hours.field_service}:00`;
    }

    if (isSelf) {
      if (!userReport) return '0:00';

      if (typeof userReport.report_data.hours.field_service === 'number') {
        return `${userReport.report_data.hours.field_service}:00`;
      }

      const daily = userReport.report_data.hours.field_service.daily || '0:00';
      const monthly =
        userReport.report_data.hours.field_service.monthly || '0:00';

      const [hoursDaily, minutesDaily] = daily.split(':').map(Number);
      const [hoursMonthly, minutesMonthly] = monthly.split(':').map(Number);

      let totalHours = hoursDaily + hoursMonthly;
      const totalMinutes = (minutesDaily || 0) + (minutesMonthly || 0);

      const minutesRemain = totalMinutes % 60;
      totalHours += (totalMinutes - minutesRemain) / 60;

      return `${totalHours}:${String(minutesRemain).padStart(2, '0')}`;
    }

    if (!delegatedReport) return '0:00';

    return delegatedReport.report_data.hours.field_service.monthly;
  }, [publisher, congReport, userReport, isSelf, delegatedReport]);

  const hours_credits = useMemo(() => {
    if (!publisher) {
      if (congReport) {
        return `${congReport.report_data.hours.credit.approved}:00`;
      }

      return '0:00';
    }

    if (congReport?.report_data.status === 'confirmed') {
      return `${congReport.report_data.hours.credit.approved}:00`;
    }

    if (isSelf) {
      if (!userReport) return '0:00';

      if (
        userReport.report_data.hours.credit['value'] &&
        typeof userReport.report_data.hours.credit['value'] === 'number'
      ) {
        return `${userReport.report_data.hours.credit['value']}:00`;
      }

      const daily = userReport.report_data.hours.credit.daily || '0:00';
      const monthly = userReport.report_data.hours.credit.monthly || '0:00';

      const [hoursDaily, minutesDaily] = daily.split(':').map(Number);
      const [hoursMonthly, minutesMonthly] = monthly.split(':').map(Number);

      let totalHours = hoursDaily + hoursMonthly;
      const totalMinutes = (minutesDaily || 0) + (minutesMonthly || 0);

      const minutesRemain = totalMinutes % 60;
      totalHours += (totalMinutes - minutesRemain) / 60;

      return `${totalHours}:${String(minutesRemain).padStart(2, '0')}`;
    }

    if (!delegatedReport) return '0:00';

    return delegatedReport.report_data.hours.credit.monthly;
  }, [publisher, congReport, userReport, isSelf, delegatedReport]);

  const hours_total = useMemo(() => {
    if (!publisher) {
      if (congReport) {
        return String(
          +hours_fields.split(':').at(0) + +hours_credits.split(':').at(0)
        );
      }

      return '0';
    }

    const [hoursField, minutesField] = hours_fields.split(':').map(Number);
    const [hoursCredit, minutesCredit] = hours_credits.split(':').map(Number);

    let totalHours = hoursField + hoursCredit;
    const totalMinutes = (minutesField || 0) + (minutesCredit || 0);

    const minutesRemain = totalMinutes % 60;
    totalHours += (totalMinutes - minutesRemain) / 60;

    return `${totalHours}:${String(minutesRemain).padStart(2, '0')}`;
  }, [publisher, congReport, hours_fields, hours_credits]);

  const minutes_remains = useMemo(() => {
    const minutes = hours_fields.split(':').map(Number).at(1);

    return minutes ? +minutes : 0;
  }, [hours_fields]);

  const hours_credit_enabled = useMemo(() => {
    if (!person) return false;

    const hasAssignment =
      person.person_data.assignments
        .find((a) => a.type === dataView)
        ?.values.includes(AssignmentCode.MINISTRY_HOURS_CREDIT) ?? false;

    if (!publisher) return hasAssignment;

    if (!isSelf && !read_only) return hasAssignment;

    if (read_only && month < currentReportMonth()) {
      return hours_credits !== '0:00';
    }

    return hoursCreditEnabled ? hasAssignment : false;
  }, [
    dataView,
    hours_credits,
    person,
    isSelf,
    hoursCreditEnabled,
    month,
    publisher,
    read_only,
  ]);

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
