import { Button } from '@mui/material';

/**
 * Component representing a custom filter chip.
 *
 * @param {{
 *   label: string;
 *   onClick?: VoidFunction;
 *   selected?: boolean;
 * }} props - Props for the CustomFilterChip component.
 * @param {string} props.label - The label text for the chip.
 * @param {VoidFunction} [props.onClick] - Function to handle click event.
 * @param {boolean} [props.selected=false] - Whether the chip is selected or not.
 * @returns {JSX.Element} CustomFilterChip component.
 */
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
        border: selected
          ? '1px solid var(--accent-dark)'
          : '1px solid var(--accent-400)',
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
