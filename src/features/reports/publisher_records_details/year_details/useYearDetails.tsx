import { useMemo } from 'react';
import { useParams } from 'react-router';
import { useAtomValue } from 'jotai';
import { buildServiceYearsList } from '@utils/date';
import { personsState } from '@states/persons';
import usePerson from '@features/persons/hooks/usePerson';
import { congFieldServiceReportsState } from '@states/field_service_reports';

const useYearDetails = (year: string) => {
  const { id } = useParams();

  const { personIsEnrollmentYearActive } = usePerson();

  const persons = useAtomValue(personsState);
  const congReports = useAtomValue(congFieldServiceReportsState);

  const person = useMemo(() => {
    return persons.find((record) => record.person_uid === id);
  }, [id, persons]);

  const reports = useMemo(() => {
    if (!person) return [];

    const startMonth = `${+year - 1}/09`;
    const endMonth = `${year}/08`;

    const result = congReports.filter(
      (record) =>
        record.report_data.person_uid === person.person_uid &&
        record.report_data.report_date >= startMonth &&
        record.report_data.report_date <= endMonth
    );

    return result;
  }, [year, congReports, person]);

  const months = useMemo(() => {
    if (!year) return [];

    const years = buildServiceYearsList();
    const months = years.find((record) => record.year === year).months;

    return months;
  }, [year]);

  const isAP = useMemo(() => {
    return personIsEnrollmentYearActive(person, 'AP', year);
  }, [person, year, personIsEnrollmentYearActive]);

  const isFR = useMemo(() => {
    return personIsEnrollmentYearActive(person, 'FR', year);
  }, [person, year, personIsEnrollmentYearActive]);

  const isFS = useMemo(() => {
    return personIsEnrollmentYearActive(person, 'FS', year);
  }, [person, year, personIsEnrollmentYearActive]);

  const isFMF = useMemo(() => {
    return personIsEnrollmentYearActive(person, 'FMF', year);
  }, [person, year, personIsEnrollmentYearActive]);

  const show_hours_total = useMemo(() => {
    return isAP || isFR || isFS || isFMF;
  }, [isAP, isFR, isFS, isFMF]);

  const field_hours = useMemo(() => {
    if (!show_hours_total) return 0;

    const sum = reports.reduce(
      (acc, current) => acc + current.report_data.hours.field_service,
      0
    );

    return sum;
  }, [show_hours_total, reports]);

  const credit_hours = useMemo(() => {
    if (!show_hours_total) return 0;

    const sum = reports.reduce(
      (acc, current) => acc + current.report_data.hours.credit.approved,
      0
    );

    return sum;
  }, [show_hours_total, reports]);

  return { months, person, show_hours_total, field_hours, credit_hours };
};

export default useYearDetails;
