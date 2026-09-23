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
  const { children, disableHover, sx, ...rest } = props;

  // Until the sx merge below, a caller's sx replaced these styles, so every
  // button styled by its caller rendered with MUI's round shape and the
  // rounded square only showed on unstyled ones. That is the design, so the
  // shape still follows it while the rest of the defaults now always apply.
  const shapeRadius = 'sx' in props ? '50%' : 'var(--radius-l)';

  const redHover = 'rgba(var(--red-main-base), 0.12)';

  const getBackgroundColor = () => {
    switch (props.color) {
      case 'error':
        return redHover;

      default:
        return 'var(--accent-200)';
    }
  };

  return (
    <MUIIconButton
      color="inherit"
      edge="start"
      {...rest}
      sx={[
        {
          padding: '8px',
          borderRadius: shapeRadius,
          transition:
            'background-color var(--motion-fast) var(--ease-standard)',

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
                // a red icon carries its own meaning, so it is tinted in red
                "&:has(path[fill='var(--red-main)']):hover": {
                  backgroundColor: redHover,
                },
                "&:has(path[fill='var(--red-main)']) .MuiTouchRipple-ripple .MuiTouchRipple-child":
                  {
                    backgroundColor: redHover,
                  },
                '.MuiTouchRipple-ripple .MuiTouchRipple-child': {
                  borderRadius: shapeRadius,
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
        },
        // spread after the defaults, so a caller's sx refines them instead of
        // replacing them
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </MUIIconButton>
  );
};

export default IconButton;
