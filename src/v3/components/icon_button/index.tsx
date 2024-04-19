import { IconButton, IconButtonProps } from '@mui/material';

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
    </IconButton>
  );
};

export default CustomIconButton;
