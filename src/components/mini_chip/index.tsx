import { Chip } from '@mui/material';
import { IconCancelFilled } from '@icons/index';

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
}: {
  label: string;
  edit?: boolean;
  onDelete?: VoidFunction;
  disabled?: boolean;
}) => {
  return (
    <Chip
      disabled={disabled}
      className="body-small-regular"
      label={label}
      onDelete={edit ? () => onDelete() : null}
      sx={{
        padding: edit ? '4px 4px 4px 12px' : '4px 12px',
        color: 'var(--accent-dark)',
        borderRadius: 'var(--radius-max)',
        border: '1px solid var(--accent-dark)',
        background: 'var(--accent-150)',
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
