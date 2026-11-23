import { Box, Stack } from '@mui/material';
import { YearContainerProps } from './index.types';
import useYearContainer from './useYearContainer';
import Checkbox from '@components/checkbox';
import Divider from '@components/divider';
import MonthItem from '../month_item';
import Typography from '@components/typography';

const YearContainer = ({
  data,
  onChange,
  readOnly,
  disabled,
}: YearContainerProps) => {
  const { checked, indeterminate } = useYearContainer(data.months);

  return (
    <Stack
      spacing="8px"
      sx={{
        alignItems: 'flex-start',
        minWidth: 0,
        width: '100%',
        flex: 1,
      }}
    >
      <Box
        sx={{
          padding: '8px',
          backgroundColor: 'var(--accent-150)',
          borderRadius: 'var(--radius-m)',
          width: '100%',
        }}
      >
        {readOnly ? (
          <Typography className="h4" sx={{ padding: '4px 8px' }}>
            {data.year}
          </Typography>
        ) : (
          <Checkbox
            className="h4"
            label={data.year}
            sx={{ marginLeft: '4px' }}
            disabled={disabled}
            checked={checked}
            indeterminate={indeterminate}
            onChange={(e) => onChange(e.target.checked, data.year)}
          />
        )}
      </Box>

      <Stack
        divider={<Divider color="var(--accent-200)" />}
        spacing="4px"
        sx={{
          width: '100%',
          padding: '0px 8px',
        }}
      >
        {data.months.map((record) => (
          <MonthItem
            key={record.month}
            data={record}
            onChange={onChange}
            readOnly={readOnly}
            disabled={disabled}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default YearContainer;
