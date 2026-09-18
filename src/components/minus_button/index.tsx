import { IconButton } from '@mui/material';
import usePressFeedback from '@hooks/usePressFeedback';
import { IconRemove } from '@icons/index';
import { MinusButtonProps } from './index.types';

// shared by :active and the held pressed state
const activeSx = {
  backgroundColor: 'var(--accent-150)',
  border: '1px solid var(--accent-dark)',
  '& svg, & svg g, & svg g path': {
    fill: 'var(--accent-dark)',
  },
};

/**
 * Custom minus button component.
 * @param onClick - Callback function for the click event.
 * @returns JSX element for the CustomMinusButton component.
 */
const MinusButton = ({ onClick, sx }: MinusButtonProps) => {
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

        '&:focus-visible': {
          outline: 'var(--accent-main) auto 1px',
        },

        '&:active': activeSx,
        '& svg, & svg g, & svg g path': {
          fill: 'var(--accent-350)',
        },
        // a quick tap is held pressed a little longer than :active lasts
        ...(pressed && activeSx),
        ...pressSx,
        ...sx,
      }}
    >
      <IconRemove />
    </IconButton>
  );
};

export default MinusButton;
