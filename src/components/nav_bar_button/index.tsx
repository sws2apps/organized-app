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

  return desktopUp || textImportant ? (
    <Button
      variant={main ? 'main' : 'secondary'}
      onClick={props.onClick}
      startIcon={props.icon}
    >
      {props.text}
    </Button>
  ) : (
    <Box
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
          outline: 'var(--accent-main) auto 1px',
        },
        '& .MuiSvgIcon-root': {
          fill: 'var(--accent-main)',
          '& g, & g path': {
            fill: 'var(--accent-main) !important',
          },
        },
      }}
      onClick={props.onClick}
    >
      {props.icon}
    </Box>
  );
};

export default NavBarButton;
