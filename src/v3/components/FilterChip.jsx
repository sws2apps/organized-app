import PropTypes from 'prop-types';
import { Button } from '@mui/material';

const CPEFilterChip = ({ label, onClick, selected = false }) => {
  return (
    <Button
      disableRipple
      onClick={onClick}
      className={selected ? 'body-small-semibold' : 'body-small-regular'}
      sx={{
        padding: '8px 16px',
        color: selected ? 'var(--accent-dark)' : 'var(--accent-400)',
        borderRadius: 'var(--radius-l)',
        border: selected ? '1px solid var(--accent-dark)' : '1px solid var(--accent-400)',
        background: selected ? 'var(--accent-200)' : 'unset',
        '&:hover': {
          color: 'var(--accent-400)',
          background: 'var(--accent-150)',
        },
      }}
    >
      {label}
    </Button>
  );
};

CPEFilterChip.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
};

export default CPEFilterChip;
