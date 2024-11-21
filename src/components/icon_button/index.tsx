import { FC } from 'react';
import { IconButton as MUIIconButton } from '@mui/material';
import { CustomIconButtonProps } from './index.types';

/**
 * Component representing a custom icon button.
 *
 * @param {CustomIconButtonProps} props - Props for the CustomIconButton component.
 * @returns {JSX.Element} CustomIconButton component.
 */
const IconButton: FC<CustomIconButtonProps> = (props) => {
  const { children, backgroundColor } = props;

  return (
    <MUIIconButton
      color="inherit"
      edge="start"
      sx={{
        padding: '8px',
        borderRadius: 'var(--radius-l)',
        backgroundColor: backgroundColor,
        '&:hover': {
          backgroundColor: 'var(--accent-200)',
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
