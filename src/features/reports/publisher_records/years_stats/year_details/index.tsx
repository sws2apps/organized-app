import { Stack } from '@mui/material';
import { useBreakpoints } from '@hooks/index';
import { YearDetailsProps } from './index.types';
import useYearDetails from './useYearDetails';
import AuxiliaryPioneers from '../auxiliary_pioneers';
import FulltimeServants from '../fulltime_servants';
import Publishers from '../publishers';
import TotalStatistics from '../total_statistics';
import SelectPublishers from './select_publishers';
import SelectPeriod from './select_period';

const YearDetails = (props: YearDetailsProps) => {
  const { laptopUp } = useBreakpoints();

  const {
    handleChangeSelectedPublishers,
    selectedPublishers,
    handleChangeSelectedMonth,
    selectedMonth,
    wholeYear,
    year,
  } = useYearDetails(props);

  return (
    <Stack spacing="16px" marginBottom="-24px">
      <Stack
        direction={laptopUp ? 'row' : 'column'}
        spacing="12px"
        alignItems={laptopUp ? 'center' : 'stretch'}
        justifyContent="space-between"
      >
        <SelectPublishers
          onChange={handleChangeSelectedPublishers}
          value={selectedPublishers}
        />
        <SelectPeriod
          onChange={handleChangeSelectedMonth}
          value={selectedMonth}
          year={year}
        />
      </Stack>

      <FulltimeServants
        month={selectedMonth}
        year={year}
        wholeYear={wholeYear}
        publishersGroup={selectedPublishers}
      />

      <AuxiliaryPioneers
        month={selectedMonth}
        year={year}
        wholeYear={wholeYear}
        publishersGroup={selectedPublishers}
      />

      <Publishers
        month={selectedMonth}
        year={year}
        wholeYear={wholeYear}
        publishersGroup={selectedPublishers}
      />

      <TotalStatistics year={year} publishersGroup={selectedPublishers} />
    </Stack>
  );
};

export default YearDetails;
