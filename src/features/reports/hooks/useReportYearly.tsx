import { useAtomValue } from 'jotai';
import { PersonType } from '@definition/person';
import { congFieldServiceReportsState } from '@states/field_service_reports';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import { personsState } from '@states/persons';
import usePersons from '@features/persons/hooks/usePersons';
import usePerson from '@features/persons/hooks/usePerson';

const useReportYearly = () => {
  const reports = useAtomValue(congFieldServiceReportsState);
  const persons = useAtomValue(personsState);

  const { getPublishersInactiveYears } = usePersons();

  const { personIsEnrollmentActive } = usePerson();

  const getPublishersReactivatedYears = (year: string) => {
    const lastYearInactives = getPublishersInactiveYears(String(+year - 1));

    const startMonth = `${+year - 1}/09`;
    const endMonth = `${year}/08`;

    // find if publisher has at least one report this service year

    const result = lastYearInactives.filter((person) => {
      const hasReport = reports.some((report) => {
        if (report.report_data._deleted) return false;
        if (report.report_data.person_uid !== person.person_uid) return false;
        if (!report.report_data.shared_ministry) return false;

        const reportDate = report.report_data.report_date;

        return reportDate >= startMonth && reportDate <= endMonth;
      });

      return hasReport;
    });

    return result;
  };

  const personHasReportYear = (person: PersonType, year: string) => {
    const startMonth = `${+year - 1}/09`;
    const endMonth = `${year}/08`;

    const hasReport = reports.some((report) => {
      if (report.report_data.person_uid !== person.person_uid) return false;
      if (!report.report_data.shared_ministry) return false;

      const reportDate = report.report_data.report_date;

      return reportDate >= startMonth && reportDate <= endMonth;
    });

    return hasReport;
  };

  const getFTSReportsYear = (year: string) => {
    const startMonth = `${+year - 1}/09`;
    const endMonth = `${year}/08`;

    const data = reports.filter(
      (record) =>
        record.report_data.report_date >= startMonth &&
        record.report_data.report_date <= endMonth
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

  const getAPReportsYear = (year: string) => {
    const startMonth = `${+year - 1}/09`;
    const endMonth = `${year}/08`;

    const data = reports.filter(
      (record) =>
        record.report_data.report_date >= startMonth &&
        record.report_data.report_date <= endMonth
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

  const getPublisherReportsYear = (year: string) => {
    const startMonth = `${+year - 1}/09`;
    const endMonth = `${year}/08`;

    const data = reports.filter(
      (record) =>
        record.report_data.report_date >= startMonth &&
        record.report_data.report_date <= endMonth
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

  const getReportsYear = (year: string) => {
    const startMonth = `${+year - 1}/09`;
    const endMonth = `${year}/08`;

    const result = reports
      .filter(
        (record) =>
          record.report_data.report_date >= startMonth &&
          record.report_data.report_date <= endMonth
      )
      .toSorted((a, b) =>
        a.report_data.report_date.localeCompare(b.report_data.report_date)
      );

    return result;
  };

  return {
    getPublishersReactivatedYears,
    personHasReportYear,
    getFTSReportsYear,
    getAPReportsYear,
    getPublisherReportsYear,
    getReportsYear,
  };
};

export default useReportYearly;
