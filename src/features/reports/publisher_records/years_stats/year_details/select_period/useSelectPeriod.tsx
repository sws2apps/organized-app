import { buildServiceYearsList } from '@utils/date';

const useSelectPeriod = ({ year }: { year: string }) => {
  const serviceYears = buildServiceYearsList();
  const yearObj = serviceYears.find((y) => y.year === year);
  const months = yearObj ? yearObj.months : [];

  return {
    months,
  };
};

export default useSelectPeriod;
