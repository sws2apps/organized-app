import { IconButton } from '@mui/material';
import { IconAdd } from '@icons';

const CPEPlusButton = () => {
  return (
    <IconButton
      disableRipple
      sx={{
        border: '1px solid var(--accent-350)',
        borderRadius: 'var(--radius-m)',
        '&:hover': {
          background: 'var(--accent-200)',
          border: '1px solid var(--accent-dark)',
          '& svg, & svg g, & svg g path': {
            fill: 'var(--accent-dark)',
          },
        },
        '&:active': {
          background: 'var(--accent-150)',
        },
        '& svg, & svg g, & svg g path': {
          fill: 'var(--accent-350)',
        },
      }}
    >
      <IconAdd />
    </IconButton>
  );
};

export default CPEPlusButton;
