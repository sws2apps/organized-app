import PropTypes from 'prop-types';
import { Button } from '@mui/material';

const CPEFilterChip = ({
  label,
  onClick,
  selected = false,
}: {
  label: string;
  onClick?: VoidFunction;
  selected?: boolean;
}) => {
  return (
    <Button
      disableRipple
      onClick={selected ? null : onClick}
      className={selected ? 'body-small-semibold' : 'body-small-regular'}
      sx={{
        fontFeatureSettings: '"cv05"',
        padding: '8px 16px',
        color: selected ? 'var(--accent-dark)' : 'var(--accent-400)',
        borderRadius: 'var(--radius-l)',
        border: selected ? '1px solid var(--accent-dark)' : '1px solid var(--accent-400)',
        backgroundColor: selected ? 'var(--accent-200)' : 'unset',
        cursor: selected ? 'initial' : 'pointer',
        minHeight: '34px',
        '&:hover': {
          color: selected ? 'var(--accent-dark)' : 'var(--accent-400)',
          backgroundColor: selected ? 'var(--accent-200)' : 'var(--accent-150)',
          '@media (hover: none)': {
            backgroundColor: 'unset',
            color: 'var(--accent-400)',
          },
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
