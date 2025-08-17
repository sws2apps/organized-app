import useBreakpoints from '@hooks/useBreakpoints';
import { NavBarButtonProps } from './index.types';
import Button from '@components/button';
import { Box } from '@mui/material';

/**
 * NavBarButton component
 *
 * Renders a navigation bar button that adapts its appearance
 * based on screen size and props.
 *
 * - On desktop screens, or when `textImportant` is true,
 *   it renders a full-sized button with text.
 * - On smaller screens, it renders a compact icon-only button.
 */
const NavBarButton = (props: NavBarButtonProps) => {
  const { desktopUp } = useBreakpoints();

  const main = props.main || false;
  const textImportant = props.textImportant || false;
  const disabled = props.disabled || false;
  const iconColor = props.color
    ? `var(--${props.color}-dark)`
    : 'var(--accent-main)';

  return desktopUp || textImportant || main ? (
    <Button
      variant={main ? 'main' : 'secondary'}
      color={props.color}
      ariaLabel={props.text}
      onClick={props.onClick}
      startIcon={props.icon}
      disabled={disabled}
    >
      {props.text}
    </Button>
  ) : (
    !disabled && (
      <Box
        role="button"
        aria-label={props.text}
        sx={{
          padding: '10px',
          borderRadius: 'var(--radius-l)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            backgroundColor: 'var(--accent-200)',
          },
          '.MuiTouchRipple-ripple .MuiTouchRipple-child': {
            borderRadius: 'var(--radius-l)',
            backgroundColor: 'var(--accent-200)',
          },
          '&:focus-visible': {
            outline: `${iconColor} auto 1px`,
          },
          '& .MuiSvgIcon-root': {
            fill: iconColor,
            '& g, & g path': {
              fill: `${iconColor} !important`,
            },
          },
        }}
        onClick={props.onClick}
      >
        {props.icon}
      </Box>
    )
  );
};

export default NavBarButton;
