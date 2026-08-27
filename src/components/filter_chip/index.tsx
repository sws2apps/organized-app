import { Button } from '@mui/material';

/**
 * Component representing a custom filter chip.
 *
 * Uses an invisible bold `::after` pseudo-element to always reserve the
 * semibold text width, preventing layout shift when toggling selection.
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
      data-text={label}
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
        display: 'inline-flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        '&::after': {
          content: 'attr(data-text)',
          fontWeight: 520,
          fontSize: '14px',
          letterSpacing: '0px',
          fontFeatureSettings: '"cv05"',
          height: 0,
          visibility: 'hidden',
          overflow: 'hidden',
          pointerEvents: 'none',
          userSelect: 'none',
          display: 'block',
          '@media (max-width: 767px)': {
            fontWeight: 450,
            fontSize: '13px',
            letterSpacing: '0.065px',
          },
        },
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
