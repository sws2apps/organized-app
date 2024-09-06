import { Box, Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { YearDetailsProps } from './index.types';
import useYearDetails from './useYearDetails';
import MonthSelector from '@features/reports/service_year_month_selector/month_selector';
import SwitchWithLabel from '@components/switch_with_label';

const YearDetails = (props: YearDetailsProps) => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const { year, month, handleMonthChange, wholeYear, handleToggleWholeYear } =
    useYearDetails(props);

  return (
    <Stack spacing="16px" marginBottom="-24px">
      <Stack
        direction={laptopUp ? 'row' : 'column'}
        spacing="24px"
        alignItems={laptopUp ? 'center' : 'stretch'}
        justifyContent="space-between"
      >
        <MonthSelector
          year={year}
          value={month}
          onChange={handleMonthChange}
          readOnly={wholeYear}
          sx={{ flex: 1 }}
        />
        <Box>
          <SwitchWithLabel
            label={t('tr_wholeYearSetting')}
            checked={wholeYear}
            onChange={handleToggleWholeYear}
          />
        </Box>
      </Stack>
    </Stack>
  );
};

export default YearDetails;
