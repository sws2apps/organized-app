import { FC } from 'react';
import { IconButtonProps, IconButton as MUIIconButton } from '@mui/material';

/**
 * Component representing a custom icon button.
 *
 * @param {IconButtonProps} props - Props for the CustomIconButton component.
 * @returns {JSX.Element} CustomIconButton component.
 */
const IconButton: FC<IconButtonProps> = (props) => {
  const { children } = props;

  return (
    <MUIIconButton
      color="inherit"
      edge="start"
      sx={{
        padding: '8px',
        borderRadius: 'var(--radius-l)',
        '&:hover': {
          backgroundColor: 'var(--accent-200)',
        },
        '@media (hover: none)': {
          backgroundColor: 'transparent',
        },
        '.MuiTouchRipple-ripple .MuiTouchRipple-child': {
          borderRadius: 'var(--radius-l)',
          backgroundColor: 'var(--accent-200)',
        },
      }}
      {...props}
    >
      {children}
    </MUIIconButton>
  );
};

export default IconButton;
