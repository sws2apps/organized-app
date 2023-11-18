import PropTypes from 'prop-types';
import { Typography } from '@components';
import { IconArrowBack } from '@icons';
import { Box } from '@mui/material';

const AccountType = ({ startIcon, text, onClick }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        padding: '24px',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px',
        borderRadius: 'var(--radius-l)',
        border: '1px solid var(--accent-300)',
        cursor: 'pointer',
        '&:hover': {
          border: '1px solid var(--accent-main)',
          background: 'var(--accent-150)',
          '& svg, & svg g, & svg g path': {
            fill: 'var(--accent-main)',
          },
          '& p': {
            color: 'var(--accent-main)',
          },
        },
      }}
      onClick={onClick}
    >
      {startIcon}
      <Typography variant="body-regular" color="var(--accent-400)" sx={{ flex: '1 0 0' }}>
        {text}
      </Typography>
      <IconArrowBack width={24} height={24} color="var(--accent-400)" sx={{ rotate: '180deg' }} />
    </Box>
  );
};

AccountType.propTypes = {
  startIcon: PropTypes.element,
  text: PropTypes.string,
  onClick: PropTypes.func,
};

export default AccountType;
