import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { S21CardData, S21CardMonthData } from '@definition/report';
import { createArrayFromMonths, currentServiceYear } from '@utils/date';
import { JWLangState, monthNamesState } from '@states/app';
import useReportMonthly from './useReportMonthly';

const useCongregationCard = () => {
  const { t } = useAppTranslation();

  const { getFTSReportsMonth, getAPReportsMonth, getPublisherReportsMonth } =
    useReportMonthly();

  const lang = useRecoilValue(JWLangState);
  const monthNames = useRecoilValue(monthNamesState);

  const years = useMemo(() => {
    const result: string[] = [];

    const currentYear = currentServiceYear();
    const prevYear = String(+currentYear - 1).toString();

    result.push(prevYear, currentYear);

    return result;
  }, []);

  const getReports = (month: string, type: 'FTS' | 'AP' | 'Publishers') => {
    if (type === 'FTS') {
      return getFTSReportsMonth(month);
    }

    if (type === 'AP') {
      return getAPReportsMonth(month);
    }

    if (type === 'Publishers') {
      return getPublisherReportsMonth(month);
    }
  };

  const getReportName = (
    card: S21CardData,
    type: 'FTS' | 'AP' | 'Publishers'
  ) => {
    if (type === 'FTS') {
      card.name = t('tr_fulltimeServants');
    }

    if (type === 'AP') {
      card.name = t('tr_APs');
    }

    if (type === 'Publishers') {
      card.name = t('tr_activePublishersAll');
    }
  };

  const getReportData = (
    card: S21CardData,
    type: 'FTS' | 'AP' | 'Publishers',
    year: string
  ) => {
    const startMonth = `${+year - 1}/09`;
    const endMonth = `${+year}/08`;

    card.months = [];

    const months = createArrayFromMonths(startMonth, endMonth);

    for (const month of months) {
      const reports = getReports(month, type);
      const sum_studies = reports.reduce(
        (acc, current) => acc + current.report_data.bible_studies,
        0
      );
      const sum_hours = reports.reduce(
        (acc, current) => acc + current.report_data.hours.field_service,
        0
      );

      const obj: S21CardMonthData = {
        AP: false,
        bible_studies: sum_studies.toString(),
        hours: sum_hours.toString(),
        month_name: monthNames[+month.split('/')[1] - 1],
        remarks: '',
        shared: false,
      };

      card.months.push(obj);
    }

    const total_hours = card.months.reduce(
      (acc, current) => acc + +current.hours,
      0
    );

    card.hours_total = total_hours.toString();
  };

  const getCongregationCardsData = (type: 'FTS' | 'AP' | 'Publishers') => {
    const result: S21CardData[] = [];

    for (const year of years) {
      const obj = {} as S21CardData;
      obj.year = year;
      obj.lang = lang;
      obj.baptism_date = '';
      obj.birth_date = '';
      obj.enrollments = { FMF: false, FR: false, FS: false };
      obj.gender = { female: false, male: false };
      obj.hope = { anointed: false, other_sheep: false };
      obj.privileges = { elder: false, ms: false };

      getReportName(obj, type);
      getReportData(obj, type, year);

      result.push(obj);
    }

    return result as [S21CardData, S21CardData];
  };

  return { getCongregationCardsData };
};

export default useCongregationCard;
