import { Box, Stack } from '@mui/material';
import { AssignmentsMonthContainerProps } from './index.types';
import useMonthContainer from './useMonthContainer';
import AssignmentItem from '../assignment_item';
import Typography from '@components/typography';

const MonthContainer = ({ monthData }: AssignmentsMonthContainerProps) => {
  const { monthLocale } = useMonthContainer(monthData.month);

  return (
    <Stack spacing={1}>
      <Box
        sx={{
          padding: '8px 16px',
          alignSelf: 'stretch',
          borderRadius: 'var(--radius-m)',
          background: 'var(--accent-200)',
        }}
      >
        <Typography
          className="h2"
          color="var(--accent-dark)"
          sx={{ textAlign: 'left' }}
        >
          {monthLocale}
        </Typography>
      </Box>

      {monthData.children.map((history) => (
        <AssignmentItem key={history.id} history={history} />
      ))}
    </Stack>
  );
};

export default MonthContainer;
