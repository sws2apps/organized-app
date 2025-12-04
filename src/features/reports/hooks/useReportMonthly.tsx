import { useAtomValue } from 'jotai';
import { PersonType } from '@definition/person';
import { congFieldServiceReportsState } from '@states/field_service_reports';
import { addMonths, formatDate } from '@utils/date';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import { personsState } from '@states/persons';
import usePerson from '@features/persons/hooks/usePerson';
import usePersons from '@features/persons/hooks/usePersons';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import { useMemo } from 'react';

const useReportMonthly = (group?: string) => {
  const { getPublishersActive } = usePersons(group);
  const { personGetFirstReport, personIsEnrollmentActive } = usePerson();

  const fieldGroups = useAtomValue(fieldWithLanguageGroupsState);
  const reports = useAtomValue(congFieldServiceReportsState);
  const allPersons = useAtomValue(personsState);

  const persons = useMemo(() => {
    if (!group || group === 'all') {
      return allPersons;
    }

    const foundGroup = fieldGroups.find((g) => g.group_id === group);

    if (!foundGroup) {
      console.warn(`Group with id "${group}" not found`);
      return [];
    }

    return allPersons.filter((person) =>
      foundGroup.group_data.members.some(
        (personInGroup) => personInGroup.person_uid === person.person_uid
      )
    );
  }, [allPersons, fieldGroups, group]);

  const personCheckInactivityState = (person: PersonType, month: string) => {
    // default month to current month if undefined
    if (!month) {
      month = formatDate(new Date(), 'yyyy/MM');
    }

    const startDate = personGetFirstReport(person);
    if (!startDate) return false;

    let isInactive = true;
    let countReport = 0;

    const findReport = (toFind: string) => {
      return reports.find(
        (record) =>
          record.report_data.person_uid === person.person_uid &&
          record.report_data.report_date === toFind
      );
    };

    do {
      // exit and count reports if it reaches first month report
      if (month === startDate) {
        isInactive = countReport === 5;
        break;
      }

      // find report and check shared_ministry
      const report = findReport(month);

      if (report?.report_data.shared_ministry) {
        isInactive = false;
        break;
      }

      // decrease month
      const date = addMonths(`${month}/01`, -1);
      month = formatDate(date, 'yyyy/MM');

      countReport++;
    } while (countReport <= 5);

    return isInactive;
  };

  const getPublishersActiveForBranch = (month: string) => {
    const personActive: PersonType[] = [];

    const active = getPublishersActive(month);

    for (const person of active) {
      const isInactive = personCheckInactivityState(person, month);

      if (!isInactive) {
        personActive.push(person);
      }
    }

    return personActive;
  };

  const personHasReport = (person: PersonType, month: string) => {
    const hasReport = reports.some((report) => {
      if (report.report_data.person_uid !== person.person_uid) return false;
      if (!report.report_data.shared_ministry) return false;

      return report.report_data.report_date === month;
    });

    return hasReport;
  };

  const getFTSReportsMonth = (month: string) => {
    const data = reports.filter(
      (record) => record.report_data.report_date === month
    );

    const result: CongFieldServiceReportType[] = [];

    for (const report of data) {
      const person = persons.find(
        (record) => record.person_uid === report.report_data.person_uid
      );
      if (!person) continue;

      const isFMF = personIsEnrollmentActive(
        person,
        'FMF',
        report.report_data.report_date
      );

      const isFR = personIsEnrollmentActive(
        person,
        'FR',
        report.report_data.report_date
      );

      const isFS = personIsEnrollmentActive(
        person,
        'FS',
        report.report_data.report_date
      );

      if (isFMF || isFR || isFS) {
        result.push(report);
      }
    }

    return result;
  };

  const getAPReportsMonth = (month: string) => {
    const data = reports.filter(
      (record) => record.report_data.report_date === month
    );

    const result: CongFieldServiceReportType[] = [];

    for (const report of data) {
      const person = persons.find(
        (record) => record.person_uid === report.report_data.person_uid
      );
      if (!person) continue;

      const isAP = personIsEnrollmentActive(
        person,
        'AP',
        report.report_data.report_date
      );

      if (isAP) {
        result.push(report);
      }
    }

    return result;
  };

  const getPublisherReportsMonth = (month: string) => {
    const data = reports.filter(
      (record) => record.report_data.report_date === month
    );

    const result: CongFieldServiceReportType[] = [];

    for (const report of data) {
      const person = persons.find(
        (record) => record.person_uid === report.report_data.person_uid
      );
      if (!person) continue;

      const isFMF = personIsEnrollmentActive(
        person,
        'FMF',
        report.report_data.report_date
      );

      const isFR = personIsEnrollmentActive(
        person,
        'FR',
        report.report_data.report_date
      );

      const isFS = personIsEnrollmentActive(
        person,
        'FS',
        report.report_data.report_date
      );

      const isAP = personIsEnrollmentActive(
        person,
        'AP',
        report.report_data.report_date
      );

      if (isFMF || isFR || isFS || isAP) continue;

      result.push(report);
    }

    return result;
  };

  return {
    personCheckInactivityState,
    getPublishersActiveForBranch,
    personHasReport,
    getFTSReportsMonth,
    getAPReportsMonth,
    getPublisherReportsMonth,
  };
};

export default useReportMonthly;
