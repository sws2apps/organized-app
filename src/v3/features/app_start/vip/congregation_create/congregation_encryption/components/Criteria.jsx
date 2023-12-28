import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { Typography } from '@components';
import { IconCheck, IconClose } from '@icons';

const Criteria = ({ criteria, passed = false }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {!passed && <IconClose width={16} height={16} color="var(--red-main)" />}
      {passed && <IconCheck width={16} height={16} color="var(--green-main)" />}
      <Typography variant="label-small-regular" color={passed ? 'var(--green-main)' : 'var(--red-main)'}>
        {criteria}
      </Typography>
    </Box>
  );
};

Criteria.propTypes = {
  criteria: PropTypes.string,
  passed: PropTypes.bool,
};

export default Criteria;
