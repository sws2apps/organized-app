import { Chip } from '@mui/material';
import { IconCancelFilled } from '@icons/index';
import { MiniChipProps } from './index.types';

/**
 * Mini chip component.
 * @param label - The text label of the chip.
 * @param edit - Whether the chip is editable.
 * @param onDelete - Callback function to handle deletion.
 * @returns JSX element for the MiniChip component.
 */
const MiniChip = ({
  label,
  edit = false,
  onDelete,
  disabled = false,
  variant = 'main',
}: MiniChipProps) => {
  return (
    <Chip
      disabled={disabled}
      className="body-small-regular"
      label={label}
      onDelete={edit ? () => onDelete() : null}
      sx={{
        padding: edit ? '4px 4px 4px 12px' : '4px 12px',
        color: variant == 'main' ? 'var(--accent-dark)' : 'var(--grey-400)',
        borderRadius: 'var(--radius-max)',
        border:
          variant == 'main'
            ? '1px solid var(--accent-dark)'
            : '1px solid var(--grey-200)',
        background: variant == 'main' ? 'var(--accent-150)' : 'var(--grey-100)',
        minHeight: '26px',
        height: 'auto',
        '.MuiChip-label': {
          padding: edit ? '0px 2px 0px 0px' : 0,
        },
        '& svg': { height: '16px', width: '16px', cursor: 'pointer' },
        '& svg, & svg g, & svg g path': {
          fill: 'var(--accent-dark)',
        },
      }}
      deleteIcon={
        <div
          style={{
            margin: 0,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <IconCancelFilled />
        </div>
      }
    />
  );
};

export default MiniChip;
