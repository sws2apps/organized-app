import useMinistryYearlyRecord from '@features/ministry/hooks/useMinistryYearlyRecord';

const useHoursStats = (year: string) => {
  const { hours, isFR } = useMinistryYearlyRecord(year);

  return { isFR, hours };
};

export default useHoursStats;
