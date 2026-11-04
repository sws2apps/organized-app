import { Box } from '@mui/material';
import { useBreakpoints } from '@hooks/index';
import useStandardDuties from './useStandardDuties';
import DutyItem from './duty_item';

const StandardDuties = () => {
  const { mobile400Down } = useBreakpoints();
  const { duties } = useStandardDuties();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: mobile400Down
          ? 'minmax(0, 1fr)'
          : 'repeat(2, minmax(0, 1fr))',
        gap: 'var(--dialog-gap) var(--dialog-gap-mobile)',
      }}
    >
      {duties.map((duty) => (
        <DutyItem key={duty} duty={duty} />
      ))}
    </Box>
  );
};

export default StandardDuties;
