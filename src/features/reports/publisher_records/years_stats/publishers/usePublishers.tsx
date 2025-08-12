import { useMemo, useCallback } from 'react';
import { useAppTranslation } from '@hooks/index';
import { PersonType } from '@definition/person';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import { PublishersProps } from './index.types';
import usePersons from '@features/persons/hooks/usePersons';
import useReportYearly from '@features/reports/hooks/useReportYearly';
import useReportMonthly from '@features/reports/hooks/useReportMonthly';

const usePublishers = ({
  year,
  publisherGroup,
  period,
}: PublishersProps) => {
  const { t } = useAppTranslation();

  const { getPublisherYears, getPublisherMonths } = usePersons();
  const { personHasReportYear, getPublisherReportsYear } = useReportYearly();
  const { personHasReport, getPublisherReportsMonth } = useReportMonthly();

  // Helper to filter persons by group
  const filterByGroup = useCallback(
    (persons: PersonType[]) => {
      if (publisherGroup === 'all') return persons;
      return persons.filter((p) => {
        const list = p.person_data.categories?.value ?? [];
        return list.includes(publisherGroup);
      });
    },
    [publisherGroup]
  );

  // Determine period
  const isWholeYear = period === 'serviceYear';
  const selectedMonth = period;

  const persons = useMemo(() => {
    const list = isWholeYear
      ? getPublisherYears(year)
      : getPublisherMonths(selectedMonth);
    return filterByGroup(list);
  }, [
    isWholeYear,
    year,
    selectedMonth,
    getPublisherYears,
    getPublisherMonths,
    filterByGroup,
  ]);

  const personUidSet = useMemo(() => {
    return new Set(persons.map((p) => p.person_uid));
  }, [persons]);

  const field_reports = useMemo(() => {
    const reports: CongFieldServiceReportType[] = isWholeYear
      ? getPublisherReportsYear(year)
      : getPublisherReportsMonth(selectedMonth);
    if (publisherGroup === 'all') return reports;
    return reports.filter((r) => personUidSet.has(r.report_data.person_uid));
  }, [
    isWholeYear,
    year,
    selectedMonth,
    getPublisherReportsYear,
    getPublisherReportsMonth,
    publisherGroup,
    personUidSet,
  ]);

  const total = useMemo(() => {
    return persons.length;
  }, [persons]);

  const ministry_stats = useMemo(() => {
    let shared = 0;
    let none = 0;

    for (const person of persons) {
      let hasReport = false;

      if (isWholeYear) {
        hasReport = personHasReportYear(person, year);
      }

      if (!isWholeYear) {
        hasReport = personHasReport(person, selectedMonth);
      }

      if (hasReport) shared++;

      if (!hasReport) none++;
    }

    return { shared, none };
  }, [
    persons,
    isWholeYear,
    year,
    selectedMonth,
    personHasReportYear,
    personHasReport,
  ]);

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
