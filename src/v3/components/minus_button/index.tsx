import { IconButton } from '@mui/material';
import { IconRemove } from '@icons/index';

/**
 * Custom minus button component.
 * @param onClick - Callback function for the click event.
 * @returns JSX element for the CustomMinusButton component.
 */
const CustomMinusButton = (props: { onClick?: VoidFunction }) => {
  return (
    <IconButton
      disableRipple
      onClick={props.onClick}
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
        '&:active': {
          backgroundColor: 'var(--accent-150)',
          border: '1px solid var(--accent-dark)',
          '& svg, & svg g, & svg g path': {
            fill: 'var(--accent-dark)',
          },
        },
        '& svg, & svg g, & svg g path': {
          fill: 'var(--accent-350)',
        },
      }}
    >
      <IconRemove />
    </IconButton>
  );
};

export default CustomMinusButton;
