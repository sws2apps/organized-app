/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { YearDetailsProps } from './index.types';
import useYearDetails from './useYearDetails';
import AuxiliaryPioneers from '../auxiliary_pioneers';
import FulltimeServants from '../fulltime_servants';
import MonthSelector from '@features/reports/service_year_month_selector/month_selector';
import Publishers from '../publishers';
import SwitchWithLabel from '@components/switch_with_label';
import TotalStatistics from '../total_statistics';
import Tooltip from '@components/tooltip';
import Select from '@components/select';
import MenuItem from '@components/menuitem';
import SelectPublishers from './select_publishers';
import SelectPeriod from './select_period';

const YearDetails = (props: YearDetailsProps) => {
  const { t } = useAppTranslation();

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
        {/* <Tooltip
          title={t('tr_wholeYearIsSelected')}
          delaySpeed={'fast'}
          show={wholeYear}
          followCursor
          sx={{ flex: 1 }}
        >
          <MonthSelector
            year={year}
            value={month}
            onChange={handleMonthChange}
            readOnly={wholeYear}
            sx={{
              flex: 1,
            }}
          />
        </Tooltip>
        <Box>
          <SwitchWithLabel
            label={t('tr_wholeYearSetting')}
            checked={wholeYear}
            onChange={handleToggleWholeYear}
          /> 
        </Box> */}
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
