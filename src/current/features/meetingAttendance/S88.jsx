import Box from '@mui/material/Box';
import MonthSummary from './MonthSummary';

const S88 = ({ serviceYear }) => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      <MonthSummary month={8} serviceYear={serviceYear} />
      <MonthSummary month={9} serviceYear={serviceYear} />
      <MonthSummary month={10} serviceYear={serviceYear} />
      <MonthSummary month={11} serviceYear={serviceYear} />
      <MonthSummary month={0} serviceYear={serviceYear} />
      <MonthSummary month={1} serviceYear={serviceYear} />
      <MonthSummary month={2} serviceYear={serviceYear} />
      <MonthSummary month={3} serviceYear={serviceYear} />
      <MonthSummary month={4} serviceYear={serviceYear} />
      <MonthSummary month={5} serviceYear={serviceYear} />
      <MonthSummary month={6} serviceYear={serviceYear} />
      <MonthSummary month={7} serviceYear={serviceYear} />
    </Box>
  );
};

export default S88;
