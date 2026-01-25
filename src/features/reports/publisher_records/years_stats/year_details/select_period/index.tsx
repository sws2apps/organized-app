import Select from '@components/select';
import { SelectPeriodProps } from './index.types';
import MenuItem from '@components/menuitem';
import { useAppTranslation } from '@hooks/index';
import { Box } from '@mui/material';
import Typography from '@components/typography';
import useSelectPeriod from './useSelectPeriod';

const SelectPeriod = (props: SelectPeriodProps) => {
  const { months } = useSelectPeriod({ year: props.year });
  const { t } = useAppTranslation();
  return (
    <Select
      label={t('tr_period')}
      value={props.value}
      onChange={props.onChange}
    >
      <MenuItem key={'service-year'} value={'service-year'}>
        {t('tr_serviceYear')}
      </MenuItem>
      <Box
        sx={{
          borderBottom: '1px solid var(--accent-200)',
          padding: '16px 16px 8px 16px',
        }}
      >
        <Typography className="body-small-semibold" color="var(--accent-dark)">
          {t('tr_months')}
        </Typography>
      </Box>
      {months.map((month) => (
        <MenuItem key={month.label} value={month.value}>
          {month.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default SelectPeriod;
