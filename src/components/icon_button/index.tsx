import { FC } from 'react';
import { IconButtonProps, IconButton as MUIIconButton } from '@mui/material';

interface CustomIconButtonProps extends IconButtonProps {
  disableHover?: boolean;
}

/**
 * Component representing a custom icon button.
 *
 * @param {CustomIconButtonProps} props - Props for the CustomIconButton component.
 * @returns {JSX.Element} CustomIconButton component.
 */
const IconButton: FC<CustomIconButtonProps> = (props) => {
  const { children, disableHover, ...rest } = props;

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

        ...(disableHover
          ? {
              '&:hover': {
                backgroundColor: 'transparent',
              },
              '.MuiTouchRipple-ripple .MuiTouchRipple-child': {
                backgroundColor: 'transparent',
              },
            }
          : {
              '&:hover': {
                backgroundColor: getBackgroundColor(),
              },
              '.MuiTouchRipple-ripple .MuiTouchRipple-child': {
                borderRadius: 'var(--radius-l)',
                backgroundColor: getBackgroundColor(),
              },
            }),

        '@media (hover: none)': {
          '&:hover': {
            backgroundColor: 'transparent',
          },
        },

        '&:focus-visible': {
          outline: 'var(--accent-main) auto 1px',
        },

        ...props.sx,
      }}
      {...rest}
    >
      {children}
    </MUIIconButton>
  );
};

export default IconButton;
