import { IconFullscreen } from '@components/icons';
import { Box } from '@mui/material';

/**
 * FullscreenButton Component
 *
 * Renders a fullscreen icon button, visible based on the `show` prop.
 *
 * @param {boolean} show - Controls visibility (`true`: visible, `false`: hidden).
 *
 * Styles:
 * - Positioned absolutely at bottom-right (requires parent `position: relative`).
 * - Customizable colors via CSS variables: `--accent-200`, `--accent-dark`.
 * - Styled with padding, border, and pointer cursor for interactivity.
 *
 * Example:
 * ```tsx
 * <FullscreenButton show={true} />
 * ```
 */
const FullscreenButton = ({ show }: { show: boolean }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        right: '10px',
        bottom: '15px',
        backgroundColor: 'var(--accent-200)',
        padding: '8px',
        display: show ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--accent-dark)',
        borderRadius: 'var(--radius-m)',
        cursor: 'pointer',
      }}
    >
      <IconFullscreen color="var(--accent-dark)" />
    </Box>
  );
};

export default FullscreenButton;
