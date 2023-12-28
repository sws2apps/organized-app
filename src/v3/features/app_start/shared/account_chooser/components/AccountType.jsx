import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { Typography } from '@components';
import { IconArrowBack } from '@icons';

const AccountType = ({ startIcon, text, onClick }) => {
  return (
    <Button
      disableRipple
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        textTransform: 'none',
        padding: '24px',
        gap: '16px',
        borderRadius: 'var(--radius-l)',
        border: '1px solid var(--accent-300)',
        textAlign: 'left',
        '&:hover': {
          border: '1px solid var(--accent-main)',
          background: 'var(--accent-150)',
          '& svg, & svg g, & svg g path': {
            fill: 'var(--accent-main)',
          },
          '& p': {
            color: 'var(--accent-main)',
          },
          '@media (hover: none)': {
            border: '1px solid var(--accent-300)',
            background: 'unset',
            '& svg, & svg g, & svg g path': {
              fill: 'var(--accent-400)',
            },
            '& p': {
              color: 'var(--accent-400)',
            },
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
    </Button>
  );
};

AccountType.propTypes = {
  startIcon: PropTypes.element,
  text: PropTypes.string,
  onClick: PropTypes.func,
};

export default AccountType;
