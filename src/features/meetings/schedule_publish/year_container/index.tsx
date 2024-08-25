import { Box, Stack } from '@mui/material';
import { YearContainerProps } from './index.types';
import useYearContainer from './useYearContainer';
import Checkbox from '@components/checkbox';
import Divider from '@components/divider';
import MonthItem from '../month_item';

const YearContainer = ({ data, onChange }: YearContainerProps) => {
  const { checked, indeterminate } = useYearContainer(data.months);

  return (
    <Stack spacing="8px" alignItems="flex-start" minWidth="230px" flex={1}>
      <Box
        sx={{
          padding: '8px',
          backgroundColor: 'var(--accent-150)',
          borderRadius: '8px',
          width: '100%',
        }}
      >
        <Checkbox
          className="h4"
          label={data.year}
          sx={{ marginLeft: '4px' }}
          checked={checked}
          indeterminate={indeterminate}
          onChange={(e) => onChange(e.target.checked, data.year)}
        />
      </Box>

      <Stack
        divider={<Divider color="var(--accent-200)" />}
        spacing="4px"
        width="100%"
        padding="0px 4px 0px 16px"
      >
        {data.months.map((record) => (
          <MonthItem key={record.month} data={record} onChange={onChange} />
        ))}
      </Stack>
    </Stack>
  );
};

export default YearContainer;
