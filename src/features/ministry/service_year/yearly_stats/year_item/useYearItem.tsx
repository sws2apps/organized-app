import useMinistryYearlyRecord from '@features/ministry/hooks/useMinistryYearlyRecord';

const useYearItem = (year: string) => {
  const { hours, isFR, hoursEnabled } = useMinistryYearlyRecord(year);

  return { hours, hoursEnabled, isFR };
};

export default useYearItem;
