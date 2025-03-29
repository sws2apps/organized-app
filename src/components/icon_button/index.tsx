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

  const getBackgroundColor = () => {
    switch (props.color) {
      case 'error':
        return 'var(--red-secondary)';

      default:
        return 'var(--accent-200)';
    }
  };

  return (
    <MUIIconButton
      color="inherit"
      edge="start"
      sx={{
        padding: '8px',
        borderRadius: 'var(--radius-l)',
        '&:hover': {
          backgroundColor: getBackgroundColor(),
        },
        '@media (hover: none)': {
          backgroundColor: 'transparent',
        },
        '.MuiTouchRipple-ripple .MuiTouchRipple-child': {
          borderRadius: 'var(--radius-l)',
          backgroundColor: getBackgroundColor(),
        },
        '&:focus-visible': {
          outline: 'var(--accent-main) auto 1px',
        },
      }}
      {...props}
    >
      {children}
    </MUIIconButton>
  );
};

export default IconButton;
