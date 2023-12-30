import { Box } from '@mui/material';
import { Typography } from '@components';
import { IconCheck, IconClose } from '@icons';

const Criteria = ({ criteria, passed = false }: { criteria: string; passed: boolean }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {!passed && <IconClose width={16} height={16} color="var(--red-main)" />}
      {passed && <IconCheck width={16} height={16} color="var(--green-main)" />}
      <Typography className="label-small-regular" color={passed ? 'var(--green-main)' : 'var(--red-main)'}>
        {criteria}
      </Typography>
    </Box>
  );
};

export default Criteria;
