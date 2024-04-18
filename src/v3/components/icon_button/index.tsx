import { IconButton, IconButtonProps } from '@mui/material';

/**
 * Component representing a custom icon button.
 *
 * @param {IconButtonProps} props - Props for the CustomIconButton component.
 * @returns {JSX.Element} CustomIconButton component.
 */
const CustomIconButton = (props: IconButtonProps) => {
  const { children } = props;

  return (
    <IconButton
      color="inherit"
      edge="start"
      sx={{
        padding: '8px',
        borderRadius: 'var(--radius-l)',
        '&:hover': {
          backgroundColor: 'var(--accent-150)',
        },
        '.MuiTouchRipple-ripple .MuiTouchRipple-child': {
          borderRadius: 'var(--radius-l)',
          backgroundColor: 'var(--accent-200)',
        },
      }}
      {...props}
    >
      {children}
    </IconButton>
  );
};

export default CustomIconButton;
