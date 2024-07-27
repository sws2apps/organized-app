import { Box } from '@mui/material';
import { IconCheck, IconClose } from '@icons/index';
import Typography from '@components/typography';

const Criteria = ({
  criteria,
  passed = false,
}: {
  criteria: string;
  passed: boolean;
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {!passed && <IconClose width={16} height={16} color="var(--red-main)" />}
      {passed && <IconCheck width={16} height={16} color="var(--green-main)" />}
      <Typography
        className="label-small-regular"
        color={passed ? 'var(--green-main)' : 'var(--red-main)'}
      >
        {criteria}
      </Typography>
    </Box>
  );
};

export default Criteria;
