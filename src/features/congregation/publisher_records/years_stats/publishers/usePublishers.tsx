import { useMemo } from 'react';
import { useAppTranslation } from '@hooks/index';
import { PersonType } from '@definition/person';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import { PublishersProps } from './index.types';
import usePersons from '@features/persons/hooks/usePersons';
import useReportYearly from '@features/reports/hooks/useReportYearly';
import useReportMonthly from '@features/reports/hooks/useReportMonthly';

const usePublishers = ({ month, wholeYear, year }: PublishersProps) => {
  const { t } = useAppTranslation();

  const { getPublisherYears, getPublisherMonths } = usePersons();
  const { personHasReportYear, getPublisherReportsYear } = useReportYearly();
  const { personHasReport, getPublisherReportsMonth } = useReportMonthly();

  const field_reports = useMemo(() => {
    let result: CongFieldServiceReportType[];

    if (wholeYear) {
      result = getPublisherReportsYear(year);
    }

    if (!wholeYear) {
      result = getPublisherReportsMonth(month);
    }

    return result;
  }, [
    wholeYear,
    year,
    month,
    getPublisherReportsYear,
    getPublisherReportsMonth,
  ]);

  const persons = useMemo(() => {
    let persons: PersonType[];

    if (wholeYear) {
      persons = getPublisherYears(year);
    }

    if (!wholeYear) {
      persons = getPublisherMonths(month);
    }

    return persons;
  }, [wholeYear, year, month, getPublisherYears, getPublisherMonths]);

  const total = useMemo(() => {
    return persons.length;
  }, [persons]);

  const ministry_stats = useMemo(() => {
    let shared = 0;
    let none = 0;

    for (const person of persons) {
      let hasReport = false;

      if (wholeYear) {
        hasReport = personHasReportYear(person, year);
      }

      if (!wholeYear) {
        hasReport = personHasReport(person, month);
      }

      if (hasReport) shared++;

      if (!hasReport) none++;
    }

    return { shared, none };
  }, [persons, year, wholeYear, month, personHasReportYear, personHasReport]);

  const bible_studies = useMemo(() => {
    const sum = field_reports.reduce(
      (acc, current) => acc + current.report_data.bible_studies,
      0
    );

    return sum;
  }, [field_reports]);

  const reports = useMemo(() => {
    const reports = [
      {
        label: t('tr_totalCount'),
        value: total,
      },
      {
        label: t('tr_sharedInMinistry'),
        value: ministry_stats.shared,
      },
      {
        label: t('tr_didntSharedInMinistry'),
        value: ministry_stats.none,
      },
      {
        label: t('tr_bibleStudies'),
        value: bible_studies,
      },
    ];

    return reports;
  }, [t, total, ministry_stats, bible_studies]);

  return { reports };
};

export default usePublishers;
