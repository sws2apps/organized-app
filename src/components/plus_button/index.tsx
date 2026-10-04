import { IconButton } from '@mui/material';
import usePressFeedback from '@hooks/usePressFeedback';
import { IconAdd } from '@icons/index';
import { PlusButtonProps } from './index.types';

const activeSx = {
  backgroundColor: 'var(--accent-150)',
  border: '1px solid var(--accent-dark)',
  '& svg, & svg g, & svg g path': {
    fill: 'var(--accent-dark)',
  },
};

/**
 * Custom button component with a plus icon.
 * @param onClick - Optional function to handle click events.
 */
const PlusButton = ({ onClick, sx }: PlusButtonProps) => {
  const { pressed, pressHandlers, pressSx } = usePressFeedback();

  return (
    <IconButton
      disableRipple
      onClick={onClick}
      {...pressHandlers}
      sx={{
        border: '1px solid var(--accent-350)',
        borderRadius: 'var(--radius-m)',
        '&:hover': {
          '@media (hover: hover)': {
            backgroundColor: 'var(--accent-200)',
            border: '1px solid var(--accent-dark)',
            '& svg, & svg g, & svg g path': {
              fill: 'var(--accent-dark)',
            },
          },
        },
        '&:active': activeSx,

        '&:focus-visible': {
          outline: 'var(--accent-main) auto 1px',
        },

        '& svg, & svg g, & svg g path': {
          fill: 'var(--accent-350)',
        },
        ...(pressed && activeSx),
        ...pressSx,
        ...sx,
      }}
    >
      <IconAdd />
    </IconButton>
  );
};

export default PlusButton;
