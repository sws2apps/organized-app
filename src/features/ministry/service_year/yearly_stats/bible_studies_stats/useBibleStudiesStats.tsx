import useMinistryYearlyRecord from '@features/ministry/hooks/useMinistryYearlyRecord';

const useBibleStudiesStats = (year: string) => {
  const { bible_studies } = useMinistryYearlyRecord(year);

  return { bible_studies };
};

export default useBibleStudiesStats;
