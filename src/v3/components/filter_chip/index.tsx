import { Button } from '@mui/material';

const CustomFilterChip = ({
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
      onClick={onClick}
      className={selected ? 'body-small-semibold' : 'body-small-regular'}
      sx={{
        fontFeatureSettings: '"cv05"',
        padding: '8px 16px',
        color: selected ? 'var(--accent-dark)' : 'var(--accent-400)',
        borderRadius: 'var(--radius-l)',
        border: selected ? '1px solid var(--accent-dark)' : '1px solid var(--accent-400)',
        backgroundColor: selected ? 'var(--accent-200)' : 'unset',
        minHeight: '34px',
        '&:hover': {
          color: selected ? 'var(--accent-dark)' : 'var(--accent-400)',
          backgroundColor: selected ? 'var(--accent-200)' : 'var(--accent-150)',
          '@media (hover: none)': {
            backgroundColor: selected ? 'var(--accent-200)' : 'unset',
            color: selected ? 'var(--accent-dark)' : 'var(--accent-400)',
          },
        },
      }}
    >
      {label}
    </Button>
  );
};

export default CustomFilterChip;
