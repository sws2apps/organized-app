import Backdrop from '@mui/material/Backdrop';
import { DarkOverlayProps } from './dark_overlay.types';

/**
 * Dark overlay component.
 * @param {DarkOverlayProps} props - Props for DarkOverlay component.
 * @returns {JSX.Element} The rendered DarkOverlay component.
 */
const DarkOverlay = (props: DarkOverlayProps) => {
  return (
    <Backdrop
      sx={{
        color: 'var(--accent-dark-overlay)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flexDirection: 'column',
      }}
      open={props.overlayIsOpened}
    >
      {props.children}
    </Backdrop>
  );
};

export default DarkOverlay;
