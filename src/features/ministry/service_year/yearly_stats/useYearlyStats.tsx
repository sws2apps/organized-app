import { useEffect, useMemo } from 'react';
import { useSetRecoilState } from 'recoil';
import { useCurrentUser } from '@hooks/index';
import {
  buildServiceYearsList,
  currentReportMonth,
  getMonthServiceYear,
} from '@utils/date';
import { ServiceYearType } from '@definition/report';
import { serviceYearSelectedState } from '@states/user_field_service_reports';
import YearItem from './year_item';

const useYearlyStats = () => {
  const { person, first_report } = useCurrentUser();

  const setSelectedYear = useSetRecoilState(serviceYearSelectedState);

  const yearsList = useMemo(() => {
    if (!person) return [];

    const firstMonthReport = first_report;
    const date = new Date(firstMonthReport);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const miniMonth = `${year}/${String(month).padStart(2, '0')}`;

    const years = buildServiceYearsList();
    const firstSY = getMonthServiceYear(miniMonth);
    const validYears = years.filter((record) => record.year >= firstSY);

    const result: ServiceYearType[] = validYears.map((record) => {
      const validMonths = record.months.filter(
        (month) => month.value >= miniMonth
      );
      return { year: record.year, months: validMonths };
    });

    return result;
  }, [person, first_report]);

  const yearsTab = useMemo(() => {
    return yearsList.map((year) => {
      return {
        label: year.year,
        Component: <YearItem year={year.year} />,
      };
    });
  }, [yearsList]);

  const activeTabInitial = useMemo(() => {
    const reportMonth = currentReportMonth();

    const findIndex = yearsList.findIndex((record) =>
      record.months.some((month) => month.value === reportMonth)
    );

    return findIndex;
  }, [yearsList]);

  const initialYear = useMemo(() => {
    const reportMonth = currentReportMonth();

    const data = yearsList.find((record) =>
      record.months.some((month) => month.value === reportMonth)
    );

    return data?.year || '';
  }, [yearsList]);

  const handleYearChange = (value: number) => {
    const findYear = yearsList.at(value);
    setSelectedYear(findYear.year);
  };

  useEffect(() => {
    setSelectedYear(initialYear);
  }, [initialYear, setSelectedYear]);

  return { yearsTab, activeTabInitial, handleYearChange };
};

export default useYearlyStats;
